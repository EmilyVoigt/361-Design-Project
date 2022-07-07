console.log('loaded sunlight slider');

const sunWidth = 350;
const sunHeight = 350;
const sunPadding = 20;
const outsideIdealValue = 90; // minutes of sunlight for image to be fully filled

const messages = [
    {
        threshold: 0,   // the number of minutes when this message will start to appear
        message: "You were low on time outdoors today. Try to get outside!"
    },
    {
        threshold: outsideIdealValue / 3,
        message: "You were almost halfway there. Keep it up! "
    },
    {
        threshold: outsideIdealValue / 2,
        message: "You almost made your goal! Great job!"
    },
    {
        threshold: outsideIdealValue,
        message: "Congratulations! You did it!"
    }
];

(async() => {
    const group = d3.select('svg.sunlight-slider')
        .attr('width', sunWidth + sunPadding*4)
        .attr('height', sunHeight + sunPadding*2)
        .append('g')
        .attr('transform', `translate(5,20)`);

    const minutesSunlight = await getMinutesSunlight();

    const scale = d3.scaleLinear()
        .domain([outsideIdealValue, 0])
        .range([0, sunHeight])

    // title
    group.append('text')
        .attr('x', sunWidth/2)
        .attr('y', sunPadding/8)
        .attr('class', 'title')
        .text('Minutes in the Sun Today');

    const sliderGroup = group.append('g')
        .attr('transform', `translate(0, ${sunPadding/4})`);

    // background filled image
    sliderGroup.append('image')
        .attr('xlink:href', "sunlight-slider/sun-fill.png")
        .attr('width', sunWidth);

    // white rect blocking some of the filled image
    sliderGroup.append('rect')
        .attr('width', sunWidth)
        .attr('height', (scale(minutesSunlight) < 0) ? 0 : scale(minutesSunlight))
        .attr('class', 'sun-fill');

    // the outline of the image
    sliderGroup.append('image')
        .attr('xlink:href', "sunlight-slider/sun-outline.png")
        .attr('width', sunWidth);

    // y-axis title
    sliderGroup.append('g')
        .attr('transform', `translate(${sunWidth + sunPadding/4},0)`)
        .call(d3.axisRight(scale))
        .append('text')
        .attr('transform', `translate(${sunPadding*2},${sunHeight/2})rotate(-90)`)
        .text('Minutes of Sunlight')
        .attr('class', 'title');

    // display message based on how much of the sun is filled
    let i = 0;
    let message = ""
    while (minutesSunlight > messages[i].threshold) {
        message = messages[i].message;
        i++;
    }

    document.querySelector('p#message').innerText = message;
})();

async function getMinutesSunlight() {
    let minutesSunlight = 0;

    const data = await getCsvDataForDate(dateToDisplay);

    data.forEach((dataRow) => {
        if (dataRow.uv > 1) {
            minutesSunlight += measurementInterval;
        }
    });

    return minutesSunlight;
}
