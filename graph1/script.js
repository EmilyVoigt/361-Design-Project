//save width and height for easy access later on
const h = 650; //svg height
const w = 650; //svg width
const r = h / 2; //svg radius

const ticks = [40, 400, 4000, 14000]; // key data values identified - classroom brightness is roughly 400 lux, 14000 is about the max brightness value

let hours = []; //store an array of 24 hours to populate graph
for (let i = 0; i < 24; i++) { //populate array
  hours.push(`${i}:00`);
}

const avgSunTimes = findAverageTime(summerData); //find average sunset/sunrise times from webscraped sunrise/set data per day
// sunrise sunset times
const sunTimes = [
  {
    season: "summer",
    end: {
      hour: avgSunTimes.riseTime.hour,
      minute: avgSunTimes.riseTime.minute,
    },
    start: { hour: avgSunTimes.setTime.hour, minute: avgSunTimes.setTime.minute },
  },
];

const timeToFract = (time) => {
  //convert hour/minute time to hour / fraction 
  // eg. 6:30 -> 6.5
  const minsToFract = time.minute / 60;
  const fract = time.hour + minsToFract;
  return fract;
};

const pieGenerator = (period) => {
  //convert time to fractions:
  let startFract = timeToFract(period.start); //begin the pie at this angle
  let endFract = timeToFract(period.end); //end the pie at this angle

  let startAngle = 0;
  if (startFract > endFract) {
    startAngle = -(Math.PI * 2 - ((2 * Math.PI) / hours.length) * startFract);
  } else {
    startAngle = ((2 * Math.PI) / hours.length) * startFract;
  }

  let endAngle = ((2 * Math.PI) / hours.length) * endFract;
  return { start: startAngle, end: endAngle };
};

const svg = d3.select("svg");
svg.attr("width", w);
svg.attr("height", h);

const graphBase = svg.append("g").attr("class", "graphBase"); //radial graph lines group
const hoursGroup = svg.append("g").attr("class", "hoursGroup"); //hours group

//map data values to radial distances from center of chart using a log scale
let radialDist = d3
  .scaleLog()
  .domain([1, 20000]) //domain is from 1 to 20000 lux, minValue of dataset is 2 lux, max val is 14000 lux
  .range([0, r - 50]); //range to map data to 

const getSvgAngle = (angle, pxDist) => {
  let x = Math.sin(angle) * pxDist; //using pythagorean theorum to get x and y positions of each point
  let y = Math.cos(angle) * pxDist;
  x = x + r; //move x start point to the middle of the graph
  y = y + r; //same for y
  return { x: x, y: y };
};

//GRAPH SETUP
//HOUR LABELS
hours.forEach((hour, i) => {
  let angle = -(((2 * Math.PI) / hours.length) * i) - Math.PI; //get the angle of each hour by diving 2PI by num of hours, multiplying by i
  // subtract PI here to make 0:00 start at the top
  let position = getSvgAngle(angle, r - 50); //get x,y position of each hour from angle and radius 
  let textPosition = getSvgAngle(angle, r - 25); //get text position using a slightly larger radius

  const hourGroup = hoursGroup.append("g").attr("class", "hourGroup");

  hourGroup //append one line for each hour
    .append("line")
    .attr("x1", r) //start line at center
    .attr("y1", r)
    .attr("x2", position.x)
    .attr("y2", position.y)
    .attr("fill", "none")
    .attr("stroke", "gray");

  hourGroup 
    .append("text") //append hour labels 
    .attr("class", "hourText")
    .attr("x", textPosition.x)
    .attr("y", textPosition.y)
    .text(hour);
});

ticks.forEach((tick) => {
  graphBase
    .append("circle") //append a circle to the SVG for each key data point identified above
    .attr("cx", r) //position of circle center x
    .attr("cy", r) //position of circle center y
    .attr("stroke", "gray")
    .attr("fill", "none")
    .attr("r", radialDist(tick)); //create the circle radius using our radial scale

  graphBase
    .append("text") //append circle labels
    .attr("class", "tickLabel")
    .attr("x", r)
    .attr("y", r - radialDist(tick) - 10) // r - dist because we need biggest on outside
    .text(`${tick} lux`);
});

const line = d3
  .line()
  .x((d) => d.x)
  .y((d) => d.y);

//reusable function to draw time pie slices (used for class time sections)
const drawClassPie = (time) => {
  svg
    .append("path")
    .attr("class", "classArc")
    .attr(
      "d",
      d3
        .arc()
        .innerRadius(0) // leave
        .outerRadius(r - 50) //leave
        .startAngle(pieGenerator(time).start) 
        .endAngle(pieGenerator(time).end) 
    )
    .attr("fill", "pink")
    .attr("stroke", "none");
};

//update class pie times in accordnace with selection
let curClassTime = classTimes[1];
drawClassPie(curClassTime.morning); //draw initial class pies
drawClassPie(curClassTime.afternoon);

// select tag was moved in interest of maintaining the clarity of the dashboard as a whole, but functional components remain for future development 
// 
//  const selectTag = document.querySelector("select");
//  selectTag.addEventListener("input", () => {
//   curClassTime = classTimes[selectTag.value];
//   d3.selectAll(".classArc").remove(); //remove prev. class pies
//   drawClassPie(curClassTime.morning); //add new class pies
//   drawClassPie(curClassTime.afternoon);
// });

//get point coords from average data for points
const getPointCoords = (data_point) => {
  let coords = [];
  hours.forEach((hour, i) => {
    let angle = -(((2 * Math.PI) / hours.length) * i) - Math.PI;
    let pxLength = radialDist(data_point[i].avg); 
    let coordPos = getSvgAngle(angle, pxLength);
    coords.push({ x: coordPos.x, y: coordPos.y, value: data_point[i].avg }); //we will have to change this once we get real data!
  });
  return coords;
};

//get co-ords for actual line directly from our CSV data
const getLinePointCoords = (dataSet) => {
  let coords = [];
  const maxPoints = 24 * 60; //max amount of values in array is the number of minutes in a day, as measurment frequency is once per minute
  dataSet.forEach((point) => {
    const pointTimeFract = point.time.getHours() + point.time.getMinutes() / 60; //find time fraction
    let angle = -(((2 * Math.PI) / hours.length) * pointTimeFract) - Math.PI; //find angle from time fraction
    let pxLength = radialDist(point.light); // scale light value to radial axis
    let coordPos = getSvgAngle(angle, pxLength);
    if (coords.length < maxPoints) {
      coords.push({ x: coordPos.x, y: coordPos.y, value: point.light });
    } else {
      //handle case of if current time has already been tracked, overwrite with new time
      coords.shift();
      coords.push({ x: coordPos.x, y: coordPos.y, value: point.light });
    }
  });
  //handle case if less co-ords than needed, add position 0 to end
  if (coords.length < maxPoints) {
    coords.push(getSvgAngle(0, 0));
  }
  //add starting data point to end of array to close the stroke
  coords.push(coords[0]);
  return coords;
};

const filterInvalidValues = (array)=>{
// filter invalid data points (points for which no time data exists) from data set to be plotted
// this occurs as a result of use of log scale - if light value is 0, log(0) is invalid, so filtering the invalid values
  const finalArray = []
  array.forEach((point, i) =>{
    if (point.value !== 0){
      finalArray.push(point)
    }
  })
  return finalArray
}

// draw pie lines for night hours
svg
  .append("path")
  .attr("class", "sunArc")
  .attr(
    "d",
    d3
      .arc()
      .innerRadius(0) // leave
      .outerRadius(r - 50) //leave
      .startAngle(pieGenerator(sunTimes[0]).start) //start arc when sun sets
      .endAngle(pieGenerator(sunTimes[0]).end) //end arc when sun rises
  )
  .attr("fill", "grey")
  .attr("stroke", "none");

//create a div that we can use for our tooltip

//append a div to the page to act as the tooltip when hovering data points
var tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);


//data collection and processing is async
(async () => {
  // get CSV data
  const dataDate = new Date(2022, 06, 05);
  let csvData = await getCsvDataForDate(dataDate); //get data only for a specific date 
  let d = dataHourAvg(csvData);
  let coordinates = filterInvalidValues(getPointCoords(d)); //remove NaN values caused by invalid logScale results
  let coordinates2 = getLinePointCoords(csvData);

  //draw the path element
  svg
    .append("path")
    .datum(coordinates2)
    .attr("d", line)
    .attr("class", "sunLines")
    .attr("stroke-width", 3)
    .attr("stroke", "yellow")
    .attr("fill", "yellow")
    .attr("stroke-opacity", 1)
    .attr("opacity", 0.5);

  const pointsGroup = svg.append("g").attr("class", "pointsGroup");

  pointsGroup
    .selectAll("circle") //append circles for averages of data at each hour 
    .data(coordinates)
    .enter()
    .append("circle")
    .attr("class", "lightPoint")
    .attr("cx", (d, i) => {
      if (d.value > 0){
        return d.x
      } else {
        return 0 //
      }
    })
    .attr("cy", (d, i) => {
      if (d.value > 0){
        return d.y;
      } else {
        return 0
      }
    })
    .attr("r", 4)
    .attr("fill", "orange")

    //add hovers
    .on("mouseover", (event, d) => {
      let toolTipNum = Math.floor(d.value); //set tooltip number to currently hovered point
      tooltip
        .html("average light level: " + toolTipNum.toString() + " lux")
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 15 + "px");
      tooltip.transition().duration("50").style("opacity", "1");
    })
    .on("mouseout", () => { //on mouse out, remove tooltip
      tooltip.transition().duration("50").style("opacity", "0");
    });
})();
