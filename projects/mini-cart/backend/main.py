from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from database import get_connection, init_db

app = FastAPI(title="미니 장바구니 API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    init_db()


class CartCreateRequest(BaseModel):
    product_id: int


class CartUpdateRequest(BaseModel):
    quantity: int


@app.get("/products")
def get_products():
    conn = get_connection()
    try:
        rows = conn.execute("SELECT id, name, price FROM products").fetchall()
        return [dict(row) for row in rows]
    finally:
        conn.close()


@app.get("/cart")
def get_cart():
    conn = get_connection()
    try:
        rows = conn.execute(
            """
            SELECT cart.id AS id,
                   cart.product_id AS product_id,
                   products.name AS name,
                   products.price AS price,
                   cart.quantity AS quantity
            FROM cart
            JOIN products ON products.id = cart.product_id
            ORDER BY cart.id
            """
        ).fetchall()
        return [dict(row) for row in rows]
    finally:
        conn.close()


@app.post("/cart")
def add_to_cart(payload: CartCreateRequest):
    conn = get_connection()
    try:
        product = conn.execute(
            "SELECT id FROM products WHERE id = ?", (payload.product_id,)
        ).fetchone()
        if product is None:
            raise HTTPException(status_code=404, detail="상품을 찾을 수 없습니다.")

        existing = conn.execute(
            "SELECT id, quantity FROM cart WHERE product_id = ?",
            (payload.product_id,),
        ).fetchone()

        if existing is None:
            conn.execute(
                "INSERT INTO cart (product_id, quantity) VALUES (?, 1)",
                (payload.product_id,),
            )
        else:
            conn.execute(
                "UPDATE cart SET quantity = quantity + 1 WHERE id = ?",
                (existing["id"],),
            )

        conn.commit()
        return {"message": "장바구니에 추가되었습니다."}
    finally:
        conn.close()


@app.patch("/cart/{cart_id}")
def update_cart_quantity(cart_id: int, payload: CartUpdateRequest):
    if payload.quantity < 1:
        raise HTTPException(status_code=400, detail="수량은 1 이상이어야 합니다.")

    conn = get_connection()
    try:
        existing = conn.execute(
            "SELECT id FROM cart WHERE id = ?", (cart_id,)
        ).fetchone()
        if existing is None:
            raise HTTPException(status_code=404, detail="장바구니 항목을 찾을 수 없습니다.")

        conn.execute(
            "UPDATE cart SET quantity = ? WHERE id = ?",
            (payload.quantity, cart_id),
        )
        conn.commit()
        return {"message": "수량이 변경되었습니다."}
    finally:
        conn.close()


@app.delete("/cart")
def clear_cart():
    conn = get_connection()
    try:
        conn.execute("DELETE FROM cart")
        conn.commit()
        return {"message": "장바구니를 비웠습니다."}
    finally:
        conn.close()


@app.delete("/cart/{cart_id}")
def delete_from_cart(cart_id: int):
    conn = get_connection()
    try:
        existing = conn.execute(
            "SELECT id FROM cart WHERE id = ?", (cart_id,)
        ).fetchone()
        if existing is None:
            raise HTTPException(status_code=404, detail="장바구니 항목을 찾을 수 없습니다.")

        conn.execute("DELETE FROM cart WHERE id = ?", (cart_id,))
        conn.commit()
        return {"message": "장바구니에서 삭제되었습니다."}
    finally:
        conn.close()
