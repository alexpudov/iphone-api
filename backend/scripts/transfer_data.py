from pathlib import Path

from app.db import engine as postgres_engine
from app.models import Appointment, Doctor, Slot, User
from sqlalchemy import create_engine, func, select, text
from sqlalchemy.engine import URL


def main():
    sqlite_path = Path(__file__).resolve().parent / "clinic.db"

    if not sqlite_path.is_file():
        raise FileNotFoundError(f"SQLite file not found: {sqlite_path}")

    if postgres_engine.dialect.name != "postgresql":
        raise RuntimeError("The target database must be PostgreSQL")

    sqlite_engine = create_engine(URL.create("sqlite", database=str(sqlite_path)))

    # Сначала родительские таблицы, затем зависимые.
    tables = [
        Doctor.__table__,
        User.__table__,
        Slot.__table__,
        Appointment.__table__,
    ]

    counts = {}

    with sqlite_engine.connect() as source:
        with postgres_engine.begin() as target:
            for table in tables:
                count = target.scalar(select(func.count()).select_from(table))

                if count != 0:
                    raise RuntimeError(f"Target table '{table.name}' is not empty")

            for table in tables:
                rows = source.execute(select(table)).mappings().all()

                if rows:
                    target.execute(
                        table.insert(),
                        [dict(row) for row in rows],
                    )

                copied_count = target.scalar(select(func.count()).select_from(table))

                if copied_count != len(rows):
                    raise RuntimeError(f"Row count mismatch for '{table.name}'")

                counts[table.name] = copied_count

            for table in tables:
                max_id = target.scalar(select(func.max(table.c.id)))

                target.execute(
                    text("""
                        SELECT setval(
                            pg_get_serial_sequence(:table_name, 'id'),
                            :sequence_value,
                            :is_called
                        )
                    """),
                    {
                        "table_name": table.name,
                        "sequence_value": (max(1, max_id) if max_id is not None else 1),
                        "is_called": max_id is not None,
                    },
                )

    print("Transfer completed:")
    for table_name, count in counts.items():
        print(f"  {table_name}: {count}")


if __name__ == "__main__":
    main()
