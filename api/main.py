"""Thin HTTP layer over the citecheck engine.

This service adds routing and nothing else. Every check the site shows is
computed by the pinned `citecheck` package, so the site runs the same code
the published benchmarks measure.
"""

from importlib import metadata

from fastapi import APIRouter, FastAPI

ENGINE = "citecheck"


def engine_version() -> str:
    """Installed engine version, or a placeholder until the engine is a dependency."""
    try:
        return metadata.version(ENGINE)
    except metadata.PackageNotFoundError:
        return "not installed"


router = APIRouter()


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "engine": ENGINE, "engine_version": engine_version()}


app = FastAPI(title="site-api", docs_url=None, redoc_url=None)

# Vercel rewrites /api/(.*) to this service. Whether the service then sees the
# path with or without the /api prefix depends on routing configuration, so
# both are served. Remove one after the first deploy shows which is used.
app.include_router(router, prefix="/api")
app.include_router(router)
