import requests #api 호출

URL="https://api.open-meteo.com/v1/forecast"
params={ #파라미터 설정
    "latitude":37.55, #위도
    "longitude":127.0, #경도
    "current": "temperature_2m,precipitation" #현재 기온과 강수량 요청
}
#url로 get 요청 보냄
r=requests.get(URL, params=params, timeout=5) #5초안에 응답이 없으면 꺼짐
print("status code :", r.status_code)
print("ok?         :", r.ok)
print("first 60 ch :", r.text[:60]) #앞에서부터 60글자 출력
