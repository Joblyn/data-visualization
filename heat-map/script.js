const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
const req = new XMLHttpRequest();

let baseTemp;
let values;

let xScale;
let yScale;

let minYear;
let maxYear;
let numberOfYears = maxYear - minYear;

const width = 1200;
const height = 600;
const padding = 60;

const canvas = d3.select("#canvas");
canvas.attr("width", width);
canvas.attr("height", height);

const tooltip = d3.select("#tooltip");

const generateScales = () => {
  minYear = d3.min(values, (d) => d["year"]);
  maxYear = d3.max(values, (d) => d["year"]);

  xScale = d3
    .scaleLinear()
    .domain([minYear, maxYear + 1])
    .range([padding, width - padding]);

  yScale = d3
    .scaleTime()
    .domain([new Date(0, 0, 0, 0, 0, 0, 0), new Date(0, 12, 0, 0, 0, 0, 0)])
    .range([padding, height - padding]);
};

const drawCells = () => {
  canvas
    .selectAll("rect")
    .data(values)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("fill", (d) => {
      variance = d["variance"];
      if (variance <= -2) {
        return "SteelBlue";
      } else if (variance <= 0) {
        return "LightSteelBlue";
      } else if (variance <= 1) {
        return "Orange";
      } else {
        return "Crimson";
      }
    })
    .attr("data-year", (d) => d["year"])
    .attr("data-month", (d) => d["month"] - 1)
    .attr("data-temp", (d) => baseTemp + d["variance"])
    .attr("height", (height - 2 * padding) / 12)
    .attr("y", (d) => yScale(new Date(0, d["month"] - 1, 0, 0, 0, 0, 0)))
    .attr("width", () => {
      numberOfYears = maxYear - minYear;
      return (width - 2 * padding) / numberOfYears;
    })
    .attr("x", (d) => xScale(d["year"]))
    .on("mouseover", function () {
      tooltip.transition().style("visibility", "visible");
      let monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      d3.select(this).text((d) => {
        tooltip.text(
          `${d["year"]} ${monthNames[d["month"] - 1]} - ${
            baseTemp + d["variance"]
          } (${d["variance"]})`,
        );
        tooltip.attr("data-year", d["year"]);
      });
    })
    .on("mouseout", () => {
      tooltip.transition().style("visibility", "hidden");
    });
};

const drawAxes = () => {
  let xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

  let yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%B"));

  canvas
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${height - padding})`);

  canvas
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding}, 0)`);
};

req.open("GET", url, true);
req.onload = () => {
  let object = JSON.parse(req.responseText);
  baseTemp = object["baseTemperature"];
  values = object["monthlyVariance"];
  generateScales();
  drawCells();
  drawAxes();
};
req.send();
