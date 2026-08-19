# API App — 날씨/대기질 조회 실습

Open-Meteo API(무료, 인증키 불필요)를 활용해 날씨와 대기질을 조회하는 손코딩 실습 및
이를 통합한 완성형 프로그램입니다.

## 1. 손코딩 실습 파일

- **first_call.py**: API 연결 확인용. 서울 좌표로 날씨 API에 요청을 보내고 상태코드(status code)와
  응답 여부(ok), 응답 텍스트 앞부분(첫 60자)을 출력해 API가 정상 동작하는지 확인한다.
- **show_json.py**: 응답 JSON 구조 확인용. 서울 좌표로 요청 후 응답 데이터의 최상위 키 목록과
  `current` 항목의 JSON 구조를 그대로 출력해, 이후 원하는 값을 어떻게 꺼내올지 파악한다.
- **weather.py**: 도시명으로 검색해 날씨를 조회. Geocoding API로 도시명을 위도/경도로 변환한 뒤
  Forecast API를 호출해 현재 기온과 강수 확률을 출력한다.
- **air.py**: 도시명으로 검색해 대기질(PM2.5)을 조회. Geocoding API로 좌표를 구한 뒤
  Air Quality API를 호출해 PM2.5, PM10 수치를 가져오고 수치에 따라 GOOD/CAUTION/BAD 등급을 판정한다.
- **app.py**: 위 파일들을 통합한 완성형 프로그램. Geocoding → 날씨/대기질 조회를
  `ThreadPoolExecutor`로 병렬 요청하며, 각 API 호출에 예외 처리를 추가해 한쪽이 실패하거나
  타임아웃되어도 나머지 결과로 최종 판정(외출 가능 여부 등)을 한 문장으로 출력한다.

## 2. app.py와 손코딩 비교분석

| 항목 | first_call.py | show_json.py | weather.py | air.py | app.py |
|---|---|---|---|---|---|
| 목적 | API 연결 확인 | 응답 구조 탐색 | 도시 검색+날씨 | 도시 검색+대기질 | 통합 종합 판정 |
| 위치 지정 | 서울 고정 | 서울 고정 | 도시명 입력 | 도시명 입력 | 도시명 입력 |
| 호출 API | 1개 | 1개 | 2개 | 2개 | 3개 |
| 요청 방식 | 단일 | 단일 | 순차 | 순차 | 병렬(ThreadPoolExecutor) |
| 에러 처리 | 없음 | 없음 | 없음 | 없음 | 있음(timeout 시 정보없음 처리) |
| 결과 형태 | 상태코드/텍스트 | JSON 원본 | 개별 수치 | 등급 판정 | 종합 결론 문장 |

## 3. 실행 방법

```
python app.py [도시명]  # 기본값 Seoul
```

예시:

```
python app.py Busan
python weather.py Tokyo
```
