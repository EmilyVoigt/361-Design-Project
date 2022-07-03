//save width and height for easy access later on
const h = 800; //svg height
const w = 800; //svg width
const r = h / 2; //svg radius

const ticks = [200, 400, 600, 800, 1000]; // one tick per hour of daylight
//TODO: CHANGE THIS SCALE IN ACCORDANCE WITH CALIBRATION

let hours = []; //store an array of 24 hours to populate graph
for (let i = 0; i < 24; i++) {
  hours.push(`${i}:00`);
}

const avgTimes = findAverageTime(summerData);
// sunrise sunset times
const sunTimes = [
  {
    season: "summer",
    end: {
      hour: avgTimes.riseTime.hour,
      minute: avgTimes.riseTime.minute,
    },
    start: { hour: avgTimes.setTime.hour, minute: avgTimes.setTime.minute },
  },
  {
    season: "winter",
    end: { hour: 7, minute: 45 },
    start: { hour: 5, minute: 15 },
  },
]; //TODO: add spring, fall suntimes MAYBE use an API

const classTimes = [
  {
    morning: { start: { hour: 8, minute: 30 }, end: { hour: 12, minute: 00 } },
    afternoon: {
      start: { hour: 13, minute: 30 },
      end: { hour: 15, minute: 30 },
    },
  },
  {
    morning: { start: { hour: 8, minute: 30 }, end: { hour: 12, minute: 30 } },
    afternoon: {
      start: { hour: 13, minute: 30 },
      end: { hour: 16, minute: 00 },
    },
  },
  {
    morning: { start: { hour: 8, minute: 30 }, end: { hour: 11, minute: 30 } },
    afternoon: {
      start: { hour: 12, minute: 30 },
      end: { hour: 16, minute: 00 },
    },
  },
  {
    morning: { start: { hour: 9, minute: 00 }, end: { hour: 12, minute: 30 } },
    afternoon: {
      start: { hour: 13, minute: 30 },
      end: { hour: 15, minute: 00 },
    },
  },
  {
    morning: { start: { hour: 0, minute: 00 }, end: { hour: 0, minute: 00 } },
    afternoon: { start: { hour: 0, minute: 00 }, end: { hour: 0, minute: 00 } },
  },
];

const timeToFract = (time) => {
  //convert hour/minute time to fraction
  const minsToFract = time.minute / 60;
  const fract = time.hour + minsToFract;
  return fract;
};

const pieGenerator = (period) => {
  //convert time to fractions:
  let startFract = timeToFract(period.start);
  let endFract = timeToFract(period.end);

  let startAngle = 0;
  if (startFract > endFract) {
    startAngle = -(Math.PI * 2 - ((2 * Math.PI) / hours.length) * startFract);
  } else {
    startAngle = ((2 * Math.PI) / hours.length) * startFract;
  }

  let endAngle = ((2 * Math.PI) / hours.length) * endFract;

  // console.log({rise: riseAngle, set: setAngle})
  return { start: startAngle, end: endAngle };
};

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
    .attr("class", "tickLabel")
    .attr("x", r)
    .attr("y", r - radialDist(tick) - 10) // r - dist because we need biggest on outside
    .text(`${tick}`);
});

//DATA
const line = d3
  .line()
  .x((d) => d.x)
  .y((d) => d.y);

//reusable function to draw class time pie slices
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
        .startAngle(pieGenerator(time).start) //start arc when sun sets
        .endAngle(pieGenerator(time).end) //end arc when sun rises
    )
    .attr("fill", "pink")
    .attr("stroke", "none");
};

let curClassTime = classTimes[0];
const selectTag = document.querySelector("select");
drawClassPie(curClassTime.morning); //draw initial class pies
drawClassPie(curClassTime.afternoon);

selectTag.addEventListener("input", () => {
  curClassTime = classTimes[selectTag.value];

  d3.selectAll('.classArc').remove() //remove prev. class pies

  drawClassPie(curClassTime.morning); //add new class pies
  drawClassPie(curClassTime.afternoon);
});


//get point coords using average data for points
const getPointCoords = (data_point) => {
  let coords = [];
  hours.forEach((hour, i) => {
    let angle = -(((2 * Math.PI) / hours.length) * i) - Math.PI;
    let pxLength = radialDist(data_point[i].avg); // this has to change
    coords.push(getSvgAngle(angle, pxLength)); //we will have to change this once we get real data!
  });

  return coords;
};


//get co-ords for actual line directly from our CSV data
const getLinePointCoords = (dataSet)=>{
  let coords = []
  const maxPoints = (24 * 60 )/10 //currently, we're storing data at 10 min incriments
  //TODO: UPDATE THIS AS WE GET OUR REAL TIME INCRIMENT
  dataSet.forEach(point =>{
    const pointTimeFract = point.time.getHours() + (point.time.getMinutes()/60) 
    let angle = -(((2 * Math.PI) / hours.length) * pointTimeFract) - Math.PI;
    let pxLength = radialDist(point.light)
    if (coords.length < maxPoints){
      coords.push(getSvgAngle(angle, pxLength))
    } else {
      //handle case of if current time has already been tracked, overwrite with new time
      coords.shift()
      coords.push(getSvgAngle(angle, pxLength))
    }
  })

  //add starting data point to end of array to close the stroke
  coords.push(coords[0])

  return coords
}

//if theres 2 points at the same time, take the more recent one


//data collection and processing is async
(async () => {
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
      // .startAngle(0)
    )
    .attr("fill", "grey")
    .attr("stroke", "none");

  // get CSV data
  let csvData = await getCsvData();
  let d = dataHourAvg(csvData); 
  let coordinates = getPointCoords(d);
  let coordinates2 = getLinePointCoords(csvData);

  const pointsGroup = svg.append("g").attr("class", "pointsGroup");

  //put points on each hour for average time 
  coordinates.forEach((coord) => {
    pointsGroup
      .append("circle")
      .attr("class", "lightPoint")
      .attr("cx", coord.x)
      .attr("cy", coord.y)
      .attr("r", 4)
      .attr("fill", "orange");
  });

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
})();
