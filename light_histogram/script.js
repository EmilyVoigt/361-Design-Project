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
            height: 14,
            light: 280
        }
    ];
(async()=>{
    const testData = await getCsvData();


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
          Plot.barY(recData, {x: "light", y: "height", fill: "#bab0ab", fillOpacity:0.2, width:50}),
          Plot.text(recData, {x: "light", y: "height",fill: "red", text:"Recommended Value"}),
          Plot.rectY(testData, Plot.binX({y: "count"}, {x: "light", fill: "green"})),
          Plot.ruleY([0])
        ]
      })
)
})();


