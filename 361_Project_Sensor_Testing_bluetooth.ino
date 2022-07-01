// Include the Bounce2 library to debounce our switches
#include <Bounce2.h>
#include <Wire.h>

// Include the SD and SPI libraries so we can use the SD card reader which 
// communicates over SPI to the microcontroller chip...
// understand that the microcontroller is technically just the CHIP, not
// all the other stuff around it. The SD Card Reader is a separate part that
// has to connect to the microcontroller like any other sensor or device.
#include <SD.h>
#include <SPI.h>
// need to download dht sensor library from adafruit
#include "TinyDHT.h"
// need to download sparkfun adxl library
#include "SparkFun_ADXL345.h"


// Teensy 3.5 & 3.6 & 4.1 on-board: BUILTIN_SDCARD
// this parameter chooses the right pin for SPI communication
const int chipSelect = BUILTIN_SDCARD;

// Include the Real Time Clock and Time Libraries 
#include <TimeLib.h>

// Define aliases that make our code more legible below
// These aren't variables, just substitutions the compiler
// makes later on - wherever it sees "BIG_BUTTON_PIN" in
// your code it will substitute "32", the pin we are using
#define BIG_BUTTON_PIN 32
#define LITTLE_BUTTON_PIN 30
#define LSENSOR_PIN A12
#define UVSENSOR_PIN 33
#define TEMPSENSOR_PIN 37
#define RLED_PIN 36
#define GLED_PIN 35

#define DHTTYPE DHT11

// Instantiate a Bounce object for the buttons
Bounce debouncerBIG = Bounce(); 
Bounce debouncerLITTLE = Bounce(); 

// Create a timer object that measures elapsed time in ms
elapsedMillis timer = 0;

// character array to store the current filename
String filename;

// whether we are logging or not
boolean isLogging = false;

// initialize DHT sensor and accelerometer
DHT dht(TEMPSENSOR_PIN, DHTTYPE);
ADXL345 adxl = ADXL345();

// Put your setup code here, to run once on boot:
void setup() {

  // Start the Serial Port so we can send messages back and forth
  Serial.begin(9600); // USB is always 12 Mbit/sec on TEENSY - it's SPECIAL
  Serial1.begin(9600);
  Wire.setSCL(7);
  Wire.setSDA(8);
  
  // Setup the BIG button with an internal pull-up resistor:
  pinMode(BIG_BUTTON_PIN,INPUT_PULLUP);
  // After setting up the button, setup the Bounce instance:
  debouncerBIG.attach(BIG_BUTTON_PIN);
  debouncerBIG.interval(5); // debounce interval in ms

  // Setup the LITTLE button with an internal pull-up resistor:
  pinMode(LITTLE_BUTTON_PIN,INPUT_PULLUP);
  // After setting up the button, setup the Bounce instance:
  debouncerLITTLE.attach(LITTLE_BUTTON_PIN);
  debouncerLITTLE.interval(5); // debounce interval in ms
  
  // Define our analog input pin formally for sensors
  pinMode(LSENSOR_PIN,INPUT);
  pinMode(UVSENSOR_PIN, INPUT);
  dht.begin();
  adxl.powerOn();
  adxl.setRangeSetting(8);
//  adxl.setActivityXYZ(1,1,1);

  // Define our Output pins formally for both the LEDs
  pinMode(RLED_PIN,OUTPUT);
  pinMode(GLED_PIN,OUTPUT);

  // They are common anode LEDs, so we need to set it LOW to turn it ON, HIGH to turn it OFF
  digitalWrite(RLED_PIN, HIGH);
  digitalWrite(GLED_PIN, HIGH);

  // Sometimes things move too fast for parts or things to initialize, so adding in delays can help
  delay(100);

  // set the Time library to use Teensy 3.0's RTC to keep time
  //setSyncProvider(getTeensy3Time);
  delay(100);
  
  if (timeStatus()!= timeSet) {
    Serial.println("Unable to sync with the RTC");    
    // Turn on the RED LED, turn off the GREEN if the actual time isn't set
    // We're using the RED LED as an error message...
    digitalWrite(RLED_PIN, LOW);
    digitalWrite(GLED_PIN, HIGH);
    delay(200);
    digitalWrite(RLED_PIN, HIGH);
    delay(200);    
    digitalWrite(RLED_PIN, LOW);
    delay(200);
    digitalWrite(RLED_PIN, HIGH);
  } else {
    Serial.println("RTC has set the system time");
  }

  //Initialize the SD Card with status/error messages to help debug things
  Serial.print("Initializing SD card...");

  // see if the card is present and can be initialized:
  if (!SD.begin(chipSelect)) {
    Serial.println("Card failed, or not present");
    while (1) {
      // No SD card, so don't do anything more - stay stuck here
    }
  }
  Serial.println("card initialized.");

  //Set headers of csv file
File dataFile = SD.open("datalog.csv");
if (dataFile) {
  while (dataFile.available())
  {
    dataFile.print("time");
    dataFile.print(",");
    dataFile.print("light");
    dataFile.print(",");
    dataFile.print("uv");
    dataFile.print(",");
    dataFile.print("temp");
    dataFile.print(",");
    dataFile.print("humidity");
    dataFile.close();
  }
}
}



// The "loop()" function runs repeatedly in a loop...this is 
// where your main program lives...
void loop() {
  // Update the Bounce instance so we know if the state
  // of the button has changed:
  debouncerBIG.update();
  debouncerLITTLE.update();

 
  // If more than 1=60000ms has passed (one minute), record a new sensor value
  if(timer>1000 && isLogging){
    int lightVal = analogRead(LSENSOR_PIN);
    int uvVal = analogRead(UVSENSOR_PIN);
    float tempVal = dht.readTemperature();
    float humidityVal = dht.readHumidity();
   /* myArray[0][arrayColumn] = lightVal;
    myArray[1][arrayColumn] = uvVal;
    myArray[2][arrayColumn] = tempVal;
    myArray[3][arrayColumn] = humidityVal;*/
    
 Serial.print(second());
 
    
    writeToSDCard(lightVal, uvVal, tempVal, humidityVal);
  
    /*Serial.print(lightVal);
    Serial.print(",");
    Serial.print(uvVal);
    Serial.print(",");
    Serial.print(tempVal);
    Serial.print(",");
    Serial.print(humidityVal);
    Serial.print(",");
    Serial.print("\n");
    */
    timer = 0;
  }
  // If the BIG_BUTTON_PIN is pressed, send file via bluetooth
  if(debouncerBIG.fell()){
    logBluetooth();
   //printSDtoSerialPort();
  }
  // If little button pressed, start new log
  if(debouncerLITTLE.fell()){
    if(isLogging)
      stopLogging();
    else
      startNewLog(); 
  }
}

void logBluetooth() {
  printSDtoSerialPort();
  Serial.println("Bluetooth function hit");
  File dataFile = SD.open("datalog.csv");
  if (dataFile) {
    while (dataFile.available()) {
    Serial1.write(dataFile.read());
    }
  }
}

void stopLogging() {
  isLogging = false;
  digitalWrite(RLED_PIN, LOW);
  digitalWrite(GLED_PIN, HIGH);
  Serial.print("stopping logging ...");
}

// Function to create a new datalog filename
void startNewLog() {

  // make a string for assembling the data to log:
  String dataString = "";

  // Make a string with the 
  dataString += String(hour());
  dataString += "_";  
  dataString += formatDigits(minute());
  dataString += "_";
  dataString += formatDigits(second());
  dataString += "_";
  dataString += String(day());
  dataString += "_";
  dataString += String(month());
  dataString += "_";
  dataString += String(year()); 
  dataString += ".csv";
  filename = dataString;
  Serial.println();
  Serial.println(filename);
  Serial.println();
  Serial.println("light,uv,temp,humidity,acceleration");
  digitalWrite(RLED_PIN, HIGH);
  digitalWrite(GLED_PIN, LOW);
  isLogging = true;
}


  
// utility function for digital clock display: Prints leading 0's
String formatDigits(int digits){
  String digitString = "";
  if(digits < 10){
    digitString += '0';    
  }
  digitString += String(digits);
  return digitString;
}

// This is a self defined function to write one INTEGER to the SD Card
// Notice we define an input "int data" to the function that we use when 
// we call the function above...
void writeToSDCard(int lightData, int uvData,float tempData, float humidityData) {
  // open the file.
  File dataFile = SD.open("datalog.csv", FILE_WRITE);
   
  // if the file is available, write to it:
  if (dataFile) {
    dataFile.print('\n');
    dataFile.print(millis());
    dataFile.print(",");
    dataFile.print(lightData);
    dataFile.print(",");
    dataFile.print(uvData);
    dataFile.print(",");
    dataFile.print(tempData);
    dataFile.print(",");
    dataFile.print(humidityData);
    dataFile.close();
    // print to the serial port too:
    //Serial.println(data);
  } else {
    // if the file isn't open, pop up an error:
    Serial.println("error opening datalog.csv");
  }
}

// This is a self defined function to read the "datalog.csv" file
// on the SD Card and print it to the Serial Port
void printSDtoSerialPort() {
  // open the file.
  File dataFile = SD.open("datalog.csv");
  // if the file is available, write it to the Serial Port:
  Serial.println();    
  Serial.println("Data Log Output from SD:");
  if (dataFile) {
    while (dataFile.available()) {
      Serial.write(dataFile.read());
    }
    dataFile.close();
    Serial.println("End of File");
    Serial.println();    
  }  
  // if the file isn't open, pop up an error:
  else {
    Serial.println("error opening datalog.csv");
  } 
}


// Function to use the Real Time Clock
time_t getTeensy3Time()
{
  return Teensy3Clock.get();
}
