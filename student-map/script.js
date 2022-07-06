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
        desc: "The student leaves their house to walk over to campus in the morning. They listen to "
            + "music and have to walk quickly in order to make it in time."
    },
    {
        name: "e5-1",
        x: 0.26,
        y: 0.58,
        desc: "The morning classes of the day begin in E5 at 8:30 am. The student stays in one classroom "
            + "for each of lectures, with ten minute breaks in between to quickly stretch their legs or catch up on work."
    },
    {
        name: "picnic",
        x: 0.35,
        y: 0.23,
        desc: "At 12:30 the student goes outside to the DP picnic tables for lunch. This is the first time "
            + "they have been outside since entering E5, and they now eat and do some assignment questions over lunch."
    },
    {
        name: "e5-2",
        x: 0.5, 
        y: 0.52,
        desc: "Afternoon classes resume in E5 at 1:30."
    },
    {
        name: "dc",
        x: 0.62,
        y: 0.34,
        desc: "The student heads to DC library to study. It is busy and hard to find a seat, especially "
            + "one near a window. These individual study desks are quiet."
    },
    {
        name: "pac",
        x: 0.75,
        y: 0.75,
        desc: "The student attends a fitness class at PAC after studying. The atmosphere here is louder and "
            + "more energetic, with brighter lights and music. Activity feels especially good after the hours "
            + "of sitting in class and studying."
    },
    {
        name: "home-2",
        x: 0.94,
        y: 0.32,
        desc: "The student finally returns home, again making the 10-minute walk from campus. "
            + "They are less rushed than on the morning walk."
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
