from security.processes import analyze_process_risk, scan_processes


def test_analyze_process_risk_handles_none_cmdline():
    """Regression test: psutil returns {'cmdline': None} for protected processes
    like 'System Idle Process' or 'System'. dict.get('cmdline', []) does not fall
    back to [] in that case because the key exists, it's just None, which used to
    crash ' '.join(...) on every call to /api/processes."""
    proc_info = {"name": "System", "cpu_percent": 0.0, "cmdline": None, "username": None}
    assert analyze_process_risk(proc_info) == "low"


def test_analyze_process_risk_missing_cmdline_key():
    proc_info = {"name": "svchost.exe", "cpu_percent": 5.0, "username": "SYSTEM"}
    assert analyze_process_risk(proc_info) == "safe"


def test_analyze_process_risk_high_risk_name():
    proc_info = {"name": "miner.exe", "cpu_percent": 0.0, "cmdline": [], "username": "user"}
    assert analyze_process_risk(proc_info) == "high"


def test_analyze_process_risk_high_risk_in_cmdline():
    proc_info = {
        "name": "python.exe",
        "cpu_percent": 0.0,
        "cmdline": ["python.exe", "run_trojan.py"],
        "username": "user",
    }
    assert analyze_process_risk(proc_info) == "high"


def test_analyze_process_risk_high_cpu_is_medium():
    proc_info = {"name": "chrome.exe", "cpu_percent": 95.0, "cmdline": [], "username": "user"}
    assert analyze_process_risk(proc_info) == "medium"


def test_scan_processes_returns_real_data():
    """Smoke test against the real OS: every process the API is willing to return
    must already carry a risk_level, i.e. analyze_process_risk must not have
    crashed on any of them (this is exactly what /api/processes exposes)."""
    processes = scan_processes()
    assert len(processes) > 0
    for proc in processes:
        assert proc["risk_level"] in {"safe", "low", "medium", "high"}
        assert isinstance(proc["cmdline"], list)
