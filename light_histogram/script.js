console.log("light histogram loaded");
//create array of key-data values used to set width of recommended value shaded area on histogram
const recData = [
    {
        x1: 401,
        x2:5000,
    }
];

//Call async function to get csv data file
(async()=>{
    const testData = await getCsvData();
    const insideData = testData.filter((data) => data.uv <= 1);
    const numberOfRows = testData.length - 1;

//append plot to web page
document.querySelector(".light_histogram").append(
    //create plot
    Plot.plot({
        //set labels and attributes of axis
        x: {
            grid: true,
            label: "Light (log scale)",
            type: "log"          
          },
          y: {  
            label: "Total Minutes",
            grid: true
          },
        marks: [
        //Add and format data on graph, first rect is recommended value shaded area, 
        //second uses built in binning process to create histogram
          Plot.rectY(recData,{x1: "x1", x2: "x2", y: 500, fill: "#2ECC71", inset:0 , fillOpacity:0.3}),
          Plot.rectY(insideData, Plot.binX({y: "count"}, {x:"light", fill: 'white', fillOpacity:0.8})),
          Plot.ruleY([0])
        ]
      })
)

})();

