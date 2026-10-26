const width = 1000;
const height = 900;
const margin = { top: 20, right: 100, bottom: 60, left: 180 };

const continentConfig = {
    "Africa": { color: "#ea5f8a" },
    "Asia": { color: "#2bbbad" },
    "Europe": { color: "#9561e2" },
    "Latin America and the Caribbean": { color: "#f6d55c" },
    "Northern America": { color: "#6c757d" },
    "Oceania": { color: "#1e88e5" }
};

const categories = Object.keys(continentConfig);
const svg = d3.select("#chart").append("svg").attr("width", width).attr("height", height);
const tooltip = d3.select("#tooltip");

// Caminhos atualizados para a sua pasta /data
Promise.all([
    d3.csv("data/unpopulation_dataportal_20260203130455.csv"),
    d3.json("data/regions.json")
]).then(([populationData, countryCodes]) => {

    const isoToContinent = {};
    countryCodes.forEach(c => {
        if (c["sub-region"] === "Northern America") isoToContinent[c["alpha-3"]] = "Northern America";
        else if (c["region"] === "Americas") isoToContinent[c["alpha-3"]] = "Latin America and the Caribbean";
        else isoToContinent[c["alpha-3"]] = c["region"];
    });

    let data = populationData
        .filter(d => d.Time === "2024")
        .map(d => ({
            country: d.Location,
            value: +d.Value,
            continent: isoToContinent[d.Iso3]
        }))
        .filter(d => d.continent && categories.includes(d.continent) && !isNaN(d.value));

    const yScale = d3.scalePoint()
        .domain(categories)
        .range([margin.top + 50, height - margin.bottom])
        .padding(0.6);

    const xScale = d3.scaleLinear().domain([10, 55]).range([margin.left, width - margin.right]);

    const simulation = d3.forceSimulation(data)
        .force("x", d3.forceX(d => xScale(d.value)).strength(3))
        .force("y", d3.forceY(d => yScale(d.continent)).strength(0.3))
        .force("collide", d3.forceCollide(5.5))
        .stop();

    for (let i = 0; i < 250; ++i) simulation.tick();

    categories.forEach(region => {
        const yPos = yScale(region);
        svg.append("line").attr("x1", margin.left).attr("x2", width - margin.right).attr("y1", yPos).attr("y2", yPos).attr("class", "grid-line");
        svg.append("text").attr("x", margin.left - 20).attr("y", yPos).attr("dy", "0.3em").attr("text-anchor", "end").attr("class", "continent-label")
            .text(region === "Latin America and the Caribbean" ? "Latin America" : region);
    });

    const circles = svg.selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", 4.5)
        .attr("fill", d => continentConfig[d.continent].color)
        .attr("stroke", "#333")
        .attr("stroke-width", 0.5)
        .on("mouseover", (event, d) => {
            tooltip.transition().duration(50).style("opacity", 1);
            tooltip.html(`<strong>${d.country}</strong><br/>Median Age: ${d.value.toFixed(1)}<br/>${d.continent}`)
                .style("left", (event.pageX + 15) + "px").style("top", (event.pageY - 20) + "px");
        })
        .on("mousemove", (event) => {
            tooltip.style("left", (event.pageX + 15) + "px").style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", () => tooltip.transition().duration(50).style("opacity", 0));

    d3.select("#countrySearch").on("input", function () {
        const term = this.value.toLowerCase();
        circles.classed("highlighted", d => term && d.country.toLowerCase().includes(term));
    });

    categories.forEach(region => {
        const continentData = data.filter(d => d.continent === region);
        const medianVal = d3.median(continentData, d => d.value);
        const yExtent = d3.extent(continentData, d => d.y);
        const padding = 10;
        const capWidth = 4;

        const xMedian = xScale(medianVal);
        const y1 = yExtent[0] - padding;
        const y2 = yExtent[1] + padding;

        const medianG = svg.append("g");

        medianG.append("line").attr("class", "median-line").attr("x1", xMedian).attr("x2", xMedian).attr("y1", y1).attr("y2", y2);
        medianG.append("line").attr("class", "median-cap").attr("x1", xMedian - capWidth).attr("x2", xMedian + capWidth).attr("y1", y1).attr("y2", y1);
        medianG.append("line").attr("class", "median-cap").attr("x1", xMedian - capWidth).attr("x2", xMedian + capWidth).attr("y1", y2).attr("y2", y2);

        svg.append("text").attr("class", "median-text").attr("x", xMedian).attr("y", y1 - 10).attr("text-anchor", "middle").text(`${medianVal.toFixed(1)} years`);

        continentData.sort((a, b) => a.value - b.value);
        const extremes = [continentData[0], continentData[continentData.length - 1]];

        extremes.forEach((d, i) => {
            const isMin = i === 0;
            const labelY = isMin ? yExtent[0] - 45 : yExtent[1] + 45;

            svg.append("line")
                .attr("x1", d.x).attr("y1", d.y + (isMin ? -6 : 6))
                .attr("x2", d.x).attr("y2", labelY + (isMin ? 8 : -8))
                .attr("stroke", "#aaa").attr("stroke-width", 0.8);

            svg.append("text")
                .attr("class", "country-label")
                .attr("x", d.x)
                .attr("y", labelY)
                .attr("text-anchor", "middle")
                .text(`${d.country} (${d.value.toFixed(1)})`);
        });
    });

    const xAxis = d3.axisBottom(xScale).ticks(10).tickSize(0).tickPadding(10);
    svg.append("g").attr("transform", `translate(0, ${height - 40})`).call(xAxis);
});
