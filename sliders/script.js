console.log("loaded temperature slider");

const secInterval = 300;

const padding = 20;
const width = 500;
const height = 25;

const tempMinValue = 0;
const tempMinIdealValue = 21;
const tempMaxIdealValue = 26;
const tempMaxValue = 38;

const humMinValue = 0;
const humMinIdealValue = 30;
const humMaxIdealValue = 50;
const humMaxValue = 100;

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
const [avgTemp, avgHumidity, secSunlight] = getSummaryData(data);

const svg = d3.select('svg.sliders')
    .attr('width', 2 * width + padding);

const tempGroup = svg.append('g')
    .attr('id', 'temp-slider')
    .attr('transform', `translate(5, 0)`);

const humGroup = svg.append('g')
    .attr('id', 'humidity-slider')
    .attr('transform', `translate(${width + padding},0)`);

drawSlider(tempGroup, tempMinValue, tempMinIdealValue, tempMaxIdealValue, tempMaxValue, avgTemp);
drawSlider(humGroup, humMinValue, humMinIdealValue, humMaxIdealValue, humMaxValue, avgHumidity);

function drawSlider(group, minValue, minIdealValue, maxIdealValue, maxValue, avgValue) {
    const scale = d3.scaleLinear()
        .domain([minValue, maxValue])
        .range([0, width])

    group.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(scale))

    group.append("rect")
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', width)
        .attr('height', height)
        .attr('stroke', 'black')
        .attr('fill', 'white');

    const idealRange = group
        .append('g')
        .attr('id', 'ideal-range')
        .attr("transform", `translate(${scale(minIdealValue)},0)`)

    idealRange.append('rect')
        .attr('width', scale(maxIdealValue) - scale(minIdealValue))
        .attr('height', height)
        .attr('fill', 'green');

    // draw the pointer at avgTemp
    group.append('path')
        .attr('d', d3.symbol().type(d3.symbolDiamond).size(300))
        .attr('transform', `translate(${scale(avgValue)}, ${height/2})`)
}

function getSummaryData(data) {
    let avgTemp = 0;
    let avgHumidity = 0;
    let secSunlight = 0;

    data.forEach((dataRow) => {
        avgTemp += dataRow.temp;
        avgHumidity += dataRow.humidity;
        
        if (dataRow.uv > 1) {
            secSunlight += secInterval;
        }
    });

    avgTemp = avgTemp / data.length;
    avgHumidity = avgHumidity / data.length;

    return [
        avgTemp,
        avgHumidity,
        secSunlight
    ];
}
