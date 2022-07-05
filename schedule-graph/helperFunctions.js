// mostly getters
const getLightTimeData = (data) => {
  const finalData = [];
  data.forEach((point) => {
    finalData.push({ time: point.time, value: point.light });
  });
  return finalData;
};

const getTempTimeData = (data) => {
  const finalData = [];
  data.forEach((point) => {
    finalData.push({ time: point.time, value: point.temp });
  });
  return finalData;
};

const getHumidityTimeData = (data) => {
  const finalData = [];
  data.forEach((point) => {
    finalData.push({ time: point.time, value: point.humidity });
  });
  return finalData;
};

  //light path
//   svg
//     .append("path")
//     .datum(lightTimeData) //input an array of light anf time here
//     .attr("fill", "none")
//     .attr("stroke", "steelblue")
//     .attr("stroke-width", 1.5)
//     .attr(
//       "d",
//       d3
//         .line()
//         .x(function (d) {
//           return x(d.time);
//         })
//         .y(function (d) {
//           return y(d.light);
//         })
//     );

//   //temp path
//   svg
//     .append("path")
//     .datum(tempTimeData) //input an array of light anf time here
//     .attr("fill", "none")
//     .attr("stroke", "red")
//     .attr("stroke-width", 1.5)
//     .attr(
//       "d",
//       d3
//         .line()
//         .x(function (d) {
//           return x(d.time);
//         })
//         .y(function (d) {
//           return y(d.temp);
//         })
//     );

//   //humidity path
//   svg
//     .append("path")
//     .datum(humidityTimeData) //input an array of light anf time here
//     .attr("fill", "none")
//     .attr("stroke", "green")
//     .attr("stroke-width", 1.5)
//     .attr(
//       "d",
//       d3
//         .line()
//         .x(function (d) {
//           return x(d.time);
//         })
//         .y(function (d) {
//           return y(d.humidity);
//         })
//     );