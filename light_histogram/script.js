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
            x1: 20,
            x2:25,
            centre: 22.5,
            strang:"Recommended value"
        }
    ];
(async()=>{
    const testData = await getCsvData();
    const insideData = testData.filter((data) => data.uv <= 1);


document.querySelector(".light_histogram").append(
    Plot.plot({
        x: {
            grid: true,
            label: "Light"
          },
          y: {  
            label: "Frequency",
            grid: true
          },
        marks: [
          Plot.rectY(recData,{x1: "x1", x2: "x2", y: "height", fill: "pink", inset:0 , fillOpacity:0.3}),
          Plot.text(recData,{x: "centre", y: "height", fill: "red", fillOpacity:1.0, text: d=> d.strang}),
          Plot.rectY(insideData, Plot.binX({y: "count"}, {x: "light", fill: "green", fillOpacity:0.8})),
          Plot.ruleY([0])
        ]
      })
)
})();


