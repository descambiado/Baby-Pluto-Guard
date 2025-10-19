"""
Sistema de Baseline para BabyPluto
Permite crear, guardar y comparar estados del sistema
"""

import json
import sqlite3
from datetime import datetime
from typing import Dict, List, Any, Optional
from pathlib import Path

from .processes import scan_processes
from .ports import scan_ports
from .startup import scan_startup_items
from .integrity import scan_file_integrity, get_critical_files


class BaselineManager:
    def __init__(self, db_path: str = "data/baselines.db"):
        self.db_path = db_path
        self._init_database()
    
    def _init_database(self):
        """Inicializar base de datos SQLite"""
        Path(self.db_path).parent.mkdir(parents=True, exist_ok=True)
        
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS baselines (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    description TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    is_active BOOLEAN DEFAULT 0,
                    processes TEXT,
                    ports TEXT,
                    startup_items TEXT,
                    file_integrity TEXT,
                    metrics TEXT
                )
            """)
            
            conn.execute("""
                CREATE TABLE IF NOT EXISTS baseline_comparisons (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    baseline_id INTEGER,
                    compared_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    differences TEXT,
                    risk_score REAL,
                    FOREIGN KEY (baseline_id) REFERENCES baselines (id)
                )
            """)
            conn.commit()
    
    def create_baseline(self, name: str, description: str = "") -> Dict[str, Any]:
        """Crear un nuevo baseline del estado actual del sistema"""
        print(f"Creating baseline: {name}")
        
        # Escanear estado actual
        processes = scan_processes()
        ports = scan_ports()
        startup_items = scan_startup_items()
        
        # Escanear archivos críticos
        critical_files = get_critical_files()
        file_integrity = scan_file_integrity(critical_files)
        
        # Calcular métricas
        metrics = {
            "total_processes": len(processes),
            "total_ports": len(ports),
            "total_startup_items": len(startup_items),
            "total_files": len(file_integrity),
            "safe_processes": sum(1 for p in processes if p["risk_level"] == "safe"),
            "safe_ports": sum(1 for p in ports if p["risk_level"] == "safe"),
        }
        
        baseline_data = {
            "name": name,
            "description": description,
            "created_at": datetime.now().isoformat(),
            "processes": processes,
            "ports": ports,
            "startup_items": startup_items,
            "file_integrity": file_integrity,
            "metrics": metrics
        }
        
        # Guardar en DB
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.execute("""
                INSERT INTO baselines 
                (name, description, processes, ports, startup_items, file_integrity, metrics, is_active)
                VALUES (?, ?, ?, ?, ?, ?, ?, 1)
            """, (
                name,
                description,
                json.dumps(processes),
                json.dumps(ports),
                json.dumps(startup_items),
                json.dumps(file_integrity),
                json.dumps(metrics)
            ))
            
            # Desactivar otros baselines
            conn.execute("UPDATE baselines SET is_active = 0 WHERE id != ?", (cursor.lastrowid,))
            conn.commit()
            
            baseline_id = cursor.lastrowid
        
        return {
            "id": baseline_id,
            **baseline_data
        }
    
    def get_active_baseline(self) -> Optional[Dict[str, Any]]:
        """Obtener el baseline activo"""
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.execute("""
                SELECT * FROM baselines WHERE is_active = 1 ORDER BY created_at DESC LIMIT 1
            """)
            row = cursor.fetchone()
            
            if not row:
                return None
            
            return self._row_to_baseline(row)
    
    def get_baseline(self, baseline_id: int) -> Optional[Dict[str, Any]]:
        """Obtener un baseline específico"""
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.execute("SELECT * FROM baselines WHERE id = ?", (baseline_id,))
            row = cursor.fetchone()
            
            if not row:
                return None
            
            return self._row_to_baseline(row)
    
    def list_baselines(self) -> List[Dict[str, Any]]:
        """Listar todos los baselines"""
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.execute("SELECT * FROM baselines ORDER BY created_at DESC")
            rows = cursor.fetchall()
            
            return [self._row_to_baseline(row, include_data=False) for row in rows]
    
    def set_active_baseline(self, baseline_id: int) -> bool:
        """Establecer un baseline como activo"""
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("UPDATE baselines SET is_active = 0")
            conn.execute("UPDATE baselines SET is_active = 1 WHERE id = ?", (baseline_id,))
            conn.commit()
        return True
    
    def delete_baseline(self, baseline_id: int) -> bool:
        """Eliminar un baseline"""
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("DELETE FROM baseline_comparisons WHERE baseline_id = ?", (baseline_id,))
            conn.execute("DELETE FROM baselines WHERE id = ?", (baseline_id,))
            conn.commit()
        return True
    
    def compare_with_baseline(self, baseline_id: Optional[int] = None) -> Dict[str, Any]:
        """Comparar estado actual con baseline"""
        if baseline_id:
            baseline = self.get_baseline(baseline_id)
        else:
            baseline = self.get_active_baseline()
        
        if not baseline:
            raise ValueError("No baseline found")
        
        # Escanear estado actual
        current_processes = scan_processes()
        current_ports = scan_ports()
        current_startup = scan_startup_items()
        
        # Comparar
        differences = {
            "processes": self._compare_lists(
                baseline["processes"],
                current_processes,
                key="name"
            ),
            "ports": self._compare_lists(
                baseline["ports"],
                current_ports,
                key="local_port"
            ),
            "startup_items": self._compare_lists(
                baseline["startup_items"],
                current_startup,
                key="name"
            ),
            "summary": {}
        }
        
        # Calcular risk score
        risk_score = self._calculate_risk_score(differences)
        
        # Resumen
        differences["summary"] = {
            "new_processes": len(differences["processes"]["added"]),
            "removed_processes": len(differences["processes"]["removed"]),
            "new_ports": len(differences["ports"]["added"]),
            "closed_ports": len(differences["ports"]["removed"]),
            "new_startup": len(differences["startup_items"]["added"]),
            "removed_startup": len(differences["startup_items"]["removed"]),
            "risk_score": risk_score,
            "risk_level": self._get_risk_level(risk_score)
        }
        
        # Guardar comparación
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                INSERT INTO baseline_comparisons (baseline_id, differences, risk_score)
                VALUES (?, ?, ?)
            """, (baseline["id"], json.dumps(differences), risk_score))
            conn.commit()
        
        return {
            "baseline": {
                "id": baseline["id"],
                "name": baseline["name"],
                "created_at": baseline["created_at"]
            },
            "compared_at": datetime.now().isoformat(),
            "differences": differences
        }
    
    def _row_to_baseline(self, row: sqlite3.Row, include_data: bool = True) -> Dict[str, Any]:
        """Convertir row de DB a dict"""
        baseline = {
            "id": row["id"],
            "name": row["name"],
            "description": row["description"],
            "created_at": row["created_at"],
            "is_active": bool(row["is_active"]),
            "metrics": json.loads(row["metrics"])
        }
        
        if include_data:
            baseline.update({
                "processes": json.loads(row["processes"]),
                "ports": json.loads(row["ports"]),
                "startup_items": json.loads(row["startup_items"]),
                "file_integrity": json.loads(row["file_integrity"])
            })
        
        return baseline
    
    def _compare_lists(self, baseline_items: List[Dict], current_items: List[Dict], key: str) -> Dict[str, List]:
        """Comparar dos listas de items"""
        baseline_keys = {item[key] for item in baseline_items}
        current_keys = {item[key] for item in current_items}
        
        added_keys = current_keys - baseline_keys
        removed_keys = baseline_keys - current_keys
        
        return {
            "added": [item for item in current_items if item[key] in added_keys],
            "removed": [item for item in baseline_items if item[key] in removed_keys],
            "unchanged": len(baseline_keys & current_keys)
        }
    
    def _calculate_risk_score(self, differences: Dict) -> float:
        """Calcular score de riesgo (0-100)"""
        score = 0.0
        
        # Nuevos procesos sospechosos
        new_procs = differences["processes"]["added"]
        score += sum(20 for p in new_procs if p["risk_level"] == "high")
        score += sum(10 for p in new_procs if p["risk_level"] == "medium")
        score += sum(3 for p in new_procs if p["risk_level"] == "low")
        
        # Nuevos puertos de riesgo
        new_ports = differences["ports"]["added"]
        score += sum(15 for p in new_ports if p["risk_level"] == "high")
        score += sum(8 for p in new_ports if p["risk_level"] == "medium")
        
        # Nuevos startup items
        new_startup = differences["startup_items"]["added"]
        score += sum(25 for s in new_startup if s["risk_level"] == "high")
        score += sum(12 for s in new_startup if s["risk_level"] == "medium")
        
        return min(score, 100.0)
    
    def _get_risk_level(self, score: float) -> str:
        """Convertir score a nivel de riesgo"""
        if score >= 70:
            return "high"
        elif score >= 40:
            return "medium"
        elif score >= 10:
            return "low"
        return "safe"


# Instancia global
baseline_manager = BaselineManager()
