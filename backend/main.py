from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes.auth import router as auth_router
from api.routes.favorites import router as favorites_router
from core.config import settings
from db.session import Base, engine
from models import favorite, user  # noqa: F401  (ensures the models are registered before create_all)


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title="LitScout API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(favorites_router)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
