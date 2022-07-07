// get data set of only light and temperature
//return array of filtered data 
const getLightTimeData = (data) => {
  const finalData = [];
  data.forEach((point) => {
    finalData.push({ time: point.time, value: point.light });
  });
  return finalData;
};

//get data set of only time and temperature 
//return array of filtered data 
const getTempTimeData = (data) => {
  const finalData = [];
  data.forEach((point) => {
    finalData.push({ time: point.time, value: point.temp });
  });
  return finalData;
};

//get data set of only humidity and time data
//return array of filtered data 
const getHumidityTimeData = (data) => {
  const finalData = [];
  data.forEach((point) => {
    finalData.push({ time: point.time, value: point.humidity });
  });
  return finalData;
};