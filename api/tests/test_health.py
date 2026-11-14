import pytest
from fastapi.testclient import TestClient

import main

client = TestClient(main.app)


@pytest.mark.parametrize("path", ["/api/health", "/health"])
def test_health_reports_engine(path: str) -> None:
    res = client.get(path)
    assert res.status_code == 200
    body = res.json()
    assert body["status"] == "ok"
    assert body["engine"] == "citecheck"
    assert isinstance(body["engine_version"], str) and body["engine_version"]


def test_placeholder_until_engine_is_installed(monkeypatch) -> None:
    def missing(_name: str) -> str:
        raise main.metadata.PackageNotFoundError

    monkeypatch.setattr(main.metadata, "version", missing)
    assert main.engine_version() == "not installed"
