/*const data = [
    {
        temp: 31,
        humidity: 5,
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
        humidity: 10,
        light: 918,
        uv: 168,
        time: 120
    },
    {
        temp: 24,
        humidity: 29,
        light: 917,
        uv: 170,
        time: 180
    },
    {
        temp: 20,
        humidity: 40,
        light: 918,
        uv: 170,
        time: 240
    }
];
console.log(data); 
*/

(async () => {
    // get CSV data
    const data = await getCsvData();
    console.log(data);
  
    // set the dimensions and margins of the graph
    var margin = {top: 20, right: 40, bottom: 40, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // set the ranges
    var x = d3.scaleTime().range([0, width]);
    var temperature = d3.scaleLinear().range([height, 0]);
    var humidity = d3.scaleLinear().range([height, 0]);

    // define the 1st line
    var tempLine = d3.line()
        .x(function(d) { return x(d.time); })
        .y(function(d) { return temperature(d.temp); });

    // define the 2nd line
    var humidLine = d3.line()
        .x(function(d) { return x(d.time); })
        .y(function(d) { return humidity(d.humidity); });

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    const svg = d3.select("svg.dual-plot")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // format the data
    /*
    data.forEach(function(d) {
        d.time = +d.time;
        d.temp = +d.temp;
        d.humidity = +d.humidity;
    });
    */

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.time; }));
    temperature.domain([0, d3.max(data, function(d) {return Math.max(d.temp);})]);
    humidity.domain([0, 100]);

    // Add the tempLine path.
    svg.append("path")
        .data(data)
        .attr("class", "line")
        .style("stroke", "red")
        .attr("d", tempLine);

    // Add the humidLine path.
    svg.append("path")
        .data(data)
        .attr("class", "line")
        .style("stroke", "green")
        .attr("d", humidLine);

    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add the temperature axis
    svg.append("g")
        .attr("class", "axisRed")
        .call(d3.axisLeft(temperature));
        
    // Add the humidity axis
    svg.append("g")
        .attr("class", "axisGreen")
        .attr("transform", "translate( " + width + ", 0 )")
        .call(d3.axisRight(humidity));

    // Add the UV blocks
    var uvShiftX = 10;
    var uvWidth = 20;
    for (let i = 0; i < 10; i++) {
        uvShiftX += 50;
        svg.append("rect")
                .attr('x', uvShiftX)
                .attr('y', 0)
                .attr('width', uvWidth)
                .style('fill', "grey")
                .style('fill-opacity', 0.3)
                .attr('height', height);
    }
})();