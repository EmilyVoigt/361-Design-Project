console.log('loaded sunlight slider');

const width = 500;
const height = 500;
const padding = 100;
const maxValue = 120; // minutes of sunlight for image to be fully filled

(async() => {
    const group = d3.select('svg.sunlight-slider')
    .attr('width', width + padding)
    .attr('height', height + padding)
    .append('g')
    .attr('transform', `translate(5,5)`);

    const minutesSunlight = await getMinutesSunlight();
    console.log('minutes sunlight', minutesSunlight)

    const scale = d3.scaleLinear()
        .domain([maxValue, 0])
        .range([0, height])

    // title
    group.append('text')
        .attr('x', width/2)
        .attr('y', padding/8)
        .attr('class', 'title')
        .text('Minutes in the Sun Today');

    const sliderGroup = group.append('g')
        .attr('transform', `translate(0, ${padding/4})`);

    // background filled image
    sliderGroup.append('image')
        .attr('xlink:href', "sunlight-slider/sun-fill.png")
        .attr('width', width);

    // white rect blocking some of the filled image
    sliderGroup.append('rect')
        .attr('width', width)
        .attr('height', (scale(minutesSunlight) < 0) ? 0 : scale(minutesSunlight))
        .attr('fill', 'white');

    // the outline of the image
    sliderGroup.append('image')
        .attr('xlink:href', "sunlight-slider/sun-outline.png")
        .attr('width', width);

    // y-axis title
    sliderGroup.append('g')
        .attr('transform', `translate(${width + padding/4},0)`)
        .call(d3.axisRight(scale))
        .append('text')
        .attr('transform', `translate(${padding/2},${height/2})rotate(-90)`)
        .text('Minutes of Sunlight')
        .attr('class', 'title')

})();

async function getMinutesSunlight() {
    let minutesSunlight = 0;

    const data = await getCsvDataForDate(new Date(2022, 6, 2));
    console.log(data);

    data.forEach((dataRow) => {
        if (dataRow.uv > 1) {
            minutesSunlight += measurementInterval;
        }
    });

    return minutesSunlight;
}
