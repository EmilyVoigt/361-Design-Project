console.log(" line graph script loaded");

const data = [
    {
        temp: 31,
        humidity: 29,
        light: 917,
        uv: 170,
        time: 0
    },
    {
        temp: 22,
        humidity: 29,
        light: 918,
        uv: 170,
        time: 60
    },
    {
        temp: 27,
        humidity: 29,
        light: 918,
        uv: 168,
        time: 120
    },
    {
        temp: 24,
        humidity: 29,
        light: 917,
        uv: 170,
        time: 200
    },
    {
        temp: 20,
        humidity: 29,
        light: 918,
        uv: 170,
        time: 600
    }
];
console.log(data); 
/*
(async () => {
    // get CSV data
    let csvData = await getCsvData();
}); */

// data = FileAttachment("./fancyLineGraph/fancyline.csv").csv({typed: true})

function LineChart(data, {
    x = ([x]) => x, // given d in data, returns the (temporal) x-value
    y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
    h = d => d.humidity,
    defined,
    curve = d3.curveLinear, // how to interpolate between our data points
    margin = {top: 20, right: 40, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    xType = d3.scaleLinear, // scale on x-axis 
    xDomain, // x-axis [min, max]
    xRange = d3.scaleTime().range([0, width]),
    yType = d3.scaleLinear, // the y-axis scale. Should be a date type, maybe UTC?
    yDomain, // y-axis [min, max]
    yRange = d3.scaleLinear().range([height, 0]),
    yFormat, // a format specifier string for the y-axis
    yLabel = "Temperature (°C)", 
    hType = d3.scaleLinear,
    hDomain,
    hRange = d3.scaleLinear().range([height, 0]),
    hFormat,
    hLabel = "% Humidity",
    color = "currentColor", // line color
    strokeLinecap = "round", 
    strokeLinejoin = "round",
    strokeWidth = 1.5, // line width
    strokeOpacity = 1, // opacity of line
  } = {}) {
    // map values and handle invalid entries 
    console.log("hello")
    const X = d3.map(data, x);
    const Y = d3.map(data, y);
    const H = d3.map(data, h);
    const I = d3.range(X.length);
    if (defined === undefined) defined = (d, i) => !isNaN(X[i]) && !isNaN(Y[i]);
    const D = d3.map(data, defined);
  
    // define x & y domains
    if (xDomain === undefined) xDomain = d3.extent(X);
    if (yDomain === undefined) yDomain = [0, d3.max(Y)];
    if (hDomain === undefined) hDomain = [0, 100];

  
    // define scales and axes
    const xScale = xType(xDomain, xRange);
    const yScale = yType(yDomain, yRange);
    const hScale = hType(hDomain, hRange);
    const xAxis = d3.axisBottom(xScale).ticks(width / 80).tickSizeOuter(0);
    const yAxis = d3.axisLeft(yScale).ticks(height / 60, yFormat);
    const hAxis = d3.axisRight(hScale).ticks(height / 40, hFormat);
  
    // generate a line from data
    const line = d3.line()
        .defined(i => D[i])
        .curve(curve)
        .x(i => xScale(X[i]))
        .y(i => yScale(Y[i]))
        .h(i => hScale(H[i]))
  
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
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", width - marginLeft - marginRight)
            .attr("stroke-opacity", 0.1))
        .call(g => g.append("text")
            .attr("x", -marginLeft)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text(yLabel));

    svg.append("g")
        .attr("transform", `translate(${marginRight},0)`)
        .call(hAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", width - marginLeft - marginRight)
            .attr("stroke-opacity", 0.1))
        .call(g => g.append("text")
            .attr("x", -marginRight)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text(hLabel));
  
  
    svg.append("path")
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", strokeWidth)
        .attr("stroke-linecap", strokeLinecap)
        .attr("stroke-linejoin", strokeLinejoin)
        .attr("stroke-opacity", strokeOpacity)
        .attr("d", line(I));
  
  }
LineChart(data, {
    x: d => d.time,
    y: d => d.temp,
    h: d => d.humidity,
    color: "red",
    yDomain: [0, 35]
  })
