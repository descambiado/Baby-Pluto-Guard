import { ScanResults } from '@/types/security';

export function exportToJSON(data: ScanResults, filename: string = 'babypluto-scan') {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  downloadBlob(blob, `${filename}-${Date.now()}.json`);
}

export function exportToHTML(data: ScanResults, filename: string = 'babypluto-report') {
  const html = generateHTMLReport(data);
  const blob = new Blob([html], { type: 'text/html' });
  downloadBlob(blob, `${filename}-${Date.now()}.html`);
}

export function exportToCSV(data: any[], filename: string = 'babypluto-data') {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => JSON.stringify(row[header] || '')).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  downloadBlob(blob, `${filename}-${Date.now()}.csv`);
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function generateHTMLReport(data: ScanResults): string {
  const timestamp = new Date(data.timestamp).toLocaleString();
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BabyPluto Security Report</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background: #0f0f0f;
      color: #e0e0e0;
    }
    h1 { color: #00ff88; border-bottom: 2px solid #00ff88; padding-bottom: 10px; }
    h2 { color: #00d4ff; margin-top: 30px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; background: #1a1a1a; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #333; }
    th { background: #252525; color: #00ff88; }
    .high { color: #ff4444; font-weight: bold; }
    .medium { color: #ffaa00; }
    .low { color: #ffdd00; }
    .safe { color: #00ff88; }
    .metric { display: inline-block; margin: 10px 20px 10px 0; padding: 15px; background: #1a1a1a; border-radius: 8px; }
    .metric-value { font-size: 2em; font-weight: bold; color: #00ff88; }
    .metric-label { color: #888; font-size: 0.9em; }
  </style>
</head>
<body>
  <h1>🛡️ BabyPluto Security Report</h1>
  <p><strong>Scan Time:</strong> ${timestamp}</p>
  <p><strong>Scan Duration:</strong> ${(data.scan_duration / 1000).toFixed(2)}s</p>
  
  <h2>📊 Security Metrics</h2>
  <div>
    <div class="metric">
      <div class="metric-value">${data.metrics.total_processes}</div>
      <div class="metric-label">Total Processes</div>
    </div>
    <div class="metric">
      <div class="metric-value">${data.metrics.suspicious_processes}</div>
      <div class="metric-label">Suspicious Processes</div>
    </div>
    <div class="metric">
      <div class="metric-value">${data.metrics.open_ports}</div>
      <div class="metric-label">Open Ports</div>
    </div>
    <div class="metric">
      <div class="metric-value">${data.metrics.high_risk_ports}</div>
      <div class="metric-label">High Risk Ports</div>
    </div>
  </div>
  
  <h2>🚨 Active Alerts</h2>
  <table>
    <thead>
      <tr>
        <th>Type</th>
        <th>Severity</th>
        <th>Title</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      ${data.alerts.map(alert => `
        <tr>
          <td>${alert.type}</td>
          <td class="${alert.severity}">${alert.severity.toUpperCase()}</td>
          <td>${alert.title}</td>
          <td>${alert.description}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  
  <h2>⚙️ Running Processes</h2>
  <table>
    <thead>
      <tr>
        <th>PID</th>
        <th>Name</th>
        <th>User</th>
        <th>CPU %</th>
        <th>Memory %</th>
        <th>Risk</th>
      </tr>
    </thead>
    <tbody>
      ${data.processes.slice(0, 50).map(proc => `
        <tr>
          <td>${proc.pid}</td>
          <td>${proc.name}</td>
          <td>${proc.username}</td>
          <td>${proc.cpu_percent.toFixed(1)}%</td>
          <td>${proc.memory_percent.toFixed(1)}%</td>
          <td class="${proc.risk_level}">${proc.risk_level.toUpperCase()}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  
  <h2>🔌 Open Ports</h2>
  <table>
    <thead>
      <tr>
        <th>Port</th>
        <th>Protocol</th>
        <th>Process</th>
        <th>Status</th>
        <th>Risk</th>
      </tr>
    </thead>
    <tbody>
      ${data.ports.map(port => `
        <tr>
          <td>${port.local_port}</td>
          <td>${port.protocol.toUpperCase()}</td>
          <td>${port.process_name || 'N/A'}</td>
          <td>${port.status}</td>
          <td class="${port.risk_level}">${port.risk_level.toUpperCase()}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  
  <footer style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #333; text-align: center; color: #666;">
    <p>Generated by BabyPluto Security Scanner v1.0</p>
  </footer>
</body>
</html>`;
}
