#include <Bounce2.h>
#include <Wire.h>
#include <SD.h>
#include <SPI.h>
#include <DHT.h>
#include <TimeLib.h>

const int chipSelect = BUILTIN_SDCARD;

// pin variables
#define BIG_BUTTON_PIN 32
#define LITTLE_BUTTON_PIN 30
#define LSENSOR_PIN A12
#define UVSENSOR_PIN 33
#define TEMPSENSOR_PIN 37
#define RLED_PIN 36
#define GLED_PIN 35
#define DHTTYPE DHT11
#define SCL_PIN 7
#define SDA_PIN 8

// Bounce object for the buttons
Bounce debouncerBIG = Bounce(); 
Bounce debouncerLITTLE = Bounce(); 

// initialize DHT temperature/humidity sensor
DHT dht(TEMPSENSOR_PIN, DHTTYPE);

// timer to trigger logging sensor readings
elapsedMillis timer = 0;

// time in ms between readings
int measurementInterval = 1000;

// current file name
String fileName = "datalog.csv";

// whether the device are logging or not
boolean isLogging = false;

// size of the lookup table
int maxOSEPPValue = 725;

// interpolated values for converting from analog output to lux
float luxVal[726] = {
0,0.27578,0.56198,0.85857,1.1655,1.4827,1.8102,2.1478,2.4957,2.8536,3.2216,3.5996,3.9875,
4.3854,4.7932,5.2108,5.6382,6.0753,6.5221,6.9786,7.4447,7.9203,8.4054,8.9,9.404,9.9174,
10.44,10.972,11.513,12.064,12.623,13.192,13.769,14.356,14.952,15.556,16.17,16.792,17.423,
18.063,18.711,19.368,20.034,20.708,21.39,22.081,22.781,23.489,24.205,24.929,25.662,26.403,
27.152,27.909,28.674,29.447,30.228,31.017,31.813,32.618,33.43,34.25,35.078,35.913,36.756,
37.606,38.464,39.329,40.202,41.082,41.969,42.864,43.765,44.674,45.59,46.513,47.443,48.38,
49.324,50.275,51.233,52.198,53.169,54.147,55.131,56.122,57.12,58.124,59.135,60.152,61.176,
62.206,63.242,64.284,65.333,66.387,67.448,68.515,69.588,70.667,71.751,72.842,73.938,75.04,
76.148,77.262,78.381,79.506,80.636,81.772,82.913,84.06,85.212,86.369,87.532,88.7,89.873,
91.051,92.234,93.423,94.616,95.814,97.017,98.225,99.438,100.66,101.88,103.1,104.34,105.57,
106.81,108.06,109.31,110.56,111.82,113.08,114.35,115.62,116.9,118.17,119.46,120.75,122.04,
123.33,124.63,125.93,127.24,128.55,129.87,131.18,132.51,133.83,135.16,136.49,137.83,139.17,
140.51,141.85,143.2,144.55,145.91,147.27,148.63,149.99,151.36,152.73,154.1,155.48,156.86,
158.24,159.62,161.01,162.4,163.79,165.18,166.58,167.98,169.38,170.79,172.19,173.6,175.01,
176.42,177.84,179.25,180.67,182.09,183.52,184.94,186.37,187.79,189.22,190.66,192.09,193.52,
194.96,196.4,197.84,199.28,200.72,202.16,203.61,205.05,206.5,207.95,209.39,210.84,212.3,
213.75,215.2,216.66,218.13,219.61,221.11,222.62,224.14,225.67,227.21,228.77,230.34,231.92,
233.52,235.12,236.75,238.38,240.02,241.68,243.36,245.04,246.74,248.45,250.17,251.91,253.66,
255.43,257.21,259,260.8,262.62,264.45,266.3,268.16,270.03,271.92,273.82,275.74,277.67,279.62,
281.57,283.55,285.53,287.54,289.55,291.58,293.63,295.69,297.76,299.85,301.96,304.08,306.21,
308.36,310.53,312.71,314.9,317.11,319.34,321.58,323.83,326.11,328.39,330.7,333.02,335.35,
337.7,340.07,342.45,344.85,347.26,349.69,352.14,354.6,357.08,359.58,362.09,364.62,367.16,
369.72,372.3,374.9,377.51,380.14,382.78,385.45,388.13,390.82,393.54,396.27,399.01,401.78,
404.56,407.36,410.18,413.02,415.87,418.74,421.63,424.53,427.46,430.4,433.37,436.38,439.44,
442.53,445.67,448.85,452.07,455.32,458.62,461.96,465.34,468.76,472.21,475.71,479.25,482.82,
486.44,490.09,493.78,497.51,501.27,505.08,508.92,512.8,516.72,520.67,524.66,528.69,532.76,
536.86,540.99,545.17,549.38,553.62,557.9,562.22,566.57,570.96,575.38,579.83,584.32,588.85,
593.4,598,602.62,607.28,611.97,616.7,621.46,626.25,631.08,635.93,640.82,645.74,650.7,655.68,
660.7,665.75,670.83,675.94,681.08,686.25,691.45,696.68,701.95,707.24,712.56,717.91,723.29,
728.7,734.14,739.61,745.11,750.63,756.19,761.77,767.38,773.02,778.68,784.38,790.1,795.85,
801.62,807.42,813.25,819.1,824.98,830.89,836.82,842.78,848.76,854.77,860.8,866.87,872.99,
879.16,885.38,891.65,897.97,904.33,910.75,917.22,923.75,930.32,936.94,943.62,950.35,957.13,
963.96,970.84,977.78,984.77,991.81,998.91,1006.1,1013.3,1020.5,1027.8,1035.2,1042.6,1050.1,
1057.6,1065.2,1072.8,1080.5,1088.3,1096.1,1104,1111.9,1119.9,1127.9,1136,1144.1,1152.3,1160.6,
1168.9,1177.3,1185.7,1194.2,1202.8,1211.4,1220.1,1228.8,1237.6,1246.4,1255.3,1264.3,1273.3,
1282.4,1291.6,1300.8,1310.1,1319.4,1328.8,1338.2,1347.8,1357.3,1367,1376.7,1386.5,1396.3,
1406.2,1416.2,1426.2,1436.3,1446.4,1456.6,1466.9,1477.3,1487.7,1498.1,1508.7,1519.3,1530,
1540.7,1551.5,1562.4,1573.3,1584.3,1595.4,1606.5,1617.7,1629,1640.3,1651.7,1663.2,1674.7,
1686.4,1698,1709.8,1721.6,1733.5,1745.5,1757.6,1769.8,1782.2,1794.6,1807.1,1819.8,1832.5,
1845.4,1858.4,1871.5,1884.7,1898,1911.4,1925,1938.6,1952.4,1966.3,1980.4,1994.5,2008.8,
2023.2,2037.7,2052.3,2067.1,2082,2097,2112.1,2127.4,2142.8,2158.4,2174,2189.8,2205.8,2221.9,
2238.1,2254.4,2270.9,2287.5,2304.3,2321.2,2338.2,2355.4,2372.8,2390.2,2407.9,2425.6,2443.5,
2461.6,2479.8,2498.2,2516.7,2535.4,2554.2,2573.2,2592.3,2611.6,2631,2650.6,2670.4,2690.3,
2710.4,2730.6,2751,2771.6,2792.3,2813.2,2834.2,2855.5,2876.9,2898.4,2920.2,2942.1,2964.1,
2986.4,3008.8,3031.4,3054.2,3077.1,3100.3,3123.6,3147.1,3170.7,3194.6,3218.6,3242.8,3267.2,
3291.8,3316.5,3341.5,3366.6,3392,3417.5,3443.2,3469.1,3495.3,3521.7,3548.3,3575.3,3602.4,
3629.9,3657.6,3685.7,3714,3742.6,3771.6,3800.8,3830.4,3860.3,3890.6,3921.2,3952.2,3983.5,
4015.2,4047.3,4079.8,4112.7,4146,4179.7,4213.8,4248.3,4283.3,4318.7,4354.6,4390.9,4427.6,
4464.9,4502.6,4540.8,4579.5,4618.8,4658.5,4698.7,4739.5,4780.8,4822.6,4865,4907.9,4951.4,
4995.5,5040.1,5085.3,5131.1,5177.6,5224.6,5272.2,5320.5,5369.4,5418.9,5469.1,5519.9,5571.4,
5623.5,5676.4,5729.9,5784.1,5839,5894.6,5950.9,6007.9,6065.7,6124.2,6183.5,6243.5,6304.2,
6365.7,6428,6491.1,6555,6619.6,6685.1,6751.4,6818.5,6886.4,6956.8,7031.2,7109.5,7191.7,7277.6,
7367.3,7460.6,7557.4,7657.7,7761.3,7868.3,7978.5,8091.8,8208.2,8327.6,8449.9,8575,8702.9,
8833.4,8966.5,9102.2,9240.3,9380.7,9523.4,9668.3,9815.3,9964.4,10115,10268,10423,10579,10737,
10897,11058,11221,11384,11550,11716,11883,12051,12221,12391,12562,12733,12905,13078,13251,
13425,13599,13773};

// Put your setup code here, to run once on boot:
void setup() {

  // Start the Serial Port so we can send messages back and forth
  Serial.begin(9600); // USB is always 12 Mbit/sec on TEENSY - it's SPECIAL
  Serial1.begin(9600);
  Wire.setSCL(SCL_PIN);
  Wire.setSDA(SDA_PIN);

  // button set-up
  pinMode(BIG_BUTTON_PIN,INPUT_PULLUP);
  debouncerBIG.attach(BIG_BUTTON_PIN);
  debouncerBIG.interval(5); // debounce interval in ms

  pinMode(LITTLE_BUTTON_PIN,INPUT_PULLUP);
  debouncerLITTLE.attach(LITTLE_BUTTON_PIN);
  debouncerLITTLE.interval(5); // debounce interval in ms
  
  // sensor pin set-up
  pinMode(LSENSOR_PIN,INPUT);
  pinMode(UVSENSOR_PIN, INPUT);
  dht.begin();

  // output pin set-up for the LED and set to off
  pinMode(RLED_PIN,OUTPUT);
  pinMode(GLED_PIN,OUTPUT);
  
  digitalWrite(RLED_PIN, HIGH);
  digitalWrite(GLED_PIN, HIGH);

  delay(100);

  // set the Time library to use Teensy 3.0's RTC to keep time
  setSyncProvider(getTeensy3Time);
  delay(100);

  // check that time was successfully set
  if (timeStatus() != timeSet) {
    // if time is unable to be set, blink red LED to indicate error
    Serial.println("Unable to sync with the RTC");    
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

  // Initialize the SD Card with status/error messages to help debug things
  Serial.print("Initializing SD card...");

  // check that the SD card is present
  if (!SD.begin(chipSelect)) {
    Serial.println("Card failed, or not present");
    while (1) {
      // No SD card, so don't do anything more - stay stuck here
    }
  } else {
    Serial.println("card initialized.");
  }

  // if the data file does not already exist, create it and print the headers
  if (!SD.exists(fileName.c_str())) {
    File dataFile = SD.open(fileName.c_str(), FILE_WRITE);
    
    if (dataFile) {
      while (dataFile.available())
       {
         dataFile.print("time,light,uv,temp,humidity");
         dataFile.close();
       }
     }
  }
}

void loop() {
  // update to know if state of buttons has changed
  debouncerBIG.update();
  debouncerLITTLE.update();

 
  // If more than the measurement interval has passed, record a new sensor value
  if(timer>measurementInterval && isLogging){
    // read from sensors and write to SD card
    time_t timenow = now();
    int lightVal = measureLux();
    int uvVal = analogRead(UVSENSOR_PIN);
    float tempVal = dht.readTemperature();
    float humidityVal = dht.readHumidity(); 
    
    writeToSDCard(timenow, lightVal, uvVal, tempVal, humidityVal);

    // reset timer
    timer = 0;
  }
  
  // If the big button is pressed, send file via bluetooth
  if(debouncerBIG.fell()){
//    logBluetooth();
    printSDtoSerialPort();
  }
  
  // If little button pressed, start/stop new log
  if(debouncerLITTLE.fell()){
    if(isLogging)
      stopLogging();
    else
      startLogging(); 
  }
}

void logBluetooth() {
  Serial.println("Sending via bluetooth...");
  File dataFile = SD.open(fileName.c_str());
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
  Serial.println("stopping logging ...");
}

void startLogging() {
  isLogging = true;
  digitalWrite(RLED_PIN, HIGH);
  digitalWrite(GLED_PIN, LOW);
  Serial.println("beginning to log data...");
}

// write a new row of sensor values to the SD card in csv format
void writeToSDCard(time_t timenow, int lightData, int uvData,float tempData, float humidityData) {
  // open the file or, if it does not exist, create a new file
  File dataFile = SD.open(fileName.c_str(), FILE_WRITE);
   
  // if the file is available, write to it:
  if (dataFile) {
    dataFile.print('\n');
    dataFile.print(timenow);
    dataFile.print(",");
    dataFile.print(lightData);
    dataFile.print(",");
    dataFile.print(uvData);
    dataFile.print(",");
    dataFile.print(tempData);
    dataFile.print(",");
    dataFile.print(humidityData);
    dataFile.close();
  } else {
    // if the file isn't open, pop up an error:
    Serial.println("error opening " + fileName);
  }
}

// This is a self defined function to read the data file
// on the SD Card and print it to the Serial Port
void printSDtoSerialPort() {
  // open the file.
  File dataFile = SD.open(fileName.c_str());
  // if the file is available, write it to the Serial Port:
  Serial.println();    
  Serial.println("Data Log Output from SD:");
  if (dataFile) {
    while (dataFile.available()) {
      Serial.write(dataFile.read());
    }
    dataFile.close();
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

// Function to read from the light sensor and return the light reading in lux
int measureLux(){
  int val = analogRead(LSENSOR_PIN);

  // can convert to lux by using the analog value as an index in the luxVal array
  if(val <= maxOSEPPValue){
    return luxVal[val];
  } else {
    // if the value is higher than max, log the highest value
    return luxVal[maxOSEPPValue];  
  }
}
