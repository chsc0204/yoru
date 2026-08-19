import json
import requests

URL="https://api.open-meteo.com/v1/forecast"
params={
    "latitude":37.55, #위도
    "longitude":127.0, #경도
    "current": "temperature_2m,precipitation" #기온, 강수량 요청
}
r=requests.get(URL, params=params, timeout=5)
data=r.json() #응답 본문을 파이썬으로 변환

print("key        :", list(data.keys())) #응답 데이터의 최상위 키 출력
print("current box:")
print(json.dumps(data["current"],indent=2)) 
print("temperature:", data["current"]["temperature_2m"],"C") #currnet 안에 있는 현재 기온 값 꺼내서 출력