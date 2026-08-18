import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).parent / "shop.db"

INITIAL_PRODUCTS = [
    ("노트북", 1200000),
    ("키보드", 80000),
    ("마우스", 40000),
    ("헤드셋", 100000),
]


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db():
    conn = get_connection()
    try:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                price INTEGER NOT NULL
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS cart (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_id INTEGER NOT NULL,
                quantity INTEGER NOT NULL DEFAULT 1,
                FOREIGN KEY (product_id) REFERENCES products (id)
            )
            """
        )

        count = conn.execute("SELECT COUNT(*) AS cnt FROM products").fetchone()["cnt"]
        if count == 0:
            conn.executemany(
                "INSERT INTO products (name, price) VALUES (?, ?)", INITIAL_PRODUCTS
            )

        conn.commit()
    finally:
        conn.close()
