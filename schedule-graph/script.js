// select svg tag
let margin = { top: 10, right: 30, bottom: 30, left: 60 };
let w = 860 - margin.left - margin.right;
let h = 500 - margin.top - margin.bottom;

const svg = d3
  .select("svg")
  .attr("width", w + margin.left + margin.right)
  .attr("height", h + margin.top + margin.bottom)
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

  const drawData = (data, curDataVal) => {
    let colors = ["green", "orange", "steelblue"]
    let y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, (d, i) => {
          return d.value;
        }),
      ])
      .range([h, 0]);
    svg.append("g").attr("class", "left-axis").call(d3.axisLeft(y));
    //reusable draw data path function
    svg
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
    .range([0, w]);

  svg
    .append("g")
    .attr("class", "bottom-axis")
    .attr("transform", `translate(0, ${h})`)
    .call(d3.axisBottom(x));

  drawData(lightTimeData, curDataVal); //initial graph

  dataSelectTag.addEventListener("input", () => {
    curDataVal = dataSelectTag.value;

    d3.selectAll(".dataPath").remove();
    d3.selectAll(".left-axis").remove();

    if (curDataVal == 0) {
      drawData(lightTimeData, curDataVal);
    }
    if (curDataVal == 1) {
      drawData(tempTimeData, curDataVal);
    }
    if (curDataVal == 2) {
      drawData(humidityTimeData, curDataVal);
    }
  });
})();
