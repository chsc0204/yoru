import sys #명령줄 인자를 받기 위한
import requests

GEO="https://geocoding-api.open-meteo.com/v1/search" #도시이름 -> 좌표변환
FORECAST="https://api.open-meteo.com/v1/forecast" #날씨 조회용 API
TIMEOUT=5

def find_city(name):
    """도시 이름 -> (위도,경도,표시용 이름)""" #도시 이름으로 검색, 가장 일치하는 결과 1개만 받음
    r = requests.get(GEO, params={"name":name,"count":1}, timeout=TIMEOUT)
    hit = r.json()["results"][0] #검색 결과 리스트 중 가장 일치하는 결과 하나만
    label = hit["name"] + ", " + hit["country_code"] #도시명, 국가코드 형태로 표시용
    return hit["latitude"], hit["longitude"], label #위도,경도,표시이름 3개 한 번에

city = sys.argv[1] if len(sys.argv) > 1 else "Seoul" #터미널에서 파이썬파일명.py도시명 형태로 실행하면 sys에 그 도시명이 담김
lat, lon, label = find_city(city) #아무것도 안 넣고 실행하면 기본값으로 서울 사용
#위에서 만든 함수로 입력받은 도시의 위도,경도,표시이름 구함
params = {
    "latitude": lat,
    "longitude": lon,
    "current": "temperature_2m", #현재기온
    "hourly": "precipitation_probability", #시간대별 강수 확률
    "forecast_days":1, #오늘 하루치만 예보 요청
}
r=requests.get(FORECAST, params=params, timeout=TIMEOUT)
data=r.json()

temp=data["current"]["temperature_2m"] #현재 기온 값 추측
rain=data["hourly"]["precipitation_probability"][0] #hourly 데이터는 시간대별 리스트로 오기에 0으로 가장 첫 시간대의 강수 확률만
print("city       :", label)
print("temperature:", temp,"C")
print("rain chance:", rain,"%")
