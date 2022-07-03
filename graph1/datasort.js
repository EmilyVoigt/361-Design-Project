const testTime = new Date(1656683511185);
let csvData = null; //store all csv data
// const hourAverages = Array(24).fill({ total: 0, dataPoints: 0, avg: 0, num: Math.random() * 3  }); //store hour averaged CSV data - one slot for each value
// for some reason, populating as above did not let each array index have a unique val. Filling it as below instead:
const hourAverages = [];
for (let i = 0; i < 24; i++) {
  hourAverages.push({
    total: 0,
    dataPoints: 0,
    avg: 0,
  });
}

const dataHourAvg = (values) => {
  const averagesArray = []; //create blank array
  for (let i = 0; i < 24; i++) {
    averagesArray.push({
      total: 0,
      dataPoints: 0,
      avg: 0,
    });
  } //fill array with blank desired data structure

  values.forEach((d, i) => {
    //TODO: add in real time vals
    const pointHour = d.time.getHours(); //get hour value of point
    const pointLightValue = d.light;
    // now add hour value to array val at hour index
    const newTotal = averagesArray[pointHour].total + pointLightValue; //add new data point to current total
    const newPoints = averagesArray[pointHour].dataPoints + 1; //add one to total num of data points

    averagesArray[pointHour].total = newTotal; //reset array vars
    averagesArray[pointHour].dataPoints = newPoints;
  });

  // after filling array, find averages of each point
  averagesArray.forEach((point) => {
    if (point.dataPoints > 0) {
      point.avg = point.total / point.dataPoints;
    }
  });

  return averagesArray
};

//ok! so now we should be able to map our light point averages onto the graph using the houravg.avg value

// get CSV data, return as an array of objects
const getCsvData = () => {
  const csvData = d3.csv("../data/outside_sun_campus.csv", function (d) {
    return {
      temp: +d.temp,
      humidity: +d.humidity,
      light: +d.light,
      uv: +d.uv,
      time: new Date(1656683511185),
      // time: new Date(+d.time)
      //TODO: add time
    };
  });
  return csvData;
};

(async () => {
  //   let csvData = await getCsvData();
  //   dataHourAvg(csvData, hourAverages); //fill hourAvg array with daatpoints based on hour of measurment
  //   hourAverages.forEach((hour) => {
  //       if (hour.dataPoints > 0){
  //         hour.avg = hour.total / hour.dataPoints; //once hourAvg file has been filled by above function, find averages
  //       }
  //   });
  // //  console.log(hourAverages)
})();

// get hour averaged data

// .forEach(d,i) - d stores value, i stores index
