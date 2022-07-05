// select svg tag
let margin = {top: 10, right: 30, bottom: 30, left: 60}
let w = 860 - margin.left - margin.right
let h = 500 - margin.top - margin.bottom

const svg = d3.select("svg")
            .attr("width", w + margin.left + margin.right)
            .attr("height", h + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                  `translate(${margin.left} , ${margin.top})`);

const container = svg
  .append("g")
  .attr("class", "graphContainer")
  .attr("transform", `translate(${margin.left}, ${ margin.top})`);

const selectTag = document.querySelector("select");
let curDay = classTimes[0];

selectTag.addEventListener("input", () => {
  curDay = classTimes[selectTag.value];
  console.log(curDay);
});

(async () => {
  let csvData = await getCsvData();

  const lightTimeData = () => {
    const finalData = [];
    csvData.forEach((point) => {
      finalData.push({ time: point.time, light: point.light });
    });
    return finalData;
  };

  const tempTimeData = () => {
    const finalData = [];
    csvData.forEach((point) => {
      finalData.push({ time: point.time, temp: point.temp });
    });
    return finalData;
  };

  const humidityTimeData = () => {
    const finalData = [];
    csvData.forEach((point) => {
      finalData.push({ time: point.time, humidity: point.humidity });
    });
    return finalData;
  };

  let x = d3
    .scaleTime()
    .domain(
      d3.extent(csvData, (d, i) => {
        return d.time;
      })
    ) //d3.extent returns [min,max] of input
    .range([0, w]);

  svg
    .append("g")
    .attr("class", "bottom-axis")
    .attr("transform", `translate(0, ${h})`)
    .call(d3.axisBottom(x))


  let y = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(csvData, (d, i) => {
        return d.light;
      }),
    ])
    .range([h, 0]);

  svg
    .append("g")
    .attr("class", "left-axis")
    .call(d3.axisLeft(y))


  //light path
  svg
    .append("path")
    .datum(lightTimeData) //input an array of light anf time here
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr(
      "d",
      d3
        .line()
        .x(function (d) {
          return x(d.time);
        })
        .y(function (d) {
          return y(d.light);
        })
    );

    //temp path
  svg
    .append("path")
    .datum(tempTimeData) //input an array of light anf time here
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 1.5)
    .attr(
      "d",
      d3
        .line()
        .x(function (d) {
          return x(d.time);
        })
        .y(function (d) {
          return y(d.temp);
        })
    );

        //temp path
  svg
  .append("path")
  .datum(humidityTimeData) //input an array of light anf time here
  .attr("fill", "none")
  .attr("stroke", "green")
  .attr("stroke-width", 1.5)
  .attr(
    "d",
    d3
      .line()
      .x(function (d) {
        return x(d.time);
      })
      .y(function (d) {
        return y(d.humidity);
      })
  );
})();

