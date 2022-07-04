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
        y: 0.4,
        desc: "Direct sunlight exposure is necessary for the synthesis of vitamin D. "
            + "The winter, when people generally receive fewer hours of sunlight exposure, "
            + "is associated with increased depressive symptoms [3]."
    },
    {
        name: "chairs",
        x: 0.55,
        y: 0.65,
        desc: "The chairs in a classroom and the time spent sitting can contribute to lower back "
            + "pain and postural problems and diminish a student''s engagement [8]. Long periods "
            + "of immobility are associated with poor health outcomes, and increasing physical "
            + "activity promotes physical and mental wellness [9]."
    },
    {
        name: "humidity",
        x: 0.3,
        y: 0.6,
        desc: "Relative humidity affects students'' learning performance, especially at "
            + "humidities below the ideal 40% [4]. High humidity can also increase allergens "
            + "and irritants in the environment, leading to a greater incidence of respiratory "
            + "problems [7]."
    },
    {
        name: "temperature",
        x: 0.7, 
        y: 0.45,
        desc: "A temperature of 24C is recommended for student learning environments [4]. "
            + "Every degree celsius increase above 25C is associated with an average of 2% "
            + "decrease in performance [5]. Symptoms of mental health disorders are also "
            + "exacerbated by high indoor temperatures [6]."
    },
    {
        name: "light",
        x: 0.55,
        y: 0.12,
        desc: "Daytime light exposure regulates our times of alertness and fatigue [1]. Brighter "
            + "light can promote alertness and vitality during the day, but experiencing too much "
            + "light from bright electric sources is less pleasant and may delay sleep [2]."
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
            .style("top", `${data.y * height - 4 * descOffset}px`);
    })
    .on("mouseout", (event) => {
        div.style("opacity", 0);
    });

// Define the div for the tooltip
var div = d3.select("body").append("div")	
    .attr("class", "tooltip")
    .style("opacity", 0);
    