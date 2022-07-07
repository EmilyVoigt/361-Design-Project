// get csv containing time and UV pairs only 
const getUvTimeData = (data) => {
    const finalData = [];
    data.forEach((point) => {
      finalData.push({ time: point.time, uv: point.uv });
    });
    return finalData;
};

// create an array of start and end times when UV values were > 1
const getTimesOutside = (data) => {
    let outsideTimeBlocks = [];
    let uvStartTime = null;
    data.forEach((point) => {
        // if we are not in an outside block, then check if one has started
        if (uvStartTime == null && point.uv > 1) {
            uvStartTime = point.time;
        }
        // if we are in an outside block, then check if it has ended)
        if (uvStartTime != null && point.uv <= 1) {
            // add block to the array
            outsideTimeBlocks.push({
                start: uvStartTime,
                end: point.time
            });
            uvStartTime = null;
        }
    });

    return outsideTimeBlocks;
};

(async () => {
    // get data!! 
    const data = await getCsvData()
    const uvTimeData = getUvTimeData(data);
    const outsideTimeBlocks = getTimesOutside(uvTimeData);

    // set the dimensions and margins of the graph
    var margin = {top: 30, right: 50, bottom: 40, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // set the ranges
    var x = d3.scaleTime().range([0, width]);
    var temperature = d3.scaleLinear().range([height, 0]);
    var humidity = d3.scaleLinear().range([height, 0]);

    // define the temperature line
    var tempLine = d3.line()
        .x(function(d) { return x(d.time); })
        .y(function(d) { return temperature(d.temp); });

    // define the humidity line
    var humidLine = d3.line()
        .x(function(d) { return x(d.time); })
        .y(function(d) { return humidity(d.humidity); });

    // append the svg object to the body of the web page
    const svg = d3.select("svg.dual-plot")
        .attr("width", width + margin.left + margin.right)     // moves the 'group' element to the top left margin
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Scale the range of our data
    x.domain(d3.extent(data, function(d) { return d.time; }));
    temperature.domain([0, 40]);
    humidity.domain([0, 100]);

    // Add the tempLine path
    svg.append("path")
        .data([data])
        .attr("class", "templine")
        .attr("d", tempLine);

    // Add the humidLine path
    svg.append("path")
        .data([data])
        .attr("class", "humidline")
        .attr("d", humidLine);

    // Add the x axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
        

    // Add the temperature axis
    svg.append("g")
        .attr("class", "axisRed")
        .call(d3.axisLeft(temperature))
        .call(g => g.append("text")
        .attr("x", -50)
        .attr("y", -10)
        .attr("fill", "black")
        .attr("text-anchor", "start")
        .text("Temperature (°C)"));

    // Add the humidity axis
    svg.append("g")
        .attr("class", "axisGreen")
        .attr("transform", "translate( " + width + ", 0 )")
        .call(d3.axisRight(humidity))
        .call(g => g.append("text")
        .attr("x", -10)
        .attr("y", -10)
        .attr("fill", "black")
        .attr("text-anchor", "start")
        .text("% Humidity"));

    // Add the UV blocks
    svg.selectAll('rect')
        .data(outsideTimeBlocks)
        .enter()
        .append('rect')
        .attr('x', (data) => x(data.start))
        .attr('width', (data) => x(data.end) - x(data.start))
        .attr('height', height)
        .attr('class', 'outside-blocks');
})();