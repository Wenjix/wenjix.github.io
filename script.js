// dimension settings for circular bar chart
const width = 1080;
const height = 1080;
const innerRadius = 180;
const outerRadius = Math.min(width, height) / 2;

// svg object
const svgCircular = d3.select("#circularBarChart")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", `translate(${width / 2},${height / 2})`);

// load data
d3.csv("data/dish_mentions_sorted.csv").then(function(data) {

  // setup scales
  const x = d3.scaleBand()
    .range([0, 2 * Math.PI])
    .align(0)
    .domain(data.map(d => d.Dish));

  const y = d3.scaleRadial()
    .range([innerRadius, outerRadius])
    .domain([0, d3.max(data, d => +d.Count)]);

  // add tooltip
  const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  function showTooltip(event, d) {
    tooltip.transition().duration(200).style("opacity", .9);
    tooltip.html(`Dish: ${d.Dish}<br>Count: ${d.Count}`)
      .style("left", (event.pageX) + "px")
      .style("top", (event.pageY - 28) + "px");
  }

  function hideTooltip() {
    tooltip.transition().duration(500).style("opacity", 0);
  }

  // circular bars
  const bars = svgCircular.append("g")
    .selectAll("path")
    .data(data)
    .join("path")
    .attr("fill", "#69b3a2")
    .attr("d", d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(d => y(d.Count))
      .startAngle(d => x(d.Dish))
      .endAngle(d => x(d.Dish) + x.bandwidth())
      .padAngle(0.01)
      .padRadius(innerRadius))
    .on("mouseover", showTooltip)
    .on("mouseout", hideTooltip);

  // labels
  svgCircular.append("g")
    .selectAll("g")
    .data(data)
    .join("g")
    .attr("text-anchor", function(d) { return (x(d.Dish) + x.bandwidth() / 2) < Math.PI ? "end" : "start"; })
    .attr("transform", function(d) { return `rotate(${(x(d.Dish) + x.bandwidth() / 2) * 180 / Math.PI - 90})translate(${y(d.Count) + 10},0)`; })
    .append("text")
    .text(function(d){ return(d.Dish); })
    .attr("transform", function(d) { return (x(d.Dish) + x.bandwidth() / 2) < Math.PI ? "rotate(180)" : "rotate(0)"; })
    .style("font-size", "11px")
    .attr("alignment-baseline", "middle");

  // add text inside the circular bar chart
  const centralText = svgCircular.append("text")
    .attr("text-anchor", "middle")
    .attr("font-size", "11px")
    .attr("font-weight", "bold")
    .text("Here are dishes mentioned in Yelp reviews of mostly Chinese restaurants.");

  // animated chart
  function updateChart() {
    // update text
    centralText.text("Look at how they really skew towards certain dishes. This seems important.");

    // update bars
    bars.transition()
      .duration(2000)
      .attr("fill", (d, i) => i < 10 ? "red" : "#69b3a2");
  }


  function updateChart2() {
    // update text
    centralText.text("Have we oversimplified restaurant reviews? Scroll down and find out.");

    // update bars
    bars.transition()
      .duration(2400)
      .attr("fill", (d, i) => {
        if (i < 10) return "red";
        else if (i < 20) return "orange";
        else return "grey";
      });
  }

  // animation delay
  setTimeout(updateChart, 4000);
  setTimeout(updateChart2, 8400);
});

// cleveland dot plot
function createClevelandDotPlot(data, dish) {
  const svg = d3.select("#clevelandDotPlot");
  const margin = { top: 40, right: 250, bottom: 120, left: 250 };
  const width = +svg.attr('width') - margin.left - margin.right;
  const height = +svg.attr('height') - margin.top - margin.bottom;

  const x = d3.scaleLinear()
    .domain([1, 5])
    .range([0, width]);

  const y = d3.scaleBand()
    .domain(data.map(d => d.Restaurant_Name))
    .range([0, height])
    .padding(1);

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  g.append("g")
    .call(d3.axisLeft(y).tickSize(0).tickPadding(10));

  g.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).tickValues(d3.range(1, 5.5, 0.5)).tickFormat(d3.format(".1f")));

// create tooltip for mouseover
  const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  function showTooltip(event, d) {
    tooltip.transition().duration(200).style("opacity", .9);
    tooltip.html(`Restaurant: ${d.Restaurant_Name}<br>Average Dish Rating: ${d.Average_Rating}<br>Overall Rating: ${d.Overall_Rating}<br>Dish Reviews: ${d.Dish_Review_Count}<br>Total Reviews: ${d.Total_Review_Count}`)
      .style("left", (event.pageX + 5) + "px")
      .style("top", (event.pageY - 28) + "px");
  }

  function hideTooltip() {
    tooltip.transition().duration(500).style("opacity", 0);
  }

  g.selectAll(".dot1")
    .data(data)
    .enter().append("circle")
    .attr("class", "dot1")
    .attr("cx", d => x(d.Average_Rating))
    .attr("cy", d => y(d.Restaurant_Name))
    .attr("r", 6)
    .style("fill", "#69b3a2")
    .on("mouseover", showTooltip)
    .on("mouseout", hideTooltip);

  g.selectAll(".dot2")
    .data(data)
    .enter().append("circle")
    .attr("class", "dot2")
    .attr("cx", d => x(d.Overall_Rating))
    .attr("cy", d => y(d.Restaurant_Name))
    .attr("r", 6)
    .style("fill", "#4C4082")
    .on("mouseover", showTooltip)
    .on("mouseout", hideTooltip);

  g.selectAll(".line")
    .data(data)
    .enter().append("line")
    .attr("class", "line")
    .attr("x1", d => x(d.Average_Rating))
    .attr("y1", d => y(d.Restaurant_Name))
    .attr("x2", d => x(d.Overall_Rating))
    .attr("y2", d => y(d.Restaurant_Name))
    .attr("stroke", "grey")
    .attr("stroke-width", "1px");

// legend
  const legend = svg.append("g")
    .attr("transform", `translate(${(width + margin.left + margin.right) / 2},${height + margin.top + 60})`);

  legend.append("circle")
    .attr("cx", -200)
    .attr("cy", 0)
    .attr("r", 5)
    .attr("fill", "#69b3a2");

  legend.append("text")
    .attr("x", -150)
    .attr("y", 5)
    .text("Average Review Rating on Yelp when Mentioning Dish out of 5");

  legend.append("circle")
    .attr("cx", -200)
    .attr("cy", 20)
    .attr("r", 5)
    .attr("fill", "#4C4082");

  legend.append("text")
    .attr("x", -150)
    .attr("y", 25)
    .text("Overall Restaurant Rating on Yelp out of 5");

  svg.append("text")
    .attr("x", (width + margin.left + margin.right) / 2)
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .text(`Restaurant's Dish Ratings vs. Restaurant's Yelp Rating for "${dish.replace('_', ' ')}"`);

  svg.append("text")
    .attr("x", (width + margin.left + margin.right) / 2)
    .attr("y", height + margin.top + margin.bottom - 10)
    .attr("text-anchor", "middle")
    .attr("class", "axis-label")
    .text("This chart compares the rating of the dish to the rating of the restaurant. Select dishes often outperform the restaurant's overall rating.");

// transition text placeholder
  const transitionTextContainer = svg.append("g")
    .attr("transform", `translate(${width + margin.left}, ${margin.top})`);

  transitionTextContainer.append("text")
    .attr("class", "transition-text")
    .attr("x", 20)
    .attr("y", 0)
    .attr("dy", "1em")
    .attr("text-anchor", "start")
    .style("font-weight", "bold")
    .attr("fill", "red")
    .text("Do we optimize for dish or restaurant?");

  transitionTextContainer.append("text")
    .attr("class", "transition-text")
    .attr("x", 20)
    .attr("y", 20)
    .attr("dy", "1em")
    .attr("text-anchor", "start")
    .style("font-weight", "bold")
    .text("Maybe we should consider both.");

  transitionTextContainer.append("text")
    .attr("class", "transition-text")
    .attr("x", 20)
    .attr("y", 40)
    .attr("dy", "1em")
    .attr("text-anchor", "start")
    .style("font-weight", "bold")
    .attr("fill", "red")
    .text("Is rating variance important?");

  transitionTextContainer.append("text")
    .attr("class", "transition-text")
    .attr("x", 20)
    .attr("y", 60)
    .attr("dy", "1em")
    .attr("text-anchor", "start")
    .style("font-weight", "bold")
    .text("Lower is probably better.");

    transitionTextContainer.append("text")
    .attr("class", "transition-text")
    .attr("x", 20)
    .attr("y", 80)
    .attr("dy", "1em")
    .attr("text-anchor", "start")
    .style("font-weight", "bold")
    .attr("fill", "blue")
    .text("Which would you choose?");

    transitionTextContainer.append("text")
    .attr("class", "transition-text")
    .attr("x", 20)
    .attr("y", 100)
    .attr("dy", "1em")
    .attr("text-anchor", "start")
    .style("font-weight", "bold")
    .text("Hover over dots for more info.");
}
// visualization for top dishes
function createTopDishesVisualization(data, dish) {
  const svg = d3.select("#topDishes");
  const margin = { top: 40, right: 30, bottom: 60, left: 250 };
  const width = +svg.attr('width') - margin.left - margin.right;
  const height = +svg.attr('height') - margin.top - margin.bottom;

  const x = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.Average_Rating)])
    .range([0, width]);

  const y = d3.scaleBand()
    .domain(data.map(d => d.Restaurant_Name))
    .range([0, height])
    .padding(1);

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  g.append("g")
    .call(d3.axisLeft(y).tickSize(0).tickPadding(10));

  g.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).ticks(5));

  g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("y", d => y(d.Restaurant_Name))
    .attr("height", y.bandwidth())
    .attr("x", 0)
    .attr("width", d => x(d.Average_Rating))
    .attr("fill", "#69b3a2");

  g.selectAll(".bar-label")
    .data(data)
    .enter().append("text")
    .attr("class", "bar-label")
    .attr("y", d => y(d.Restaurant_Name) + y.bandwidth() / 2)
    .attr("x", d => x(d.Average_Rating) + 5)
    .attr("dy", ".35em")
    .text(d => d.Average_Rating.toFixed(2));

  svg.append("text")
    .attr("x", (width + margin.left + margin.right) / 2)
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .text(`Top Restaurants for ${dish.replace('_', ' ')}`);
}

// load data
d3.csv('data/top_restaurants_fried_rice.csv').then(data => {
  createClevelandDotPlot(data, 'fried_rice');
});

// listen for changes from dropdown
d3.select("#dish-select").on("change", function() {
    const selectedDish = d3.select(this).property("value");
    d3.csv(`data/top_restaurants_${selectedDish}.csv`).then(data => {
      d3.select("#clevelandDotPlot").selectAll("*").remove();
      createClevelandDotPlot(data, selectedDish);
    });
});
