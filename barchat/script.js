const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
const req = new XMLHttpRequest();

let data;
let values;

let heightScale;
let xScale;
let xAxisScale;
let yAxisScale;

const width = 800;
const height = 600;
const padding = 40;

const svg = d3.select("svg");

const drawCanvas = () => {
  svg.attr("width", width);
  svg.attr("height", height);
};

const generateScales = () => {
  heightScale = d3
    .scaleLinear()
    .domain([0, d3.max(values, (d) => d[1])])
    .range([0, height - 2 * padding]);

  xScale = d3
    .scaleLinear()
    .domain([0, values.length - 1])
    .range([padding, width - padding]);

  const dates = values.map((d) => new Date(d[0]));

  xAxisScale = d3
    .scaleTime()
    .domain([d3.min(dates), d3.max(dates)])
    .range([padding, width - padding]);

  yAxisScale = d3
    .scaleLinear()
    .domain([0, d3.max(values, (d) => d[1])])
    .range([height - padding, padding]);
};

const drawBars = () => {
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("visibility", "hidden")
    .style("width", "auto")
    .style("height", "auto");

  svg
    .selectAll("rect")
    .data(values)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("width", (width - 2 * padding) / values.length)
    .attr("data-date", (d) => d[0])
    .attr("data-gdp", (d) => d[1])
    .attr("height", (d) => heightScale(d[1]))
    .attr("x", (d, i) => xScale(i))
    .attr("y", (d) => height - padding - heightScale(d[1]))
    .on("mouseover", function () {
      tooltip.transition().style("visibility", "visible");
      d3.select(this).text((d) => {
        tooltip.text(d[0]);
        document.querySelector("#tooltip").setAttribute("data-date", d[0]);
        return d[0];
      });
    })
    .on("mouseout", () => {
      tooltip.transition().style("visibility", "hidden");
    });
};

const generateAxes = () => {
  let xAxis = d3.axisBottom(xAxisScale);
  let yAxis = d3.axisLeft(yAxisScale);

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
  data = JSON.parse(req.responseText);
  values = data.data;
  drawCanvas();
  generateScales();
  drawBars();
  generateAxes();
};
req.send();
