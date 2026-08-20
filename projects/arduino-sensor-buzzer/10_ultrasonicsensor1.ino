// C++ code
//

int echoPin=7;
int trigPin=8;
int buzzerPin=9;

void setup()
{
  Serial.begin(9600);
  pinMode(echoPin,INPUT);
  pinMode(trigPin, OUTPUT);
  pinMode(buzzerPin,OUTPUT);
}

void loop()
{
  long duration, distance;
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin,LOW);
  duration=pulseIn(echoPin,HIGH);
  distance=((float)(340*duration)/1000)/2;
  
  Serial.print("Distance:");
  Serial.print(distance);
  Serial.println("mm\n");
  
  if(distance<=300){
    tone(buzzerPin,523);
  }
  else{
    noTone(buzzerPin);
  }
  
  delay(1000);
        
}