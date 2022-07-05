console.log(" line graph script loaded");
// import {LineChart} from "@d3/line-chart";
// LineChart = require("d3");

const data = [
    {
        temp: 31,
        humidity: 29,
        light: 917,
        uv: 170,
        time: 0
    },
    {
        temp: 31,
        humidity: 29,
        light: 918,
        uv: 170,
        time: 60
    },
    {
        temp: 32,
        humidity: 29,
        light: 918,
        uv: 168,
        time: 120
    },
    {
        temp: 31,
        humidity: 29,
        light: 917,
        uv: 170,
        time: 0
    },
    {
        temp: 31,
        humidity: 29,
        light: 918,
        uv: 170,
        time: 60
    }
];
console.log(data);


/*chart = LineChart(data, {
    x: d => d.time,
    y: d => d.temp,
    yLabel: "↑ Daily close ($)",
    width,
    height: 500,
    color: "steelblue"
  })
  */

// data = FileAttachment("./fancyLineGraph/fancyline.csv").csv({typed: true})

function LineChart(data, {
    x = d => d.time,
    y = d => d.temp,
    h = d => d.humidity,
    defined,
    curve = d3.curveLinear, // how to interpolate between our data points
    marginTop = 20, 
    marginRight = 20, 
    marginBottom = 40, 
    marginLeft = 40, 
    width = 600,
    height = 500, 
    xType = d3.scaleLinear, // scale on x-axis 
    xDomain, // x-axis [min, max]
    xRange = [marginLeft, width - marginRight], // [left, right]
    yType = d3.scaleLinear, // the y-axis scale. Should be a date type, maybe UTC?
    yDomain, // y-axis [min, max]
    yRange = [height - marginBottom, marginTop], // [bottom, top]
    yFormat, // a format specifier string for the y-axis
    yLabel = "Temperature (Degrees Celsius)", 
    hLabel = "% Humidity",
    color = "blue", // line color
    strokeLinecap = "round", 
    strokeLinejoin = "round",
    strokeWidth = 1.5, // line width
    strokeOpacity = 1, // opacity of line
  } = {}) {
    // map values and handle invalid entries 
    const X = d3.map(data, x);
    const Y = d3.map(data, y);
    const H = d3.map(data, h);
    const I = d3.range(X.length);
    if (defined === undefined) defined = (d, i) => !isNaN(X[i]) && !isNaN(Y[i]) && !isNaN(H[i]);
    const D = d3.map(data, defined);
  
    // define x & y domains
    if (xDomain === undefined) xDomain = d3.extent(X);
    if (yDomain === undefined) yDomain = [0, d3.max(Y)];
  
    // define scales and axes
    const xScale = xType(xDomain, xRange);
    const yScale = yType(yDomain, yRange);
    const hScale = yType(0, 100);
    const xAxis = d3.axisBottom(xScale).ticks(width / 80).tickSizeOuter(0);
    const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);
    const hAxis = d3.axisRight(hScale).ticks(height / 40, yFormat);
  
    // generate a line from data
    const line = d3.line()
        .defined(i => D[i])
        .curve(curve)
        .x(i => xScale(X[i]))
        .y(i => yScale(Y[i]))
        .h(i => hScale(H[i]));
  
    const svg = d3.select("svg.line-plot")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
  
    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(xAxis);
  
    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(yAxis)
        .call(hAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", width - marginLeft - marginRight)
            .attr("stroke-opacity", 0.1))
        .call(g => g.append("text")
            .attr("x", -marginLeft)
            .attr("y", 10)
            .attr("fill", "blue")
            .attr("text-anchor", "start")
            .text(yLabel));
  
    svg.append("path")
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", strokeWidth)
        .attr("stroke-linecap", strokeLinecap)
        .attr("stroke-linejoin", strokeLinejoin)
        .attr("stroke-opacity", strokeOpacity)
        .attr("d", line(I));
  
  }

// d3.select("svg.line-plot").append(LineChart(data))