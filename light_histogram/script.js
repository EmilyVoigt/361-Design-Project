import * as Plot from "@observablehq/plot";
console.log("light histogram loaded");

data = FileAttachment("inside_house.csv").csv({typed: true})

Plot.plot({
    y: {
      grid: true
    },
    color: {
      legend: true
    },
    marks: [
      Plot.rectY(data, Plot.binX({y: "temp"}, {x: "light"})),
      Plot.ruleY([0])
    ]
  })