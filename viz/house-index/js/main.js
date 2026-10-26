
const margin = {top: 40, right: 90, bottom: 60, left: 65};
const width = 780 - margin.left - margin.right;
const height = 680 - margin.top - margin.bottom; 

const svg = d3.select("#scatter-plot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

const xScale = d3.scaleLinear().domain([-20, 50]).range([0, width]);
const yScale = d3.scaleLinear().domain([-20, 100]).range([height, 0]);

const tooltip = d3.select("#tooltip");


svg.append("rect")
    .attr("x", xScale(-20)).attr("y", yScale(100))
    .attr("width", xScale(0) - xScale(-20)).attr("height", yScale(-20) - yScale(100))
    .attr("fill", "var(--quad-pink)");

svg.append("rect")
    .attr("x", xScale(0)).attr("y", yScale(100))
    .attr("width", xScale(50) - xScale(0)).attr("height", yScale(-20) - yScale(100))
    .attr("fill", "var(--quad-green)");

const xTicks = [-10, 0, 10, 20, 30, 40, 50];
const yTicks = [-20, -10, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

svg.selectAll(".v-grid").data(xTicks).enter().append("line")
    .attr("x1", d => xScale(d)).attr("x2", d => xScale(d)).attr("y1", 0).attr("y2", height)
    .attr("stroke", "var(--grid-line)").attr("stroke-width", 1);

svg.selectAll(".h-grid").data(yTicks).enter().append("line")
    .attr("x1", 0).attr("x2", width).attr("y1", d => yScale(d)).attr("y2", d => yScale(d))
    .attr("stroke", "var(--grid-line)").attr("stroke-width", 1);

svg.append("line")
    .attr("x1", xScale(-20)).attr("y1", yScale(-20)).attr("x2", xScale(50)).attr("y2", yScale(50))
    .attr("stroke", "rgba(0,0,0,0.3)").attr("stroke-width", 1.5).attr("stroke-dasharray", "4,4");

svg.append("line").attr("x1", 0).attr("x2", width).attr("y1", yScale(0)).attr("y2", yScale(0)).attr("stroke", "#000000").attr("stroke-width", 2);
svg.append("line").attr("x1", xScale(0)).attr("x2", xScale(0)).attr("y1", 0).attr("y2", height).attr("stroke", "#000000").attr("stroke-width", 2);

svg.append("text")
    .attr("class", "axis-label-title")
    .attr("x", -margin.left + 15)
    .attr("y", -20)
    .attr("text-anchor", "start")
    .text("REAL PURCHASE PRICE CHANGE");

svg.append("text")
    .attr("class", "axis-label-title")
    .attr("x", width / 2)
    .attr("y", height + 45)
    .attr("text-anchor", "middle")
    .text("REAL RENTAL PRICE CHANGE");

const formatPercent = d => (d === 0 ? "0%" : `${d}%`);

svg.selectAll(".x-tick-label").data(xTicks).enter().append("text").attr("class", "tick").attr("x", d => xScale(d)).attr("y", height + 20).attr("text-anchor", "middle").text(d => formatPercent(d));
svg.selectAll(".y-tick-label").data(yTicks).enter().append("text").attr("class", "tick").attr("x", -10).attr("y", d => yScale(d) + 4).attr("text-anchor", "end").text(d => formatPercent(d));

// Load external data and build the markers
d3.json("data/data.json").then(function(data) {

    const flagRadius = 13;
    const defs = svg.append("defs");
    
    // Create individual round masking clips for the flags
    defs.selectAll(".flag-clip").data(data).enter().append("clipPath")
        .attr("id", d => `clip-${d.city.replace(/\s+/g, '-').toLowerCase()}`)
        .append("circle").attr("r", flagRadius);

    // Build the data group nodes
    const node = svg.selectAll(".city-node").data(data).enter()
        .append("g").attr("transform", d => `translate(${xScale(d.realRentChange)}, ${yScale(d.realPriceChange)})`);

    // Add SVG flag images
    node.append("image")
        .attr("href", d => `https://cdnjs.cloudflare.com/ajax/libs/flag-icons/7.1.0/flags/4x3/${d.country_code}.svg`)
        .attr("width", flagRadius * 2.5).attr("height", flagRadius * 2.5)
        .attr("x", -flagRadius * 1.25).attr("y", -flagRadius * 1.25)
        .attr("clip-path", d => `url(#clip-${d.city.replace(/\s+/g, '-').toLowerCase()})`)
        .on("mouseover", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseleave", hideTooltip);

    // Add pointer event targets (borders)
    node.append("circle")
        .attr("class", "flag-marker")
        .attr("r", flagRadius)
        .attr("fill", "rgba(0,0,0,0)") 
        .on("mouseover", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseleave", hideTooltip);

    // Dynamic anti-collision spacing logic for labels
    const getLabelConfig = (city) => {
        const offset = flagRadius + 6;
        switch(city) {
            case "Los Angeles":   return {x: -offset, y: -4, anchor: "end", invertStack: true}; 
            case "San Francisco": return {x: offset, y: -4, anchor: "start", invertStack: true}; 
            case "New York":      return {x: -offset, y: -4, anchor: "end", invertStack: true}; 
            case "London":        return {x: offset, y: 4, anchor: "start"};
            case "Paris":         return {x: offset, y: -6, anchor: "start"};
            case "Milan":         return {x: offset, y: -4, anchor: "start", invertStack: true};
            case "Toronto":       return {x: -offset, y: -2, anchor: "end"};
            case "Frankfurt":     return {x: -offset, y: 4, anchor: "end"};
            case "Zurich":        return {x: offset, y: -8, anchor: "start"}; 
            case "Vancouver":     return {x: offset, y: 14, anchor: "start"};
            case "Amsterdam":     return {x: -offset, y: 2, anchor: "end"};
            case "Geneva":        return {x: offset, y: 4, anchor: "start"};
            case "Dubai":         return {x: offset, y: 4, anchor: "start"};
            case "Madrid":        return {x: offset, y: 4, anchor: "start"};
            case "Tokyo":         return {x: offset, y: 4, anchor: "start"};
            case "Hong Kong":     return {x: -offset, y: -10, anchor: "end", invertStack: true}; 
            case "São Paulo":     return {x: offset, y: -10, anchor: "start", invertStack: true};
            default:              return {x: offset, y: 4, anchor: "start"};
        }
    };

    // Append static city text structures
    node.append("text")
        .attr("class", "city-label")
        .attr("text-anchor", d => getLabelConfig(d.city).anchor)
        .attr("x", d => getLabelConfig(d.city).x)
        .attr("y", d => getLabelConfig(d.city).y)
        .each(function(d) {
            const config = getLabelConfig(d.city);
            const isCompound = d.city.includes(" ") && ["Hong Kong", "São Paulo", "San Francisco", "Los Angeles", "New York"].includes(d.city);

            if (isCompound) {
                const words = d.city.split(" ");
                if (config.invertStack) {
                    d3.select(this).append("tspan").attr("x", config.x).attr("dy", "-1.1em").text(words[0]);
                    d3.select(this).append("tspan").attr("x", config.x).attr("dy", "1.1em").text(words[1] + (words[2] ? " " + words[2] : ""));
                } else {
                    d3.select(this).append("tspan").attr("x", config.x).text(words[0]);
                    d3.select(this).append("tspan").attr("x", config.x).attr("dy", "1.2em").text(words[1] + (words[2] ? " " + words[2] : ""));
                }
            } else {
                d3.select(this).text(d.city);
            }
        });

    // Tooltip Handlers
    function showTooltip(event, d) {
        tooltip.style("opacity", 1)
            .html(`
                <div class="tooltip-title">${d.city}</div>
                <div>Country: ${d.country}</div>
                <div>Purchase Price: <strong>${d.realPriceChange >= 0 ? '+' : ''}${d.realPriceChange}%</strong></div>
                <div>Rental Price: <strong>${d.realRentChange >= 0 ? '+' : ''}${d.realRentChange}%</strong></div>
            `);
    }

    function moveTooltip(event) {
        const containerCoords = d3.select("#chart-container").node().getBoundingClientRect();
        const mouseX = event.clientX - containerCoords.left;
        const mouseY = event.clientY - containerCoords.top;

        tooltip
            .style("left", (mouseX + 15) + "px") 
            .style("top", (mouseY - 20) + "px");
    }

    function hideTooltip() {
        tooltip.style("opacity", 0);
    }
}).catch(function(error) {
    console.error("Error loading the JSON data file:", error);
});

const topNote = svg.append("g").attr("transform", `translate(${xScale(23)}, ${yScale(85)})`);
topNote.append("text").attr("class", "annotation-box").attr("y", 0).text("In most major cities, house");
topNote.append("text").attr("class", "annotation-box").attr("y", 16).text("prices have risen faster");
topNote.append("text").attr("class", "annotation-box").attr("y", 32).text("than rents over the past");
topNote.append("text").attr("class", "annotation-box").attr("y", 48).text("ten years.");

const bottomNote = svg.append("g").attr("transform", `translate(${xScale(28)}, ${yScale(20)})`);
bottomNote.append("text").attr("class", "annotation-box").attr("y", 0).text("Strong tourism and short-term");
bottomNote.append("text").attr("class", "annotation-box").attr("y", 16).text("rentals have driven up");
bottomNote.append("text").attr("class", "annotation-box").attr("y", 32).text("Madrid's average rent by");
bottomNote.append("text").attr("class", "annotation-box").attr("y", 48).text("48% since 2015.");