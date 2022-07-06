console.log("humidity histogram loaded");

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

document.querySelector(".humidity_histogram").append(
    Plot.plot({
        x: {
            grid: true,
            label: "Humidity"
          },
          y: {  
            label: "Frequency",
            grid: true
          },
        marks: [
          Plot.rectY(recData,{x1: "x1", x2: "x2", y: "height", fill: "pink", inset:0 , fillOpacity:0.3}),
          Plot.text(recData,{x: "centre", y: "height", fill: "red", fillOpacity:1.0, text: d=> d.strang}),
          Plot.rectY(testData, Plot.binX({y: "count"}, {x: "humidity", fill: "green", fillOpacity:0.8})),
          Plot.ruleY([0])
        ]
      })
)
})();


