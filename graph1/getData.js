//function to average CSV light data by hour for radial graph
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
    let pointHour = d.time.getHours(); //get hour value of point
    const pointMinute = d.time.getMinutes();
    const pointLightValue = d.light;

    //if minutes is greater than 30, increase the hour by one
    //this allows data to average by half hour before and after the point, rather than for the whole hour after
    if (pointMinute > 30){
      pointHour ++;
    }

    // now add hour value to array val at hour index
    const newTotal = averagesArray[pointHour].total + pointLightValue; //add new data point to current total
    const newPoints = averagesArray[pointHour].dataPoints + 1; //add one to total num of data points

    averagesArray[pointHour].total = newTotal; //reset array vars
    averagesArray[pointHour].dataPoints = newPoints;
  });

  // after filling array with data, find averages of each point
  averagesArray.forEach((point) => {
    if (point.dataPoints > 0) {
      point.avg = point.total / point.dataPoints;
    }
  });

  return averagesArray
};
