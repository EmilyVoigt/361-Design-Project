console.log('loaded sunlight slider');

const width = 500;
const height = 500;
const padding = 100;
const timeInterval = 10; // time between sensor readings in minutes
const maxValue = 120; // minutes of sunlight for image to be fully filled

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

const group = d3.select('svg.sunlight-slider')
    .attr('width', width + padding)
    .attr('height', height + padding)
    .append('g')
    .attr('transform', `translate(5,5)`);

const minutesSunlight = getMinutesSunlight(data);

const scale = d3.scaleLinear()
    .domain([maxValue, 0])
    .range([0, height])

group.append('image')
    .attr('xlink:href', "sunlight-slider/sun-fill.png")
    .attr('width', width);

group.append('rect')
    .attr('width', width)
    .attr('height', (scale(minutesSunlight) > height) ? 0 : scale(minutesSunlight))
    .attr('fill', 'white');

group.append('image')
    .attr('xlink:href', "sunlight-slider/sun-outline.png")
    .attr('width', width);

group.append('g')
    .attr('transform', `translate(${width + padding/4},0)`)
    .call(d3.axisRight(scale))

function getMinutesSunlight(data) {
    let minutesSunlight = 0;
    data.forEach((dataRow) => {
        if (dataRow.uv > 1) {
            minutesSunlight += timeInterval;
        }
    });

    return minutesSunlight;
}
