//save width and height for easy access later on
const h = 700; //svg height
const w = 700; //svg width
const r = h / 2; //svg radius
const ticks = [40, 400, 4000, 14000]; // one tick per lux

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
  return { start: startAngle, end: endAngle };
};

const svg = d3.select("svg");
svg.attr("width", w);
svg.attr("height", h);

const graphBase = svg.append("g").attr("class", "graphBase"); //radial graph lines group
const hoursGroup = svg.append("g").attr("class", "hoursGroup"); //hours group

//now, we want to map our data values to radial dist from center of chart
//use linear scale
//our svg is 800 * 800, so lets have our max point radius be 350 (with 50 px of extra space in case)

//FUNCTIONS
// const radialDist = d3
//   .scaleLinear()
//   .domain([0, 14000])
//   .range([0, r - 50]); //set max range to radius - 50

let radialDist = d3
  .scaleLog()
  .domain([1, 20000])
  .range([0, r - 50]);
  //switch our scale to a log scale

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
    .attr("stroke", "gray");

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
    .attr("stroke", "gray")
    .attr("fill", "none")
    .attr("r", radialDist(tick)); //create the circle using our radial scale

  graphBase
    .append("text")
    .attr("class", "tickLabel")
    .attr("x", r)
    .attr("y", r - radialDist(tick) - 10) // r - dist because we need biggest on outside
    .text(`${tick}`);
});

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

//const selectTag = document.querySelector("select");
//select tag is removed, as it made for confusing UX
// selectTag.addEventListener("input", () => {
//   curClassTime = classTimes[selectTag.value];
//   d3.selectAll(".classArc").remove(); //remove prev. class pies
//   drawClassPie(curClassTime.morning); //add new class pies
//   drawClassPie(curClassTime.afternoon);
// });

//get point coords using average data for points
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
  const maxPoints = 24 * 60;
  dataSet.forEach((point) => {
    const pointTimeFract = point.time.getHours() + point.time.getMinutes() / 60;
    let angle = -(((2 * Math.PI) / hours.length) * pointTimeFract) - Math.PI;
    let pxLength = radialDist(point.light);
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
    // .startAngle(0)
  )
  .attr("fill", "grey")
  .attr("stroke", "none");

//create a div that we can use for our tooltip

var tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);




//data collection and processing is async
(async () => {
  // get CSV data
  const dataDate = new Date(2022, 06, 05);
  let csvData = await getCsvDataForDate(dataDate);
  let d = dataHourAvg(csvData);
  let coordinates = filterInvalidValues(getPointCoords(d));
    
  let coordinates2 = getLinePointCoords(csvData);
  console.log(coordinates)

  // let extents = d3.extent(csvData, d =>{
  //   return d.light
  // })

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
    .selectAll("circle")
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
      // d3.select(this).transition().duration("50").attr("opacity", "0.3");
      let toolTipNum = Math.floor(d.value);
      tooltip
        .html("average light level: " + toolTipNum.toString() + " lux")
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 15 + "px");

      tooltip.transition().duration("50").style("opacity", "1");
    })
    .on("mouseout", function (d, i) {
      // d3.select(this).transition().duration("50").attr("opacity", "1");
      tooltip.transition().duration("50").style("opacity", "0");
    });
})();
