const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
const req = new XMLHttpRequest();

let values = [];

let xScale;
let yScale;

let width = 800;
let height = 600;
let padding = 40;

const svg = d3.select("svg");
const tooltip = d3.select("#tooltip");

const drawCanvas = () => {
  svg.attr("width", width);
  svg.attr("height", height);
};

const generateScales = () => {
  xScale = d3
    .scaleLinear()
    .domain([
      d3.min(values, (d) => d["Year"] - 1),
      d3.max(values, (d) => d["Year"] + 1),
    ])
    .range([padding, width - padding]);

  yScale = d3
    .scaleTime()
    .domain([
      d3.min(values, (d) => new Date(d["Seconds"] * 1000)),
      d3.max(values, (d) => new Date(d["Seconds"] * 1000)),
    ])
    .range([padding, height - padding]);
};

const drawPoints = () => {
  svg
    .selectAll("circle")
    .data(values)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("r", "5")
    .attr("data-xvalue", (d) => d["Year"])
    .attr("data-yvalue", (d) => new Date(d["Seconds"] * 1000))
    .attr("cx", (d) => xScale(d["Year"]))
    .attr("cy", (d) => yScale(new Date(d["Seconds"] * 1000)))
    .attr("fill", (d) => (d["Doping"] != "" ? "orange" : "green"))
    .on("mouseover", function () {
      tooltip.transition().style("visibility", "visible");
      d3.select(this).text((d) => {
        if (d["Doping"] != "") {
          tooltip.text(
            `${d["Year"]} - ${d["Name"]} - ${d["Time"]} - ${d["Doping"]}`,
          );
        } else {
          tooltip.text(
            `${d["Year"]} - ${d["Name"]} - ${d["Time"]} - No Allegations`,
          );
        }
        tooltip.attr("data-year", d["Year"]);
      });
    })
    .on("mouseout", () => {
      tooltip.transition().style("visibility", "hidden");
    });
};

const generateAxes = () => {
  let xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  let yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${height - padding})`);

  svg
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding}, 0)`);
};

req.open("GET", url, true);
req.onload = () => {
  values = JSON.parse(req.responseText);
  console.log(values);
  drawCanvas();
  generateScales();
  drawPoints();
  generateAxes();
};
req.send();
