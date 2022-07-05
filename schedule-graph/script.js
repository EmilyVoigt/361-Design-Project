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

//let curDay = classTimes[0];
let dataSelectVal = 0;

(async () => {
  let csvData = await getCsvData();
  const lightTimeData = getLightTimeData(csvData);
  const tempTimeData = getTempTimeData(csvData);
  const humidityTimeData = getHumidityTimeData(csvData);
  const mappedDays = getDataDays(csvData); // array of days we actually have data for

  //draw data function
  const drawData = (data, dataSelectVal, i, curDay) => {
    let colors = ["green", "orange", "steelblue"];
    const startTime = new Date(
      curDay.year,
      curDay.month,
      curDay.date,
      9
    );
    const endTime = new Date(curDay.year, curDay.month, curDay.date, 10);

    //now, filter the data based on selected day

    console.log(startTime, endTime)

    const dateData = [];
    data.forEach((point) => {
      // we pass in 2 variables of data to this function
      let pointDate = point.time.getDate();
      let pointYear = point.time.getFullYear();
      let pointMonth = point.time.getMonth();

      //here, we filter the data by day, adding only relevent day data to the curdata array
      if (
        pointDate === curDay.date &&
        pointYear === curDay.year &&
        pointMonth === curDay.month
      ) {
        dateData.push(point);
      }
    });

    console.log(dateData)


    let graphGroup = svg
      .append("g")
      .attr("class", "dayGraph")
      .attr("height", height / 5)
      .attr("transform", `translate(0, ${(height / numGraphs + graphPadding) * i})`);

    //draw y axis
    let y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(dateData, (d, i) => {
          return d.value;
        }),
      ])
      .range([height / 5, 0]);
    graphGroup.append("g").attr("class", "left-axis").call(d3.axisLeft(y));

    //draw x axis
    let x = d3
      .scaleTime()
    //   .domain(
    //     d3.extent(dateData, (d, i) => {
    //       return d.time;
    //     })
    //   )
      .domain([startTime, endTime])
      .range([0, width]);

    //draw bottom axis
    graphGroup
      .append("g")
      .attr("class", "bottom-axis")
      .attr("transform", `translate(0, ${height / numGraphs})`)
      .call(d3.axisBottom(x));

    graphGroup
      .append("text")
      .text(`${curDay.day}`)
      .attr("class", "xlabel")
      .attr("color", "black")
      .attr("transform", `translate(0, ${height / numGraphs})`);

    //reusable draw data path function
    graphGroup
      .append("path")
      .datum(dateData) //input an array of light and time here
      .attr("fill", "none")
      .attr("stroke", colors[dataSelectVal])
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

  //initial graph
  const drawAllGraphs = (graphData) => {
    for (let i = 0; i < mappedDays.length; i++) {
      drawData(graphData, dataSelectVal, i, mappedDays[i]);
    }
  };

  drawAllGraphs(lightTimeData);

  //event listener for type of data to draw
  dataSelectTag.addEventListener("input", () => {
    dataSelectVal = dataSelectTag.value;

    d3.selectAll(".dataPath").remove(); // remove all existing graphs
    d3.selectAll(".left-axis").remove(); //remove left axis
    d3.selectAll(".bottom-axis").remove(); //remove bottom axis

    if (dataSelectVal == 0) {
      drawAllGraphs(lightTimeData);
    }
    if (dataSelectVal == 1) {
      drawAllGraphs(tempTimeData);
    }
    if (dataSelectVal == 2) {
      drawAllGraphs(humidityTimeData);
    }
  });
})();
