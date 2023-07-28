const movieDataUrl =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";

let movieData;

const canvas = d3.select("#canvas");
const tooltip = d3.select("#tooltip");

const drawTreeMap = () => {
  const hierarchy = d3
    .hierarchy(movieData, (node) => node["children"])
    .sum((node) => node["value"])
    .sort((node1, node2) => {
      return node2["value"] - node1["value"];
    });

  const createTreeMap = d3.treemap().size([1000, 600]);

  createTreeMap(hierarchy);

  const movieTiles = hierarchy.leaves();

  const block = canvas
    .selectAll("g")
    .data(movieTiles)
    .enter()
    .append("g")
    .attr("transform", (movie) => `translate(${movie["x0"]}, ${movie["y0"]})`);
  block
    .append("rect")
    .attr("class", "tile")
    .attr("fill", (movie) => {
      let category = movie["data"]["category"];
      if (category === "Action") {
        return "orange";
      } else if (category === "Drama") {
        return "lightgreen";
      } else if (category === "Adventure") {
        return "coral";
      } else if (category === "Family") {
        return "lightblue";
      } else if (category === "Animation") {
        return "pink";
      } else if (category === "Comedy") {
        return "khaki";
      } else if (category === "Biography") {
        return "tan";
      }
    })
    .attr("data-name", (movie) => movie["data"]["name"])
    .attr("data-category", (movie) => movie["data"]["category"])
    .attr("data-value", (movie) => movie["data"]["value"])
    .attr("width", (movie) => movie["x1"] - movie["x0"])
    .attr("height", (movie) => movie["y1"] - movie["y0"])
    .on("mouseover", function () {
      tooltip.transition().style("visibility", "visible");
      d3.select(this).text((movie) => {
        let revenue = movie["data"]["value"]
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        tooltip.html(`\$${revenue} <hr /> ${movie["data"]["name"]}`);
        tooltip.attr("data-value", movie["data"]["value"]);
      });
    })
    .on("mouseout", () => {
      tooltip.transition().style("visibility", "hidden");
    });

  block
    .append("text")
    .text((movie) => movie["data"]["name"])
    .attr("x", 5)
    .attr("y", 20);
};

d3.json(movieDataUrl).then((data, error) => {
  if (error) {
    console.log(error);
  } else {
    movieData = data;
    drawTreeMap();
  }
});
