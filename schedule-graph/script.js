console.log('loaded schedule graph');

// constants for formatting line graphs over the schedule image
const width = 860;
const height = 500;
let numGraphs = 5;
let graphPadding = 40;

// note these formatting values are unit-scaled and multiplied by the dimensions
// to update these values for a new schedule image, measure the pixel lengths using figma
// and divide by the pixel size of the iamge
const widthFactor = width / 523; // change to pixel width used for measurements
const heightFactor = height / 895; // same here

const margin = { top: 16 * heightFactor, right: 27 * widthFactor, bottom: 15 * heightFactor, left: 15 * widthFactor };
const hourLength = 60 * widthFactor;
const dayLength = 174 * heightFactor;
const spaceBetweenGraphs = 0;


const svg = d3
  .select("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom + (5*graphPadding))
  .append("g")
  .attr("transform", `translate(${margin.left} , ${margin.top})`);

const container = svg
  .append("g")
  .attr("class", "graphContainer")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

const daySelectTag = document.querySelector("select.daySelect");
const dataSelectTag = document.querySelector("select.dataSelect");

let curDay = classTimes[0];
let curDataVal = 0;

(async () => {
  let csvData = await getCsvData();
  const lightTimeData = getLightTimeData(csvData);
  const tempTimeData = getTempTimeData(csvData);
  const humidityTimeData = getHumidityTimeData(csvData);

  const drawData = (data, curDataVal, i ) => {
    let colors = ["green", "orange", "steelblue"]

    let graphGroup = svg.append("g")
        .attr("class", "dayGraph")
        .attr("height", height/5)
        .attr("transform", `translate(0, ${(height/numGraphs + graphPadding)  * i})`)

    //draw y axis
    let y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, (d, i) => {
          return d.value;
        }),
      ])
      .range([height, 0]);
    svg.append("g").attr("class", "left-axis").call(d3.axisLeft(y));
    //reusable draw data path function
    graphGroup
      .append("path")
      .datum(data) //input an array of light and time here
      .attr("fill", "none")
      .attr("stroke", colors[curDataVal])
      .attr("class", "dataPath")
      .attr("stroke-width", 1.5)
      .attr(
        "d",
        d3
          .line()
          .x(function (d) {
            return x(d.time);
          })
          .y(function (d) {
            return y(d.value);
          })
      );
  };


  //x axis does not change 
  let x = d3
    .scaleTime()
    .domain(
      d3.extent(csvData, (d, i) => {
        return d.time;
      })
    ) //d3.extent returns [min,max] of input
    //manually set these values to min max dates 
    //so x axis always starts at 8:00AM and goes to 5:00PM ON THE SELECTED DAY 
    .range([0, width]);

  svg
    .append("g")
    .attr("class", "bottom-axis")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

 //initial graph
 const drawAllGraphs = (graphData)=>{
    for (let i = 0; i < numGraphs; i++){
        drawData(graphData, curDataVal, i);
    }
 }

 drawAllGraphs(lightTimeData)

  //event listener for type of data to draw
  dataSelectTag.addEventListener("input", () => {
    curDataVal = dataSelectTag.value;

    d3.selectAll(".dataPath").remove();
    d3.selectAll(".left-axis").remove();

    if (curDataVal == 0) {
        drawAllGraphs(lightTimeData)
    }
    if (curDataVal == 1) {
        drawAllGraphs(tempTimeData)
    }
    if (curDataVal == 2) {
        drawAllGraphs(humidityTimeData)
    }
  });
})();
