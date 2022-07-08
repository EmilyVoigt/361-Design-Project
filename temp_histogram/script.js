console.log("temperature histogram loaded");

//create array of key-data values used to set width of recommended value shaded area on histogram
const recData = [
        {
            x1: 21,
            x2:26,
        }
];

//Call async function to get csv data file
(async()=>{
    const testData = await getCsvData();

//append plot to web page
document.querySelector(".temp_histogram").append(
  //create plot
    Plot.plot({
      //set labels and attributes of axis
        x: {
            grid: true,
            label: "Temperature"
          },
          y: {  
            label: "Minutes in a 48 hour period",
            grid: true
          },
        marks: [
          //Add and format data on graph, first rect is recommended value shaded area, 
          //second uses built in binning process to create histogram
          Plot.rectY(recData,{x1: "x1", x2: "x2", y: "height", fill: "#2ECC71", inset:0 , fillOpacity:0.3}),
          Plot.rectY(testData,Plot.binX({y:"count"}, {x: "temp", fill: "white", fillOpacity:0.8, inset: 0})),
          Plot.ruleY([0])
        ]
      })
)
})();
