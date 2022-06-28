#include <Arduino.h>

#include <Wire.h>
#include <SPI.h>
//#include "Adafruit_VL6180X.h"

//Adafruit_VL6180X vl = Adafruit_VL6180X();  //initalize time of flight sensor
int incomingByte = 0;
char incomingChar = 'n';
int initialized = 0;

int NORTH = 5;
int SOUTH = 3;

int HEX_N = 78;
int HEX_S = 83;
int DIR = 7;

// Timers
int ON_TIME = 600;

void setup()
{
  pinMode(A0, INPUT);
  pinMode(DIR, INPUT);
  Serial.begin(115200);

  while (!Serial)// | ! vl.begin() )
  {
    delay(1);
  }
  
  pinMode(NORTH, OUTPUT); 
  pinMode(SOUTH, OUTPUT);
  // Make sure gates start off
  digitalWrite(NORTH, LOW); 
  digitalWrite(SOUTH, LOW);
}

void loop()
{
  /**uint8_t range = vl.readRange();
  uint8_t status = vl.readRangeStatus();**/
  if (initialized == 0) {
    if(Serial.available() > 0) {
      incomingChar = Serial.read();
      if (incomingChar == 's') {
        initialized = 1;
      }
      else if (incomingChar == 'p') {
        initialized = 2;
      }
      else{
        initialized = 3;
      }
    }
  }
  else if(initialized == 1){
    if(Serial.available() > 0) {
      incomingChar = Serial.read();
      delay(3000);
      if(incomingChar == 'x'){
        Serial.println("exit");
        initialized = 0;
      }
      else{
        Serial.println(analogRead(A0));
      }
      
    }
  }
  else if(initialized == 2){
     if (Serial.available() > 0){
       incomingChar = Serial.read();
       if(incomingChar == 'x'){
        Serial.println("exit");
        //Serial.println("exit");
        initialized = 0;
        delay(100);
       }
       else if (incomingChar == 'N'){ // If "N" is read from Serial 
        digitalWrite(NORTH, HIGH); // Turn on the NORTH gate
        delay(ON_TIME); // wait 700 millisecond
        digitalWrite(NORTH, LOW); // Turn off the gate
        Serial.println("North!"); // Send messsage
        delay(100);   
       } 
       else if (incomingChar == 'S'){ // If "S" is read from Serial
        digitalWrite(SOUTH, HIGH); // Same idea as in the if block...
        delay(ON_TIME);
        digitalWrite(SOUTH, LOW);
        Serial.println("South!"); 
        delay(100);
       }
    }
  }
  else if (initialized == 3){
    // TODO: incorporate flightsensor module
    //while(Serial.available()==0){
    //}
    Serial.print(digitalRead(DIR));
    Serial.print(" , ");
    Serial.println(analogRead(A0));
    //Serial.print("R");
    //Serial.println(1);
    if(Serial.available() >0){
      incomingChar = Serial.read();
    }
    if(incomingChar == 'x'){
      initialized = 0;
    }
  /**
    if (status == VL6180X_ERROR_NONE)
    {
      Serial.print("R");
      Serial.println(range);
    }
    else
    {
      Serial.print("E");
      Serial.println(status);
    }**/
  }
  
  delay(50);
}
