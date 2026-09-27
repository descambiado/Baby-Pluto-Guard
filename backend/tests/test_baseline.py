from security.baseline import BaselineManager


def test_baseline_manager_imports_scan_open_ports():
    """Regression test: security/baseline.py used to import a function called
    scan_ports, which has never existed in security/ports.py (the real name is
    scan_open_ports). That ImportError crashed the whole backend on startup,
    before uvicorn ever ran. Importing this module at all is the real assertion;
    if the import is wrong again, pytest fails at collection time."""
    from security.baseline import scan_open_ports

    assert callable(scan_open_ports)


def test_baseline_manager_creates_and_activates(tmp_path):
    manager = BaselineManager(db_path=str(tmp_path / "test_baselines.db"))
    created = manager.create_baseline("test", "created by tests")
    assert created["id"] > 0
    assert created["name"] == "test"

    active = manager.get_active_baseline()
    assert active is not None
    assert active["id"] == created["id"]
    assert active["name"] == "test"
