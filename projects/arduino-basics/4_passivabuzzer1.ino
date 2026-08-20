// C++ code
//

int Buzzer=7;

void setup()
{
  pinMode(Buzzer, OUTPUT);
}

void loop()
{
  tone(Buzzer, 523);
  delay(500);
  tone(Buzzer, 587);
  delay(500);
  tone(Buzzer, 659);
  delay(500);
}