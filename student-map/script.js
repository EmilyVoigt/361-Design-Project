console.log("student map diagram loaded");

// width and height of image
const width = 1200;
const height = 480;

// some other dimensions
const pointWidth = 40;
const descOffset = 8;

// coordinates of pointers to be scaled
const pointsToPlot=[
    {
        name: "home-1",
        x: 0.15,
        y: 0.4,
        desc: "The student wakes up, gets ready, and leaves their house early enough to make it to their morning class. They listen to some music, and walk quickly on their way to school."
    },
    {
        name: "e5-1",
        x: 0.26,
        y: 0.58,
        desc: "By 8:30AM, they take a seat for their morning lectures, which all take place in the same room. There are 10 minute breaks in between each lecture, which they use to stretch their legs, or catch up on work."
    },
    {
        name: "picnic",
        x: 0.35,
        y: 0.23,
        desc: "At 12:30PM, the student heads to the picnic tables outside the DP Library to eat lunch with friends. This is the first time they have been outside since entering E5."
    },
    {
        name: "e5-2",
        x: 0.5, 
        y: 0.52,
        desc: "Afternoon classes resume at 1:30PM. The student returns to their seat in the same classroom for the afternoon."
    },
    {
        name: "dc",
        x: 0.62,
        y: 0.34,
        desc: "At 4:00PM, the student heads to the DC Library to study. It’s busy, and difficult to find a seat, especially near a window. The individual study desks are quiet, and once the student finds a desk, they begin their work."
    },
    {
        name: "pac",
        x: 0.75,
        y: 0.75,
        desc: "At 5:30PM, the student attends a fitness class at PAC. The atmosphere here is brighter, louder, and more energetic. There is music playing in the fitness class, and the activity feels good after sitting down for so long."
    },
    {
        name: "home-2",
        x: 0.94,
        y: 0.32,
        desc: "At 7:00PM, the student returns home. The walk home is slower and calmer than the walk to school, and the student is less rushed, enjoying the time outside."
    }
];

const svg = d3.select("svg.student-map");
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
    .attr('class', 'pointer')
    .attr("xlink:href", "classroom-points/pointer.png")
    .attr("width", pointWidth)
    .attr("x", pointWidth * -1) // to shift the pointer to the left
    .on("mouseenter", (event) => {
        const data = event.target.__data__;
        div
            .html(data.desc)
            .style("opacity", 1)
            .style("left", `${(event.pageX - event.offsetX) + data.x * width + descOffset}px`)		
            .style("top", `${data.y * height - 4 * descOffset}px`);
    })
    .on("mouseout", (event) => {
        div.style("opacity", 0);
    });

// Define the div for the tooltip
var div = d3.select("div.student-map-body").append("div")	
    .attr("class", "tooltip")
    .style("opacity", 0);
