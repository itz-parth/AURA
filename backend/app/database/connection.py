import ssl
from urllib.parse import urlparse, parse_qsl, urlencode, urlunparse

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base

from app.core.config import DATABASE_URL

if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

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
