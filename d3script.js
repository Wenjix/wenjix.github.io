let currentSlide = 1;
const totalSlides = 3;

function nextSlide() {
    if (currentSlide < totalSlides) {
        document.getElementById(`slide${currentSlide}`).classList.remove('active');
        currentSlide++;
        document.getElementById(`slide${currentSlide}`).classList.add('active');
    }
}

function prevSlide() {
    if (currentSlide > 1) {
        document.getElementById(`slide${currentSlide}`).classList.remove('active');
        currentSlide--;
        document.getElementById(`slide${currentSlide}`).classList.add('active');
    }
}

// Load the CSV data
d3.csv('data/top_restaurants_fried_rice.csv').then(data => {
    createTopDishesVisualization(data, 'fried_rice');
});

d3.csv('data/top_restaurants_fried_chicken.csv').then(data => {
    createClevelandDotPlot(data, 'fried_chicken');
});

// Function to create the Cleveland dot plot
function createClevelandDotPlot(data, dish) {
    const svg = d3.select(`#clevelandDotPlot`);
    const margin = { top: 20, right: 30, bottom: 40, left: 90 };
    const width = +svg.attr('width') - margin.left - margin.right;
    const height = +svg.attr('height') - margin.top - margin.bottom;

    const x = d3.scaleLinear()
        .domain([0, 5])
        .range([0, width]);

    const y = d3.scaleBand()
        .domain(data.map(d => d.Restaurant_Name))
        .range([0, height])
        .padding(0.1);

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    g.append("g")
        .call(d3.axisLeft(y));

    g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(5));

    g.selectAll(".dot1")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot1")
        .attr("cx", d => x(d.Average_Rating))
        .attr("cy", d => y(d.Restaurant_Name))
        .attr("r", 5)
        .attr("fill", "blue");

    g.selectAll(".dot2")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot2")
        .attr("cx", d => x(d.Overall_Rating))
        .attr("cy", d => y(d.Restaurant_Name))
        .attr("r", 5)
        .attr("fill", "red");

    g.selectAll(".line")
        .data(data)
        .enter().append("line")
        .attr("class", "line")
        .attr("x1", d => x(d.Average_Rating))
        .attr("y1", d => y(d.Restaurant_Name))
        .attr("x2", d => x(d.Overall_Rating))
        .attr("y2", d => y(d.Restaurant_Name))
        .attr("stroke", "black")
        .attr("stroke-width", 1);

    // Add annotations
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text(`Comparison of Average Dish Rating and Overall Restaurant Rating for ${dish.replace('_', ' ')}`);
}

// Function to create the top dishes visualization
function createTopDishesVisualization(data, dish) {
    const svg = d3.select(`#topDishes`);
    const margin = { top: 20, right: 30, bottom: 40, left: 90 };
    const width = +svg.attr('width') - margin.left - margin.right;
    const height = +svg.attr('height') - margin.top - margin.bottom;

    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Average_Rating)])
        .range([0, width]);

    const y = d3.scaleBand()
        .domain(data.map(d => d.Restaurant_Name))
        .range([0, height])
        .padding(0.1);

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    g.append("g")
        .call(d3.axisLeft(y));

    g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(5));

    g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("y", d => y(d.Restaurant_Name))
        .attr("width", d => x(d.Average_Rating))
        .attr("height", y.bandwidth())
        .attr("fill", "steelblue");

    // Add annotations
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text(`Top Restaurants for ${dish.replace('_', ' ')}`);
}
