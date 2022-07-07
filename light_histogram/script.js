console.log("light histogram loaded");

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
        humidity: 23,
        light: 918,
        uv: 170,
        time: 60
    },
    {
        temp: 32,
        humidity: 25,
        light: 918,
        uv: 168,
        time: 120
    },
    {
        temp: 31,
        humidity: 26,
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
        temp: 31,
        humidity: 23,
        light: 800,
        uv: 170,
        time: 60
    },
    {
        temp: 31,
        humidity: 24,
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
        humidity: 30,
        light: 918,
        uv: 168,
        time: 120
    },
    {
        temp: 31,
        humidity: 28,
        light: 917,
        uv: 170,
        time: 0
    },
    {
        temp: 31,
        humidity: 27,
        light: 918,
        uv: 170,
        time: 60
    },
    {
        temp: 31,
        humidity: 23,
        light: 800,
        uv: 170,
        time: 60
    },
    {
        temp: 31,
        humidity: 21,
        light: 917,
        uv: 170,
        time: 0
    },
    {
        temp: 31,
        humidity: 26,
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
        humidity: 30,
        light: 917,
        uv: 170,
        time: 0
    },
    {
        temp: 31,
        humidity: 22,
        light: 918,
        uv: 170,
        time: 60
    },
    {
        temp: 31,
        humidity: 25,
        light: 800,
        uv: 170,
        time: 60
    }];

    const recData = [
        {
            height: 400,
            x1: 500,
            x2:750 ,
            centre: 625,
            strang:"Recommended value"
        }
    ];
(async()=>{
    const testData = await getCsvData();
    const insideData = testData.filter((data) => data.uv <= 1);
    const numberOfRows = data.length - 1;

document.querySelector(".light_histogram").append(
    Plot.plot({
        x: {
            grid: true,
            label: "Light (log scale)",
            type: "log"          
          },
          y: {  
            label: "Frequency",
            grid: true
          },
        marks: [
          Plot.rectY(recData,{x1: "x1", x2: "x2", y: "height", fill: "#2ECC71", inset:0 , fillOpacity:0.3}),
          Plot.rectY(insideData, Plot.normalizeY(Plot.binX({y: "count"}, {x:"light", fill: 'white', fillOpacity:0.8}))),
          Plot.ruleY([0])
        ]
      })
)

})();

/*Plot.plot({
    marks: [
      Plot.line(
        data,
        Plot.normalizeY(
          "last",
          Plot.binX(
            { y: "sum" },
            {
              x: "date",
              y: "price_in_usd",
              stroke: "brand",
              sort: "date",
              thresholds: d3.utcDay
            }
          )
        )
      )
    ],
    y: {
      label: "Price normalized by last value"
    },
    height: 200,
    width: 802, 
    color: { legend: true }
  })
*/