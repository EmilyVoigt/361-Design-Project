const testTime = new Date(1656683511185);
let csvData = null;

const getCsvData = () => {
  const csvData =  d3.csv("../data/outside_sun_campus.csv", function (d) {
    return {
      temp: +d.temp,
      humidity: +d.humidity,
      light: +d.light,
      uv: +d.uv,
    };
  });
  return csvData;
};

(async () => {
    let csvData = await getCsvData()
    console.log(csvData)
})()

// TODO: clean this up!
