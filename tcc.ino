#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

JsonDocument doc;

const char* ssid = "owo";
const char* password = "password";


const int VOLTAGE_PIN = 33;
const int VALVE_PIN= 35;
const float DIVIDER_RATIO = 5.54;

float power = 0;
String command = "idle"; //ill leave this here so if someone calls without no connection shi doesnt break
String state="idle";
String ack="...";

void setup() {
  Serial.begin(115200);
  pinMode(VALVE_PIN,OUTPUT);//valve
  digitalWrite(VALVE_PIN,LOW);
  analogReadResolution(12);
  analogSetAttenuation(ADC_11db);
  Serial.println("Voltage monitor started");
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print("connecting to wifi: ");
        Serial.print(ssid);
        Serial.println("\n");
        Serial.print(".");
  }
  Serial.println("\nConnected!");
  Serial.println(WiFi.localIP());
}

void readSolarPower(){
  uint32_t adcMilliVolts = analogReadMilliVolts(VOLTAGE_PIN);
  float pinVoltage = adcMilliVolts / 1000.0f;
  float inputVoltage = pinVoltage * DIVIDER_RATIO;
  power=inputVoltage;
  //Serial.printf(
  //  "ADC: %lu mV | Pin: %.3f V | Input: %.3f V\n",
  //  adcMilliVolts,
  //  pinVoltage,
  //  inputVoltage
  //);
//  delay(500);

}

void heartbeat(){
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin("http://192.168.50.1:3000/heartbeat");
    http.addHeader("Content-Type", "application/json");
    
    String json =
        "{"
        "\"dustLevel\":\"placeholder\","
        "\"waterTank\":\"placeholder\","
        "\"pumpRunning\":\"placeholder\","
        "\"status\":\"" + String(state) + "\","
        "\"ack\":\"" + String(ack) + "\","
        //"\"command\":\"" + String(command) + "\","
        "\"power\":" + String(power,2) +
        "}";
    int code = http.POST(json);
    if (code > 0) {
        String response = http.getString();
        //Serial.println(response);
        DeserializationError error = deserializeJson(doc, response);
        if (error) {
          Serial.print("JSON Error");
          Serial.println(error.c_str());
          return;
        }
        //String sentCommand = doc["command"];
        String sentCommand = doc["command"]; command = sentCommand;
        
        if(state=="idle"){
          if(command=="clean"){ //just to check if the command is valid, not really necessary ig
            ack=command+" acknowledged";
            clean();
          }else if(command=="idle"){}else{
            Serial.println("invalid command, "+command);
            ack="invalid command sent";
          }
        }else if(state=="cleaning"){
          ack="cleaning right now";
        }else if(state=="doneCleaning"){
          state="idle";
          ack="done cleaning";
        }else{Serial.println("invalid state??");}
    }
    http.end();
  }  
}

void clean(){
  Serial.println("i'll pretend im cleaning");
  state="nowCleaning";
  heartbeat();
  
  digitalWrite(VALVE_PIN, HIGH);
  Serial.println("high");
  delay(15000);
  digitalWrite(VALVE_PIN, LOW);
  Serial.println("low");
  
  Serial.println("done!");
  state="doneCleaning";
  //command="idle";
  heartbeat();
  command="idle";
  ack="idle rn";
}

void loop() {
  //Serial.println(power);
  if(command=="idle"){
    //Serial.println("idle");
  }else if(command=="clean"){
    clean(); 
  }else{
      Serial.println("something went wrong? idk, no command here");
  }
  readSolarPower();
  heartbeat();
  state="idle";
  delay(1000);
}
