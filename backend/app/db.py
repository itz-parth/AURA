import os
import ssl
from urllib.parse import urlparse, parse_qsl, urlencode, urlunparse
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://postgres:postgres@localhost:5432/aura",
)

# Normalize sync postgresql:// URL to async postgresql+asyncpg:// if needed
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

# asyncpg doesn't accept sslmode/channel_binding query params;
# strip them and enable SSL via connect_args for Neon/hosted Postgres
parsed = urlparse(DATABASE_URL)
query = dict(parse_qsl(parsed.query))
for key in ("sslmode", "channel_binding"):
    query.pop(key, None)
DATABASE_URL = urlunparse(parsed._replace(query=urlencode(query)))

connect_args = {}
if parsed.hostname and ("neon" in parsed.hostname or "aws" in parsed.hostname):
    connect_args["ssl"] = ssl.create_default_context()

engine = create_async_engine(DATABASE_URL, echo=True, connect_args=connect_args)
async_session = async_sessionmaker(engine, expire_on_commit=False)
Base = declarative_base()


async def get_db():
    async with async_session() as session:
        yield session
