"use client";

import { useCallback, useEffect, useState } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8001";

type Product = {
  id: number;
  name: string;
  price: number;
};

type CartItem = {
  id: number;
  product_id: number;
  name: string;
  price: number;
  quantity: number;
};

function formatPrice(price: number) {
  return `${price.toLocaleString("ko-KR")}원`;
}

const PRODUCT_EMOJI: Record<string, string> = {
  노트북: "💻",
  키보드: "⌨️",
  마우스: "🖱️",
  헤드셋: "🎧",
};

function getProductEmoji(name: string) {
  return PRODUCT_EMOJI[name] ?? "🛒";
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    const res = await fetch(`${API_BASE_URL}/products`);
    if (!res.ok) throw new Error("상품 목록을 불러오지 못했습니다.");
    setProducts(await res.json());
  }, []);

  const fetchCart = useCallback(async () => {
    const res = await fetch(`${API_BASE_URL}/cart`);
    if (!res.ok) throw new Error("장바구니를 불러오지 못했습니다.");
    setCart(await res.json());
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await Promise.all([fetchProducts(), fetchCart()]);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, [fetchProducts, fetchCart]);

  const handleAddToCart = async (productId: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId }),
      });
      if (!res.ok) throw new Error("장바구니 추가에 실패했습니다.");
      await fetchCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
    }
  };

  const handleDelete = async (cartId: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/cart/${cartId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("삭제에 실패했습니다.");
      await fetchCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
    }
  };

  const handleChangeQuantity = async (item: CartItem, delta: number) => {
    const nextQuantity = item.quantity + delta;

    try {
      if (nextQuantity < 1) {
        // 수량이 1에서 더 줄어들면 자연스럽게 장바구니에서 제거한다.
        const res = await fetch(`${API_BASE_URL}/cart/${item.id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("삭제에 실패했습니다.");
      } else {
        const res = await fetch(`${API_BASE_URL}/cart/${item.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: nextQuantity }),
        });
        if (!res.ok) throw new Error("수량 변경에 실패했습니다.");
      }
      await fetchCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
    }
  };

  const handleClearCart = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/cart`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("장바구니 비우기에 실패했습니다.");
      await fetchCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#fafafa] px-6 py-20 sm:py-28">
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-14">
        <header className="animate-fade-in-up text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            미니 장바구니
          </h1>
          <p className="mt-3 text-base font-normal text-gray-400">
            필요한 상품을 담고, 수량을 자유롭게 조절해 보세요.
          </p>
        </header>

        {error && (
          <p className="animate-fade-in-up rounded-2xl bg-red-50 px-5 py-3 text-center text-sm font-medium text-red-500">
            {error}
          </p>
        )}

        {loading ? (
          <p className="text-center text-sm font-normal text-gray-400">
            불러오는 중...
          </p>
        ) : (
          <>
            <section
              className="animate-fade-in-up"
              style={{ animationDelay: "80ms" }}
            >
              <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900">
                상품 목록
              </h2>
              <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
                {products.map((product, index) => (
                  <li
                    key={product.id}
                    className="animate-fade-in-up flex flex-col items-start rounded-2xl bg-white p-7 shadow-[0_4px_24px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.03] transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-[0_24px_48px_rgba(0,0,0,0.16)]"
                    style={{ animationDelay: `${140 + index * 60}ms` }}
                  >
                    <span className="text-5xl leading-none" aria-hidden>
                      {getProductEmoji(product.name)}
                    </span>
                    <p className="mt-4 text-lg font-semibold text-gray-900">
                      {product.name}
                    </p>
                    <p className="mt-1 text-sm font-normal text-gray-400">
                      {formatPrice(product.price)}
                    </p>
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-full bg-[#0071e3] px-6 py-3 text-base font-semibold text-white transition-all duration-200 ease-out hover:scale-105 hover:bg-[#0060c2] active:scale-95"
                    >
                      <span aria-hidden>+</span>
                      담기
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            <section
              className="animate-fade-in-up"
              style={{ animationDelay: "220ms" }}
            >
              <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900">
                장바구니
              </h2>

              {cart.length === 0 ? (
                <div className="rounded-2xl bg-white px-6 py-14 text-center shadow-[0_4px_24px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.03]">
                  <p className="text-sm font-normal text-gray-400">
                    장바구니가 비어 있습니다.
                  </p>
                </div>
              ) : (
                <ul className="flex flex-col gap-4">
                  {cart.map((item, index) => (
                    <li
                      key={item.id}
                      className="animate-fade-in-up flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.03] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(0,0,0,0.12)]"
                      style={{ animationDelay: `${260 + index * 60}ms` }}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="text-3xl leading-none" aria-hidden>
                          {getProductEmoji(item.name)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-base font-semibold text-gray-900">
                            {item.name}
                          </p>
                          <p className="mt-1 text-sm font-normal text-gray-400">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 rounded-full bg-gray-100 px-2 py-1.5">
                          <button
                            onClick={() => handleChangeQuantity(item, -1)}
                            aria-label="수량 감소"
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-gray-700 shadow-sm transition-all duration-150 ease-out hover:scale-105 active:scale-95"
                          >
                            -
                          </button>
                          <span className="w-5 text-center text-sm font-semibold text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleChangeQuantity(item, 1)}
                            aria-label="수량 증가"
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-gray-700 shadow-sm transition-all duration-150 ease-out hover:scale-105 active:scale-95"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-sm font-medium text-gray-400 transition-colors duration-150 hover:text-red-500"
                        >
                          삭제
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {cart.length > 0 && (
                <button
                  onClick={handleClearCart}
                  className="mt-4 w-full rounded-2xl py-3 text-sm font-medium text-gray-400 transition-colors duration-150 hover:bg-red-50 hover:text-red-500"
                >
                  장바구니 비우기
                </button>
              )}
            </section>

            <section
              className="animate-fade-in-up flex items-center justify-between rounded-2xl bg-white px-8 py-6 shadow-[0_4px_24px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.03]"
              style={{ animationDelay: "340ms" }}
            >
              <span className="text-sm font-normal text-gray-400">
                총 상품 금액
              </span>
              <span className="text-2xl font-semibold tracking-tight text-gray-900">
                {formatPrice(total)}
              </span>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
