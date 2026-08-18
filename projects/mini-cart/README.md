# 미니 장바구니

Next.js(프론트엔드) + FastAPI(백엔드) + SQLite(DB)로 구현한 미니 장바구니 웹 애플리케이션입니다.

## 기술 스택

- **Frontend**: Next.js (App Router, TypeScript, Tailwind CSS)
- **Backend**: FastAPI (Python)
- **Database**: SQLite

## 주요 기능

- 상품 목록 조회
- 장바구니에 상품 담기 / 삭제
- 장바구니 수량 변경 ([-] / [+] 버튼, 수량이 1 미만으로 내려가면 자동으로 항목 삭제)
- 이미 담긴 상품을 다시 담으면 새 줄로 추가되지 않고 수량만 자동 증가 (중복 상품 처리)
- 장바구니 비우기 (전체 삭제)
- 총 상품 금액 자동 계산 및 실시간 갱신 (천 단위 콤마, 원화 표시)

서버 시작 시 상품 테이블에 노트북(1,200,000원), 키보드(80,000원), 마우스(40,000원), 헤드셋(100,000원)이 자동으로 등록됩니다.

## API 목록

| Method | Endpoint       | 설명                                    |
| ------ | -------------- | --------------------------------------- |
| GET    | `/products`    | 상품 목록 조회                          |
| GET    | `/cart`        | 장바구니 목록 조회 (상품명/가격/수량 포함) |
| POST   | `/cart`        | 장바구니에 상품 추가 (이미 있으면 수량 +1) |
| PATCH  | `/cart/{id}`   | 장바구니 항목 수량 변경                 |
| DELETE | `/cart/{id}`   | 장바구니 항목 삭제                      |
| DELETE | `/cart`        | 장바구니 전체 비우기                    |

실행 후 `http://127.0.0.1:8001/docs`에서 Swagger UI로 전체 API 스펙을 확인할 수 있습니다.

## 실행 방법

### 백엔드 (FastAPI)

```bash
cd backend
python -m venv venv
./venv/Scripts/activate      # Windows
pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 8001 --reload
```

### 프론트엔드 (Next.js)

```bash
cd frontend
npm install
npm run dev -- --port 3000
```

브라우저에서 `http://localhost:3000` 접속하면 됩니다. 프론트엔드는 기본적으로 `http://localhost:8001`의 백엔드 API를 호출하며, 필요 시 `frontend/.env.local`에 `NEXT_PUBLIC_API_BASE_URL` 값을 지정해 변경할 수 있습니다.
