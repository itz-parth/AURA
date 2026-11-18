import asyncio
import ssl
from logging.config import fileConfig
from urllib.parse import urlparse, parse_qsl, urlencode, urlunparse

from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine
from alembic import context

from app.models import Base

load_dotenv()

config = context.config

# Override URL from environment (.env) if available
import os
env_url = os.getenv("DATABASE_URL")
if env_url:
    config.set_main_option("sqlalchemy.url", env_url)

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def _normalize_url(url):
    # Normalize postgresql:// → postgresql+asyncpg://
    if url.startswith("postgresql://"):
        url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
    # Strip sslmode/channel_binding (not supported by asyncpg directly)
    parsed = urlparse(url)
    query = dict(parse_qsl(parsed.query))
    for key in ("sslmode", "channel_binding"):
        query.pop(key, None)
    url = urlunparse(parsed._replace(query=urlencode(query)))
    return url, parsed


def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    url, _ = _normalize_url(url)
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    url = config.get_main_option("sqlalchemy.url")
    url, parsed = _normalize_url(url)

    connect_args = {}
    if parsed.hostname and ("neon" in parsed.hostname or "aws" in parsed.hostname):
        connect_args["ssl"] = ssl.create_default_context()

    connectable = create_async_engine(url, poolclass=None, connect_args=connect_args)

    async def run_async_migrations():
        async with connectable.connect() as connection:
            await connection.run_sync(do_run_migrations)

    def do_run_migrations(sync_connection):
        context.configure(connection=sync_connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()

    asyncio.run(run_async_migrations())


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
