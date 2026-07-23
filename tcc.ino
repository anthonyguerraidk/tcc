#include <WiFi.h>
#include <HTTPClient.h>
const char* ssid = "owo";
const char* password = "password";

const int VOLTAGE_PIN = 33;
const float DIVIDER_RATIO = 5.54;

float power=0;
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
  Serial.printf(
    "ADC: %lu mV | Pin: %.3f V | Input: %.3f V\n",
    adcMilliVolts,
    pinVoltage,
    inputVoltage
  );
//  delay(500);

}

void heartbeat(){
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin("http://192.168.50.1:3000/heartbeat");
    http.addHeader("Content-Type", "application/json");
    String json =
        "{"
        "\"id\":\"cleaner001\","
        "\"power\":" + String(power,2) +
        "}";
    int code = http.POST(json);
    if (code > 0) {
        String response = http.getString();
        Serial.println(response);
    }
    http.end();
}  
}

void loop() {
  readSolarPower();
  heartbeat();
  delay(1000);
}
