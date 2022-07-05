// mostly getters
const getLightTimeData = (data) => {
  const finalData = [];
  data.forEach((point) => {
    finalData.push({ time: point.time, value: point.light });
  });
  return finalData;
};

const getTempTimeData = (data) => {
  const finalData = [];
  data.forEach((point) => {
    finalData.push({ time: point.time, value: point.temp });
  });
  return finalData;
};

const getHumidityTimeData = (data) => {
  const finalData = [];
  data.forEach((point) => {
    finalData.push({ time: point.time, value: point.humidity });
  });
  return finalData;
};