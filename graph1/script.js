// .log(" sun dial script loaded");

//save width and height for easy access later on
const h = 800; //svg height
const w = 800; //svg width
const r = h / 2; //svg radius

let ticks = [2, 4, 6, 8, 10]; // one tick per hour of daylight

//sample data
let data = [];
let hours = [];


for (let i = 0; i < 24; i++) {
  hours.push(`${i}:00`);
}

// //generate the data
for (var i = 0; i < 1; i++){
    var point = {}
    //each feature will be a random number from 1-9
    //this plots a random number to each hour 
    hours.forEach(f => point[f] = 4 + Math.random() * 4);
    data.push(point);
}
//console.log(data);

const svg = d3.select("svg");
svg.attr("width", w);
svg.attr("height", h); //height of SVG tag is number of cities * 150px each

const graphBase = svg.append("g").attr("class", "graphBase");
const hoursGroup = svg.append("g").attr("class", "hoursGroup");

//first, plot gridlines
//next, plot axes
// third, plot shape

//now, we want to map our data values to radial dist from center of chart
//use linear scale
//our svg is 800 * 800, so lets have our max point radius be 350 (with 50 px of extra space in case)

//FUNCTIONS
const radialDist = d3
  .scaleLinear()
  .domain([0, 10]) //our test values range 0 to 10, probably our actual values will be close
  .range([0, r - 50]); //set max range to radius / 2

const getSvgAngle = (angle, pxDist) => {
  //using pythagorean theorum to get x and y positions of each point
  let x = Math.sin(angle) * pxDist;
  let y = Math.cos(angle) * pxDist;

  x = x + r; //move x start point to the middle of the graph
  y = y + r; //same for y

  return { x: x, y: y };
};
// setting up the graph skeleton
//GRAPH SETUP
ticks.forEach((tick) => {
  graphBase
    .append("circle") //append a circle to the SVG
    .attr("cx", r) //position of circle center x
    .attr("cy", r) //position of circle center y
    .attr("stroke", "gray") //TODO: move this to css
    .attr("fill", "none")
    .attr("r", radialDist(tick)); //create the circle using our radial scale

  graphBase
    .append("text")
    .attr("x", r)
    .attr("y", r - radialDist(tick) - 10) // r - dist because we need biggest on outside
    .text(`${tick}`);
});

//now, we need the hour labels
hours.forEach((hour, i) => {
  let angle = -(((2 * Math.PI) / hours.length) * i) - Math.PI; //get the angle of each hour by diving 2PI by num of hours, multiplying by i
  // subtract 2PI here to make jan start at the top
  let position = getSvgAngle(angle, r - 50);
  let textPosition = getSvgAngle(angle, r - 25);

  const hourGroup = hoursGroup.append("g").attr("class", "hourGroup");

  hourGroup
    .append("line")
    .attr("x1", r) //start line at center
    .attr("y1", r)
    .attr("x2", position.x)
    .attr("y2", position.y)
    .attr("fill", "none")
    .attr("stroke", "gray"); //TODO: MOVE TO CSS

  hourGroup
    .append("text")
    .attr("class", "hourText")
    .attr("x", textPosition.x)
    .attr("y", textPosition.y)
    .text(hour);
});

// now, lets plot the data

//make a line function

const line = d3
  .line()
  .x((d) => d.x)
  .y((d) => d.y);
let colors = ["yellow"];

const getPointCoords = (data_point) => {
  let coords = [];
  hours.forEach((hour, i) => {
    let angle = -(((2 * Math.PI) / hours.length) * i) - Math.PI;
    let pxLength = radialDist(data_point[hour]);
    coords.push(getSvgAngle(angle, pxLength)); //we will have to change this once we get real data!
  });

  return coords;
};

for (var i = 0; i < 1; i++) {
  let d = data[i];
  let color = colors[i];
  let coordinates = getPointCoords(d);

  // console.group(coordinates);

  const pointsGroup = svg.append("g").attr("class", "pointsGroup");

  coordinates.forEach((coord) => {
    pointsGroup
      .append("circle")
      .attr("class", "lightPoint")
      .attr("cx", coord.x)
      .attr("cy", coord.y)
      .attr("r", 4)
      .attr("fill", "yellow");
  });

  //draw the path element
  svg
    .append("path")
    .datum(coordinates)
    .attr("d", line)
    .attr("class", "sunLines")
    .attr("stroke-width", 3)
    .attr("stroke", color)
    .attr("fill", color)
    .attr("stroke-opacity", 1)
    .attr("opacity", 0.5);
}
