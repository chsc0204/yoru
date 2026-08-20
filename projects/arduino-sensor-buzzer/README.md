# 초음파 센서 + 부저 연동 (거리 감지 경보)

HC-SR04 초음파 센서로 거리를 측정해, 물체가 30cm 이내로 가까워지면 피에조 부저가
소리를 내는 거리 감지 경보 실습입니다.

## 사용 부품

- Arduino Uno
- HC-SR04 초음파 센서
- 피에조 부저 (Piezo Buzzer)

## 회로 연결

| 부품 핀 | Arduino 핀 |
|---|---|
| echoPin | 7 |
| trigPin | 8 |
| buzzerPin | 9 |

## 동작 방식

1. `trigPin`에 10마이크로초 동안 HIGH 신호를 보내 초음파를 발생시킨다.
2. `echoPin`으로 반사되어 돌아오는 신호의 시간(duration)을 `pulseIn()`으로 측정한다.
3. 측정한 시간을 거리(mm)로 환산해 시리얼 모니터에 출력한다.
4. 거리가 30cm(300mm) 이내로 가까워지면 `tone()`으로 부저를 울리고, 그 이상 멀어지면
   `noTone()`으로 소리를 끈다.

## 개발 환경

- Tinkercad Circuits 시뮬레이터

## 파일

- `10_ultrasonicsensor1.ino` — 초음파 센서로 거리를 측정하고 30cm 이내면 부저를 울리는 메인 스케치
- `1_led1.ino` — LED 3개(Red/Yellow/Blue)를 순서대로 켜고 끄는 기초 실습 스케치
