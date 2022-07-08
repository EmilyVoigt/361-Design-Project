console.log("loaded temperature slider");

const secInterval = 300;

const slidersPadding = 30;
const slidersWidth = 500;
const slidersHeight = 25;

const tempGraphAttributes = {
    minValue: 0,
    minIdealValue: 21,
    maxIdealValue: 25,
    maxValue: 38,
    title: "Average Temperature",
    xAxisTitle: 'Temperature (°C)',
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

// get summary values
const svg = d3.select('svg.sliders')
    .attr('width', slidersWidth + slidersPadding)
    .attr('height', slidersHeight * 15);

const tempGroup = svg.append('g')
    .attr('id', 'temp-slider')
    .attr('class', 'slider')
    .attr('transform', `translate(5, 0)`);

const humGroup = svg.append('g')
    .attr('id', 'humidity-slider')
    .attr('class', 'slider')
    .attr('transform', `translate(5,${slidersHeight + slidersPadding * 5})`);

(async() => {
    const [avgTemp, avgHumidity] = await getSummaryData();
        
    drawSlider('temperature', tempGroup, tempGraphAttributes, avgTemp);
    drawSlider('humidity', humGroup, humGraphAttributes, avgHumidity);
})();

function drawSlider(name, group, attributes, avgValue) {
    const scale = d3.scaleLinear()
        .domain([attributes.minValue, attributes.maxValue])
        .range([0, slidersWidth]);
    
    group.append('text')
        .attr('x', slidersWidth/2)
        .attr('y', slidersPadding)
        .attr('class', 'title')
        .text(attributes.title);
    
    const sliderGroup = group.append('g')
        .attr("transform", `translate(0,${slidersPadding * 2})`)

    const idealRange = sliderGroup
        .append('g')
        .attr('id', `ideal-range-${name}`)
        .attr("transform", `translate(${scale(attributes.minIdealValue)},0)`)

    // the ideal range bar
    idealRange.append('rect')
        .attr('width', scale(attributes.maxIdealValue) - scale(attributes.minIdealValue))
        .attr('height', slidersHeight)
        .attr('class', `ideal-range-${name}`);

    // the bottom axis
    sliderGroup.append('g')
        .attr('transform', `translate(0, ${slidersHeight})`)
        .call(d3.axisBottom(scale))
        .append('text')
        .text(attributes.xAxisTitle)
        .attr('x', slidersWidth/2)
        .attr('y', slidersPadding * 1.5);

    // the slider box
    sliderGroup.append("rect")
        .attr('x', 0)
        .attr('y', 0)
        .attr('rx', 5)
        .attr('ry', 5)
        .attr('width', slidersWidth)
        .attr('height', slidersHeight);

    // draw the pointer at avgTemp
    sliderGroup.append('path')
        .attr('d', d3.symbol().type(d3.symbolDiamond).size(300))
        .attr('class', 'pointer')
        .attr('transform', `translate(${scale(avgValue)}, ${slidersHeight/2})`);
}

async function getSummaryData() {
    let avgTemp = 0;
    let avgHumidity = 0;

    const data = await getCsvDataForDate(dateToDisplay);

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
