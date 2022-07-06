console.log("temperature histogram loaded");

    const recData = [
        {
            height: 400,
            x1: 21,
            x2:26,
            centre: 23.5,
            strang:"Recommended value"
        }
    ];
(async()=>{
    const testData = await getCsvData();

document.querySelector(".temp_histogram").append(
    Plot.plot({
        x: {
            grid: true,
            label: "Temperature"
          },
          y: {  
            label: "Frequency",
            grid: true
          },
        marks: [
          Plot.rectY(recData,{x1: "x1", x2: "x2", y: "height", fill: "pink", inset:0 , fillOpacity:0.3}),
          Plot.text(recData,{x: "centre", y: "height", fill: "black", text: d=> d.strang}),
          Plot.rectY(testData, Plot.binX({y: "count"}, {x: "temp", fill: "green", fillOpacity:0.8})),
          Plot.ruleY([0])
        ]
      })
)
})();


