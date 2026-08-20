# Arduino Sensor & Buzzer

## 프로젝트 소개

Arduino를 활용하여 LED 제어와 초음파 센서 기반 거리 측정을 실습한 기초 임베디드
프로젝트입니다. LED 3개를 순서대로 켜고 끄는 디지털 출력 실습과, HC-SR04 초음파
센서로 거리를 측정해 일정 거리 이내로 물체가 접근하면 부저가 울리는 실습, 두 개의
독립된 스케치로 구성되어 있습니다.

## 실습 내용

- LED ON/OFF 제어
- 디지털 출력
- 초음파 센서를 이용한 거리 측정
- Serial Monitor 출력
- 거리 조건에 따른 부저 제어

## 사용 부품

- Arduino Uno
- LED 3개 (Red / Yellow / Blue)
- HC-SR04 초음파 센서
- 피에조 부저 (Piezo Buzzer)
- 점퍼 케이블
- 브레드보드

## 회로 연결

### LED 실습 (`1_led1.ino`)

| 부품 | Arduino 핀 | 역할 |
|---|---|---|
| LED (Red) | 7 | LED 출력 |
| LED (Yellow) | 6 | LED 출력 |
| LED (Blue) | 5 | LED 출력 |

### 초음파 센서 + 부저 실습 (`10_ultrasonicsensor1.ino`)

| 부품 | Arduino 핀 | 역할 |
|---|---|---|
| HC-SR04 Echo | 7 | 거리 측정(수신) |
| HC-SR04 Trig | 8 | 초음파 발사(송신) |
| Buzzer | 9 | 경고음 출력 |

두 실습은 서로 다른 독립된 스케치이며, 같은 핀 번호(7번)를 각자 다른 용도로
사용합니다 — 동시에 동작하는 하나의 회로가 아닙니다.

## 동작 방식

### LED 실습

`Red`(7번) → `Yellow`(6번) → `Blue`(5번) 순서로 각 LED를 `digitalWrite()`로 1초씩
켠 뒤 끄고, 다음 LED로 넘어가는 동작을 반복합니다.

### 초음파 센서 + 부저

`trigPin`에 10마이크로초 동안 HIGH 신호를 보내 초음파를 발사하고, `echoPin`으로
반사되어 돌아오는 시간을 `pulseIn()`으로 측정합니다. 측정한 시간을 거리(mm)로
환산해 Serial Monitor에 출력하고, 거리가 300mm(30cm) 이내면 `tone()`으로 부저를
울리고 그 이상 멀어지면 `noTone()`으로 소리를 끕니다.

## 핵심 학습 내용

- `pinMode()`
- `digitalWrite()`
- `delay()`
- `Serial.begin()`
- `Serial.print()` / `Serial.println()`
- 초음파 센서의 거리 측정 원리 (Trig로 발사, Echo로 수신 시간 측정 후 거리 환산)
- 조건문(`if`/`else`)을 활용한 센서값 처리

## 개발 환경

- Tinkercad Circuits 시뮬레이터
- Arduino Uno
- C/C++ 기반 Arduino Sketch

## 프로젝트를 통해 배운 점

Arduino를 처음 다루면서 하드웨어와 소프트웨어가 어떻게 연결되는지, 센서의 값을
코드로 읽고 조건에 따라 출력 장치(LED, 부저)를 제어하는 과정을 학습했습니다.

## 포트폴리오 한줄 요약

Arduino의 디지털 출력과 초음파 센서를 활용해 LED 제어 및 거리 기반 부저 알림
기능을 구현한 기초 임베디드 실습
