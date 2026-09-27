from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_system_info_endpoint():
    response = client.get("/api/system/info")
    assert response.status_code == 200
    data = response.json()
    assert "os" in data
    assert "python_version" in data


def test_processes_endpoint_does_not_crash():
    """Regression test: this endpoint used to fail on every single call with
    "can only join an iterable" because analyze_process_risk assumed
    proc_info['cmdline'] was always a list, but psutil returns None for it on
    protected processes like System Idle Process."""
    response = client.get("/api/processes")
    assert response.status_code == 200
    assert "processes" in response.json()


def test_ports_endpoint():
    response = client.get("/api/ports")
    assert response.status_code == 200
    assert "ports" in response.json()
