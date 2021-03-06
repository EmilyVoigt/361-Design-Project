// constants for formatting line graphs over the schedule image
const imageWidth = 1193;
const imageHeight = 1084;
const margin = { top: imageWidth/50, right: imageWidth/50, bottom: imageWidth/50, left: imageWidth/20 };
const scheduleTimeRange = {
  start: 8, // start time of graph on 24-hour clock
  end: 18   // end time of graph on 24-hour clock
}

// note these formatting values are unit-scaled and multiplied by the dimensions
// to update these values for a new schedule image, measure the pixel lengths using figma
// and divide by the pixel size of the iamge
const widthFactor = imageWidth / 1193; // change to pixel width used for measurements
const heightFactor = imageHeight / 1084; // same here

const imageMargin = { top: 45 * heightFactor, right: 23 * widthFactor, bottom: 28.5 * heightFactor, left: 32 * widthFactor };
const dayLength = 138.5 * heightFactor;
const spaceBetweenGraphs = 80 * heightFactor;

const axisLabels = [
  'Light Intensity (lux)',  // index 0 = light
  'Temperature (\u2103)',        // index 1 = temperature
  'Relative Humidity (%)'   // index 2 = humidity 
];

const svg = d3
  .select("svg.graph")
  .attr("width", imageWidth + margin.left + margin.right)
  .attr("height", imageHeight + margin.top + margin.bottom + 5 * spaceBetweenGraphs);

const imageContainer = svg
  .append("g")
  .attr("transform", `translate(${margin.left} , ${margin.top})`)
  .attr('class', 'image-container');

imageContainer.append('image')
  .attr('xlink:href', "schedule-graph/schedule.jpg")
  .attr('width', imageWidth)
  .attr('height', imageHeight)
  .attr('class', 'schedule-image');

const graphContainer = imageContainer.append("g")
  .attr("class", "graph-container")
  .attr("transform", `translate(${imageMargin.left}, ${imageMargin.top})`);

//select dropdown to allow user to select which data they see, and set initial value to 0 (temperature)
const dataSelectTag = document.querySelector("select.dataSelect");
let dataSelectVal = 0;

(async () => {
  let csvData = await getCsvData(); //get data 
  const lightTimeData = getLightTimeData(csvData); //filter data into only light, temp, or humidity sets
  const tempTimeData = getTempTimeData(csvData);
  const humidityTimeData = getHumidityTimeData(csvData);
  const mappedDays = getDataDays(csvData); // array of days we have data for

  const drawAllGraphs = (graphData) => {
    for (let i = 0; i < mappedDays.length; i++) {
      drawData(graphData, dataSelectVal, i, mappedDays[i]);
    }
  };
  
  // default graph to display on page load
  drawAllGraphs(lightTimeData);

  //event listener for type of data to draw
  dataSelectTag.addEventListener("input", () => {
    dataSelectVal = dataSelectTag.value;

    d3.selectAll(".dataPath").remove(); // remove all existing graphs
    d3.selectAll(".left-axis").remove(); //remove left axis
    d3.selectAll(".bottom-axis").remove(); //remove bottom axis
    d3.selectAll(".y-label").remove(); // remove y-axis label

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

//draw data function
// data - time and value array
// dataSelectVal - the data type selected to visualize
// index - the index of the date (ie 0 should be monday, 1 tuesday etc)
// curDay - the day as a date object that we are drawing this for
function drawData (data, dataSelectVal, index, curDay) {
  let colors = ["green", "orange", "steelblue"];
  const startTime = new Date(curDay.year, curDay.month, curDay.date, scheduleTimeRange.start);
  const endTime = new Date(curDay.year, curDay.month, curDay.date, scheduleTimeRange.end);

  //now, filter the data based on selected day
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
      pointMonth === curDay.month &&
      point.time > startTime && //filter out too big or too small times
      point.time < endTime
    ) {
      dateData.push(point);
    }
  });

  let graphGroup = graphContainer
    .append("g")
    .attr("class", `day-graph-${index}`)
    .attr("height", dayLength)
    .attr("transform", `translate(0, ${(dayLength + spaceBetweenGraphs) * (curDay.day - 1)})`);

  //draw y axis
  let y = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, (d, i) => {
        return d.value;
      }),
    ])
    .range([dayLength, 0]);
  graphGroup.append("g").attr("class", "left-axis").call(d3.axisLeft(y));

  // draw y axis title
  graphGroup.append('text')
    .attr('transform', `translate(${-margin.left},${dayLength/2})rotate(-90)`)
    .text(axisLabels[dataSelectVal])
    .attr('class', 'y-label');

  //draw x axis
  let x = d3
    .scaleTime()
    .domain([startTime, endTime])
    .range([0, imageWidth - imageMargin.left - imageMargin.right]);

  graphGroup
    .append("g")
    .attr("class", "bottom-axis")
    .attr("transform", `translate(0, ${dayLength})`)
    .call(d3.axisBottom(x));

  // draw data line
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
