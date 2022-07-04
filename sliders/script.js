console.log("loaded temperature slider");

const secInterval = 300;

const padding = 20;
const width = 500;
const height = 25;

const tempGraphAttributes = {
    minValue: 0,
    minIdealValue: 21,
    maxIdealValue: 26,
    maxValue: 38,
    title: "Average Temperature",
    xAxisTitle: 'Temperature (\u2103)',
    id: 'temperature-slider'
}

const humGraphAttributes = {
    minValue: 0,
    minIdealValue: 30,
    maxIdealValue: 50,
    maxValue: 100,
    title: "Average Humidity",
    xAxisTitle: 'Relative Humidity (%)',
    id: 'humidity-slider'
}

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
        temp: 32,
        humidity: 28,
        light: 917, 
        uv: 0,
        time: 180
    }
];

// get summary values
const svg = d3.select('svg.sliders')
    .attr('width', 2 * width + padding);

const tempGroup = svg.append('g')
    .attr('id', 'temp-slider')
    .attr('class', 'slider')
    .attr('transform', `translate(5, 0)`);

const humGroup = svg.append('g')
    .attr('id', 'humidity-slider')
    .attr('class', 'slider')
    .attr('transform', `translate(${width + padding},0)`);

(async() => {
    const [avgTemp, avgHumidity] = await getSummaryData(data);
        
    drawSlider(tempGroup, tempGraphAttributes, avgTemp);
    drawSlider(humGroup, humGraphAttributes, avgHumidity);
})();

function drawSlider(group, attributes, avgValue) {
    const scale = d3.scaleLinear()
        .domain([attributes.minValue, attributes.maxValue])
        .range([0, width]);
    
    group.append('text')
        .attr('x', width/2)
        .attr('y', padding)
        .attr('class', 'title')
        .text(attributes.title);
    
    const sliderGroup = group.append('g')
        .attr("transform", `translate(0,${padding * 2})`)

    const idealRange = sliderGroup
        .append('g')
        .attr('id', 'ideal-range')
        .attr("transform", `translate(${scale(attributes.minIdealValue)},0)`)

    // the ideal range bar
    idealRange.append('rect')
        .attr('width', scale(attributes.maxIdealValue) - scale(attributes.minIdealValue))
        .attr('height', height)
        .attr('class', 'ideal-range');

    // the axis
    sliderGroup.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(scale))
        .append('text')
        .text(attributes.xAxisTitle)
        .attr('x', width/2)
        .attr('y', padding * 1.5);

    // the slider box
    sliderGroup.append("rect")
        .attr('x', 0)
        .attr('y', 0)
        .attr('rx', 5)
        .attr('ry', 5)
        .attr('width', width)
        .attr('height', height);

    // draw the pointer at avgTemp
    sliderGroup.append('path')
        .attr('d', d3.symbol().type(d3.symbolDiamond).size(300))
        .attr('class', 'pointer')
        .attr('transform', `translate(${scale(avgValue)}, ${height/2})`);
}

async function getSummaryData() {
    let avgTemp = 0;
    let avgHumidity = 0;

    const data = await getCsvDataForDate(new Date(2022, 6, 2));

    data.forEach((dataRow) => {
        avgTemp += dataRow.temp;
        avgHumidity += dataRow.humidity;
    });

    avgTemp = avgTemp / data.length;
    avgHumidity = avgHumidity / data.length;

    return [
        avgTemp,
        avgHumidity
    ];
}
