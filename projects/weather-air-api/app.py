import sys
import requests
from concurrent.futures import ThreadPoolExecutor, TimeoutError as FutureTimeoutError

GEO = "https://geocoding-api.open-meteo.com/v1/search"       # 도시이름 -> 좌표변환
FORECAST = "https://api.open-meteo.com/v1/forecast"           # 날씨 조회용 API
AIR = "https://air-quality-api.open-meteo.com/v1/air-quality" # 미세먼지 조회용 API

TIMEOUT = 5       # 각 요청 자체에 거는 타임아웃(초)
WAIT_LIMIT = 6    # 스레드 결과를 기다리는 최대 시간(초). 요청 타임아웃보다 살짝 여유를 둠

RAIN_ALERT = 60   # 이 값(%) 이상이면 비 올 가능성 높음으로 판단


def find_city(name):
    """도시 이름 -> (위도, 경도, 표시용 이름). 검색 실패 시 None 반환"""
    try:
        r = requests.get(GEO, params={"name": name, "count": 1}, timeout=TIMEOUT)
        results = r.json().get("results")
        if not results:
            return None
        hit = results[0]
        label = hit["name"] + ", " + hit["country_code"]
        return hit["latitude"], hit["longitude"], label
    except requests.exceptions.RequestException:
        return None


def get_weather(lat, lon):
    """현재 기온, 강수확률. 실패/타임아웃 시 None"""
    try:
        params = {
            "latitude": lat,
            "longitude": lon,
            "current": "temperature_2m",
            "hourly": "precipitation_probability",
            "forecast_days": 1,
        }
        data = requests.get(FORECAST, params=params, timeout=TIMEOUT).json()
        return {
            "temp": data["current"]["temperature_2m"],
            "rain": data["hourly"]["precipitation_probability"][0],
        }
    except requests.exceptions.RequestException:
        return None


def get_air(lat, lon):
    """현재 PM2.5. 실패/타임아웃 시 None"""
    try:
        params = {"latitude": lat, "longitude": lon, "current": "pm2_5"}
        data = requests.get(AIR, params=params, timeout=TIMEOUT).json()
        return {"pm25": data["current"]["pm2_5"]}
    except requests.exceptions.RequestException:
        return None


def pm25_grade(pm25):
    if pm25 <= 15:
        return "GOOD"
    if pm25 <= 35:
        return "CAUTION"
    return "BAD"


def judge(weather, air):
    """수집된 정보를 바탕으로 외출 가능 여부를 한 줄로 판정"""
    pm25 = air["pm25"] if air else None
    rain = weather["rain"] if weather else None

    if pm25 is None and rain is None:
        return "정보 부족으로 판단 불가: 날씨/대기질 응답을 모두 받지 못함, 직접 확인 필요"

    if pm25 is not None and pm25_grade(pm25) == "BAD":
        return f"외출 자제 권장: 미세먼지 나쁨(PM2.5 {pm25}ug/m3)"

    if rain is not None and rain >= RAIN_ALERT:
        return f"우산 챙기고 외출: 강수확률 {rain}% 로 높음"

    if pm25 is not None and pm25_grade(pm25) == "CAUTION":
        return f"외출은 가능하나 주의: 미세먼지 보통(PM2.5 {pm25}ug/m3)"

    return "외출하기 좋은 날씨"


def main():
    city = sys.argv[1] if len(sys.argv) > 1 else "Seoul"

    loc = find_city(city)
    if loc is None:
        print(f"'{city}' 도시를 찾지 못했습니다.")
        return
    lat, lon, label = loc

    # 두 API를 동시에 호출, 한쪽이 늦어도 다른 쪽을 기다리며 멈추지 않도록 처리
    with ThreadPoolExecutor(max_workers=2) as pool:
        weather_future = pool.submit(get_weather, lat, lon)
        air_future = pool.submit(get_air, lat, lon)

        try:
            weather = weather_future.result(timeout=WAIT_LIMIT)
        except FutureTimeoutError:
            weather = None

        try:
            air = air_future.result(timeout=WAIT_LIMIT)
        except FutureTimeoutError:
            air = None

    print("city       :", label)
    print("temperature:", f"{weather['temp']}C" if weather else "정보 없음")
    print("rain chance:", f"{weather['rain']}%" if weather else "정보 없음")
    print("pm2.5      :", f"{air['pm25']}ug/m3" if air else "정보 없음")
    print("판정       :", judge(weather, air))


if __name__ == "__main__":
    main()
