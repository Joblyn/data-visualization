const countyURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
const educationUrl =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

let countyData;
let educationData;

const canvas = d3.select("#canvas");
const tooltip = d3.select("#tooltip");

const drawMap = () => {
  canvas
    .selectAll("path")
    .data(countyData)
    .enter()
    .append("path")
    .attr("d", d3.geoPath())
    .attr("class", "county")
    .attr("fill", (d) => {
      const id = d["id"];
      const county = educationData.find((item) => item["fips"] === id);
      const percentage = county["bachelorsOrHigher"];
      if (percentage <= 15) {
        return "tomato";
      } else if (percentage <= 30) {
        return "Orange";
      } else if (percentage <= 45) {
        return "lightgreen";
      } else {
        return "limegreen";
      }
    })
    .attr("data-fips", (d) => d["id"])
    .attr("data-education", (d) => {
      const id = d["id"];
      const county = educationData.find((item) => item["fips"] === id);
      const percentage = county["bachelorsOrHigher"];
      return percentage;
    })
    .on("mouseover", function () {
      tooltip.transition().style("visibility", "visible");
      d3.select(this).text((d) => {
        const id = d["id"];
        const county = educationData.find((item) => item["fips"] === id);
        tooltip.text(
          `${county["fips"]} - ${county["area_name"]}, ${county["state"]}: ${county["bachelorsOrHigher"]}%`,
        );
        tooltip.attr("data-education", county["bachelorsOrHigher"]);
      });
    })
    .on("mouseout", () => {
      tooltip.transition().style("visibility", "hidden");
    });
};

d3.json(countyURL).then((data, error) => {
  if (error) {
    console.log(error);
  } else {
    countyData = topojson.feature(data, data.objects.counties).features;

    d3.json(educationUrl).then((data, error) => {
      if (error) {
        console.log(error);
      } else {
        educationData = data;
        drawMap();
      }
    });
  }
});
