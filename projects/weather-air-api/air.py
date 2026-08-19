import sys
import requests

GEO="https://geocoding-api.open-meteo.com/v1/search" #도시이름 -> 좌표변환
AIR="https://air-quality-api.open-meteo.com/v1/air-quality" #미세먼지 조회
TIMEOUT=5

def find_city(name):
    r=requests.get(GEO, params= {"name":name, "count":1}, timeout=TIMEOUT)
    hit=r.json()["results"][0]
    return hit["latitude"], hit["longitude"], hit["name"]+", "+hit["country_code"]

city=sys.argv[1] if len(sys.argv) > 1 else "Seoul"
lat, lon, label = find_city(city)
# 미세먼지 API에 보낼 파라미터 현재 수치 요청
params={"latitude" : lat, "longitude":lon, "current": "pm2_5,pm10"}
cur=requests.get(AIR, params=params, timeout=TIMEOUT).json()["current"]
# 요청-> json 변환
pm25=cur["pm2_5"] #초미세먼지 수치 추출
grade="GOOD" if pm25 <= 15 else ("CAUTION" if pm25 <= 35 else "BAD")
#미세먼지 수치에 따라 등급을 나눔
print("city     :", label)
print("pm2.5    :", pm25, "ug/m3")
print("pm10     :", cur["pm10"],"ug/m3") #단위 : 마이크로그램,세제곱미터
print("grade    :", grade)
