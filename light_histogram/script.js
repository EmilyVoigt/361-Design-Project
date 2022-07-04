console.log("light histogram loaded");

//data = FileAttachment("light_histogram/inside_house.csv").csv({typed: true})

const data = [
    {
        temp: 31,
        humidity: 29,
        light: 917,
        uv: 170,
        time: 0
    },
    {
        temp: 31,
        humidity: 29,
        light: 918,
        uv: 170,
        time: 60
    },
    {
        temp: 32,
        humidity: 29,
        light: 918,
        uv: 168,
        time: 120
    },
    {
        temp: 31,
        humidity: 29,
        light: 917,
        uv: 170,
        time: 0
    },
    {
        temp: 31,
        humidity: 29,
        light: 918,
        uv: 170,
        time: 60
    }
];

dotplot = Plot.dot(data, {x: "temp", y: "humidity"}).plot();
/*Plot.plot({
    y: {
      grid: true
    },
    color: {
      legend: true
    },
    marks: [
      Plot.rectY(data, Plot.binX({y: "light"}, {x: "time"})),
      Plot.ruleY([0])
    ]
  })*/