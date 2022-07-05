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
    }];




document.querySelector(".light_histogram").append(
    Plot.plot({
        y: {
          grid: true
        },
        marks: [
          Plot.rectY(data, Plot.binX({y: "count"}, {x: "light"})),
          Plot.ruleY([0])
        ]
      })

)


