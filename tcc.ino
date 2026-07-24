#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

JsonDocument doc;

const char* ssid = "owo";
const char* password = "password";

const int VOLTAGE_PIN = 33;
const float DIVIDER_RATIO = 5.54;

float power = 0;
String command = "idle";
String commandAnswer="...";
void setup() {
  Serial.begin(115200);
  
  analogReadResolution(12);
  analogSetAttenuation(ADC_11db);
  Serial.println("Voltage monitor started");
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
        delay(500);
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
        "\"commandAnswer\":\"" + String(commandAnswer) + "\","
        "\"command\":\"" + String(command) + "\","
        "\"power\":" + String(power,2) +
        "}";
    int code = http.POST(json);
    if (code > 0) {
        String response = http.getString();
        Serial.println(response);
        DeserializationError error = deserializeJson(doc, response);
        if (error) {
          Serial.print("JSON Error");
          Serial.println(error.c_str());
          return;
        }
        String sentCommand = doc["command"];
        if(command=="idle"){
          command=sentCommand;
        }
    }
    http.end();
}  
}

void clean(){
  command="cleaning";
  Serial.println("i'll pretend im cleaning");
  commandAnswer="now cleaning...";
  heartbeat();
  delay(5000);
  Serial.println("done!");
  commandAnswer="doneCleaning";
  command="idle";
  heartbeat();
}

void loop() {
  if(command=="idle"){
    Serial.println("idle");
  }else if(command=="clean"){
    clean(); 
  }else{
      Serial.println("something went wrong?");
  }
  readSolarPower();
  heartbeat();
  commandAnswer="...";
  delay(1000);
}
