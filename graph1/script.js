// .log(" sun dial script loaded");

//save width and height for easy access later on
const h = 800; //svg height
const w = 800; //svg width
const r = h / 2; //svg radius

let ticks = [200, 400, 600, 800, 1000]; // one tick per hour of daylight
//TODO: CHANGE THIS SCALE IN ACCORDANCE WITH CALIBRATION

let hours = []; //store an array of 24 hours to populate graph 
for (let i = 0; i < 24; i++) {
  hours.push(`${i}:00`);
}

// sunrise sunset times
const sunTimes = [
  { season: "summer", avgSunrise: 6.15, avgSunset: 20.5 },
  { season: "winter", avgSunrise: 7.45, avgSunset: 17.15 },
]; //TODO: add spring, fall suntimes MAYBE use an API 

const timeToFract = (time)=>{   //convert hour/minute time to fraction
  let hours = Math.floor(time) //get base hours
  let minsToFract = ((time - hours) * 100 / 60 )
  //if we end up using a date API this is very easy to change 
  const fract = hours + minsToFract
  return fract
}

const pieGenerator = (season) =>{
  //convert time to fractions: 
  let setFract = timeToFract(season.avgSunset)
  let riseFract = timeToFract(season.avgSunrise)

 // console.log(setFract, riseFract)

  let riseAngle = (((2 * Math.PI) / hours.length) * riseFract); 
  let setAngle = -((Math.PI * 2) - (((2 * Math.PI) / hours.length) * setFract)); 

  // console.log({rise: riseAngle, set: setAngle})
  return {rise: riseAngle, set: setAngle}
}

// how do we get sun time angles? 



const svg = d3.select("svg");
svg.attr("width", w);
svg.attr("height", h); //height of SVG tag is number of cities * 150px each

const graphBase = svg.append("g").attr("class", "graphBase"); //radial graph lines group
const hoursGroup = svg.append("g").attr("class", "hoursGroup"); //hours group

//now, we want to map our data values to radial dist from center of chart
//use linear scale
//our svg is 800 * 800, so lets have our max point radius be 350 (with 50 px of extra space in case)

//FUNCTIONS
const radialDist = d3
  .scaleLinear()
  .domain([0, 1000]) //our test values range 0 to 10, probably our actual values will be close
  .range([0, r - 50]); //set max range to radius / 2

const getSvgAngle = (angle, pxDist) => {
  let x = Math.sin(angle) * pxDist; //using pythagorean theorum to get x and y positions of each point
  let y = Math.cos(angle) * pxDist;
  x = x + r; //move x start point to the middle of the graph
  y = y + r; //same for y
  return { x: x, y: y };
};

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

//HOUR LABELS
hours.forEach((hour, i) => {
  let angle = -(((2 * Math.PI) / hours.length) * i) - Math.PI; //get the angle of each hour by diving 2PI by num of hours, multiplying by i
  // subtract PI here to make 0:00 start at the top
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

//DATA 
const line = d3
  .line()
  .x((d) => d.x)
  .y((d) => d.y);

const getPointCoords = (data_point) => {
  let coords = [];
  hours.forEach((hour, i) => {
    let angle = -(((2 * Math.PI) / hours.length) * i) - Math.PI;
    let pxLength = radialDist(data_point[i].avg); // this has to change
    coords.push(getSvgAngle(angle, pxLength)); //we will have to change this once we get real data!
  });

  return coords;
};

//data collection and processing is async
(async () => {

  pieGenerator(sunTimes[0])
  // get CSV data
  let csvData = await getCsvData();
  const hourAverages = dataHourAvg(csvData); //fill hourAvg array with daatpoints based on hour of measurment
  console.log(hourAverages);

  let d = hourAverages
  let color = "yellow";
  let coordinates = getPointCoords(d);

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


  // draw pie lines for night hours 
  svg
    .append("path")
    .attr("class", "sunArc")
    .attr("d", d3.arc()
      .innerRadius(0) // leave
      .outerRadius(r - 50) //leave 
      .startAngle(pieGenerator(sunTimes[0]).set) //start arc when sun sets
      .endAngle( pieGenerator(sunTimes[0]).rise) //end arc when sun rises 
        // .startAngle(0)
      )
      .attr("fill", "grey")
      .attr("stroke", "none")


})();