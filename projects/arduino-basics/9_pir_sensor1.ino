// C++ code
//

int ledPin=8;
int inputPin=7;
int val=0;

void setup()
{
  pinMode(ledPin, OUTPUT);
  pinMode(inputPin, INPUT);
  Serial.begin(9600);
}

void loop()
{
  val=digitalRead(inputPin);
  
  if(val==HIGH){
    digitalWrite(ledPin,HIGH);
    Serial.println("Welcome!");
  }
  else{
    digitalWrite(ledPin,LOW);
    Serial.println("Nothing");
  }
  delay(1000);
}