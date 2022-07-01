console.log("classroom points diagram loaded");

// width and height of image
const width = 500;
const height = 375;

// some other dimensions
const pointWidth = 25;
const descOffset = 8;

// coordinates of pointers to be scaled
const pointsToPlot=[
    {
        name: "windows",
        x: 0.2,
        y: 0.45,
        desc: "light is important for students"
    },
    {
        name: "chairs",
        x: 0.48,
        y: 0.85,
        desc: "posture is important for students"
    },
    {
        name: "humidity",
        x: 0.3,
        y: 0.6,
        desc: "humidity is important for students"
    },
    {
        name: "temperature",
        x: 0.7, 
        y: 0.45,
        desc: "temperature is important for students"
    },
    {
        name: "ceiling-vent",
        x: 0.45,
        y: 0.2,
        desc: "air quality"
    }
];

const svg = d3.select("svg.classroom-points");
svg.attr("width", width);
svg.attr("height", height);

// groups for each of the points
let points = svg.selectAll("g")
    .data(pointsToPlot)
    .enter()
    .append("g")
    .attr("class", (data) => data.name)
    .attr("transform", (data) => `translate(${data.x * width},${data.y * height})`)

// adding points
points
    .append("image")
    .attr("id", (data) => data.name)
    .attr("xlink:href", "classroom-points/pointer.png")
    .attr("width", pointWidth)
    .attr("x", pointWidth * -1) // to shift the pointer to the left
    .on("mouseenter", (event) => {
        const data = event.target.__data__;
        div
            .html(data.desc)
            .style("opacity", 1)
            .style("left", `${data.x * width + descOffset}px`)		
            .style("top", `${data.y * height + descOffset}px`);
    })
    .on("mouseout", (event) => {
        div.style("opacity", 0);
    });

// Define the div for the tooltip
var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);
    