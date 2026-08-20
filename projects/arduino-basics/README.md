# Arduino 기초 실습 모음

Tinkercad Circuits 시뮬레이터에서 진행한 개별 Arduino 기초 실습 스케치 모음입니다.
서로 독립적인 실습이라 하나의 폴더에 모아두었습니다.

## 파일

- **exquisite_leelo1.ino** — 기본 LED 블링크(Blink). `LED_BUILTIN`을 1초 간격으로
  켜고 끈다.
- **9_pir_sensor1.ino** — PIR 모션 센서 실습. `inputPin=7`로 PIR 센서 값을 읽어 감지되면
  `ledPin=8`의 LED를 켜고 시리얼 모니터에 "Welcome!"을, 감지되지 않으면 "Nothing"을 출력한다.
- **4_passivabuzzer1.ino** — 패시브 부저(Piezo Buzzer) 실습. `Buzzer=7` 핀에 `tone()`으로
  523Hz(C5) → 587Hz(D5) → 659Hz(E5) 음을 순서대로 재생한다.

## 개발 환경

- Tinkercad Circuits 시뮬레이터
