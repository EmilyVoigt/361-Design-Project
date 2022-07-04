import serial
import csv
import os
from datetime import datetime

#TO USE: run 'pip install pyserial' in terminal and change 'filePath' variable to your desired location
#Should also check which COM port is connected to the HC-06 module and change accordingly in the first line

serialcomm = serial.Serial("COM9", 9600, timeout=3)
serialcomm.reset_input_buffer()

fields = ['time','light','uv','temp','humidity']
filePath = 'C:/Users/evoig/Desktop'
fileName = 'datalog.csv'
completeName = os.path.join(filePath, fileName)
if os.path.exists(completeName):
    print("Renaming old file...")
    curDate = datetime.now().strftime("%d_%m_%Y_%H-%M-%S")
    dateString = str(curDate)
    newName =os.path.join(filePath+"/datalog updated_"+dateString+".csv")
    os.rename(completeName,newName)
    print("Placing new data in file")
    

with open(completeName, 'w') as file:
    
    csvwriter = csv.writer(file)
    csvwriter.writerow(fields)
    

while True:
    line = serialcomm.readline().decode('utf-8')
    if line:
        csvwriter = csv.writer(file)
        csvwriter.writerow(line)
        print(line)
