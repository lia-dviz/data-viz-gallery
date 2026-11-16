let currentSelectedCountry = "Mundo";
let exportData = {};
let rankingData = [];
let isoMap = {};
let referenceYear = 2026;

const PRODUCT_ICONS = {
    "Óleos brutos de petróleo": `<svg viewBox="0 0 36 36" class="product-icon-svg"><rect x="9" y="5" width="18" height="26" rx="2" fill="#1e3a4c"/><rect x="7" y="10" width="22" height="2.5" rx="1" fill="#132633"/><rect x="7" y="23" width="22" height="2.5" rx="1" fill="#132633"/><circle cx="18" cy="18" r="3.5" fill="#f59e0b"/><path d="M18 15.8c1 1.4 1.6 2.1 1.6 2.8a1.6 1.6 0 0 1-3.2 0c0-.7.6-1.4 1.6-2.8z" fill="#1e3a4c"/></svg>`,
    "Óleos combustíveis": `<svg viewBox="0 0 36 36" class="product-icon-svg"><rect x="9" y="5" width="18" height="26" rx="2" fill="#2c5282"/><rect x="7" y="10" width="22" height="2.5" rx="1" fill="#1a365d"/><rect x="7" y="23" width="22" height="2.5" rx="1" fill="#1a365d"/><path d="M18 14c2 2.8 3 4.2 3 5.5a3 3 0 0 1-6 0c0-1.3 1-2.7 3-5.5z" fill="#ecc94b"/></svg>`,
    "Soja": `<svg viewBox="0 0 36 36" class="product-icon-svg"><path d="M21 6c6 0 9 4 9 9-5 0-9-3-9-9z" fill="#48bb78"/><ellipse cx="13" cy="22" rx="4.5" ry="3.2" fill="#ecc94b" stroke="#d69e2e" stroke-width="1"/><ellipse cx="21" cy="21" rx="4.5" ry="3.2" fill="#f6e05e" stroke="#d69e2e" stroke-width="1"/><ellipse cx="17" cy="26" rx="4.8" ry="3.2" fill="#ecc94b" stroke="#d69e2e" stroke-width="1"/><ellipse cx="10" cy="26" rx="4" ry="2.8" fill="#f6e05e" stroke="#d69e2e" stroke-width="1"/></svg>`,
    "Farelo de soja": `<svg viewBox="0 0 36 36" class="product-icon-svg"><path d="M8 25c2-8 18-8 20 0H8z" fill="#d69e2e"/><path d="M6 25h24l-3 5H9l-3-5z" fill="#e2e8f0"/></svg>`,
    "Óleo de soja": `<svg viewBox="0 0 36 36" class="product-icon-svg"><rect x="13" y="11" width="10" height="19" rx="3" fill="#f6e05e" stroke="#d69e2e" stroke-width="1.2"/><rect x="15" y="6" width="6" height="5" rx="1" fill="#48bb78"/></svg>`,
    "Minério de ferro": `<svg viewBox="0 0 36 36" class="product-icon-svg"><polygon points="11,26 7,20 13,16 19,20 17,26" fill="#718096"/><polygon points="25,26 19,26 18,19 24,16 29,21" fill="#4a5568"/><polygon points="18,21 13,17 15,11 21,11 23,17" fill="#a0aec0"/></svg>`,
    "Minério de cobre": `<svg viewBox="0 0 36 36" class="product-icon-svg"><polygon points="11,26 7,20 13,16 19,20 17,26" fill="#c05621"/><polygon points="25,26 19,26 18,19 24,16 29,21" fill="#9c4221"/><polygon points="18,21 13,17 15,11 21,11 23,17" fill="#dd6b20"/></svg>`,
    "Carne bovina congelada": `<svg viewBox="0 0 36 36" class="product-icon-svg"><path d="M7 22c0-5 6-10 14-10 5 0 8 3 8 7 0 5-7 8-15 8-4 0-7-2-7-5z" fill="#e53e3e" stroke="#fed7d7" stroke-width="1.5"/><circle cx="22" cy="18" r="2.2" fill="#fff5f5"/><path d="M11 21c3-2 6-2 9 0" stroke="#feb2b2" stroke-width="1.3" fill="none"/></svg>`,
    "Carne bovina fresca": `<svg viewBox="0 0 36 36" class="product-icon-svg"><path d="M7 22c0-5 6-10 14-10 5 0 8 3 8 7 0 5-7 8-15 8-4 0-7-2-7-5z" fill="#c53030" stroke="#feb2b2" stroke-width="1.5"/><circle cx="22" cy="18" r="2.2" fill="#fff5f5"/></svg>`,
    "Carne suína": `<svg viewBox="0 0 36 36" class="product-icon-svg"><path d="M8 21c0-5 6-9 13-9 5 0 7 3 7 6 0 5-6 8-14 8-4 0-6-2-6-5z" fill="#f687b3" stroke="#fed7e2" stroke-width="1.5"/><circle cx="21" cy="18" r="2" fill="#ffffff"/></svg>`,
    "Carne de aves": `<svg viewBox="0 0 36 36" class="product-icon-svg"><ellipse cx="16" cy="17" rx="7" ry="5" transform="rotate(-25 16 17)" fill="#fbb6ce"/><rect x="20" y="18" width="8" height="3" rx="1.5" transform="rotate(25 20 18)" fill="#edf2f7"/></svg>`,
    "Milho": `<svg viewBox="0 0 36 36" class="product-icon-svg"><ellipse cx="18" cy="17" rx="5.5" ry="10" transform="rotate(30 18 17)" fill="#ecc94b"/><path d="M10 24c1-5 5-8 9-8-2 5-5 8-9 8z" fill="#48bb78"/><path d="M23 26c-4-1-7-5-7-9 4 2 7 5 7 9z" fill="#38a169"/></svg>`,
    "Açúcares": `<svg viewBox="0 0 36 36" class="product-icon-svg"><path d="M10 21l8-8 8 8H10z" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/><path d="M7 21h22l-3 6H10l-3-6z" fill="#cbd5e0"/></svg>`,
    "Café": `<svg viewBox="0 0 36 36" class="product-icon-svg"><ellipse cx="14" cy="21" rx="5" ry="3.5" transform="rotate(-20 14 21)" fill="#744210"/><ellipse cx="22" cy="16" rx="5" ry="3.5" transform="rotate(15 22 16)" fill="#975a16"/><ellipse cx="21" cy="24" rx="5" ry="3.5" transform="rotate(-10 21 24)" fill="#5f370e"/></svg>`,
    "Celulose": `<svg viewBox="0 0 36 36" class="product-icon-svg"><rect x="8" y="18" width="16" height="5" rx="2.5" transform="rotate(-25 8 18)" fill="#b7791f"/><rect x="11" y="23" width="16" height="5" rx="2.5" transform="rotate(-25 11 23)" fill="#975a16"/><circle cx="23" cy="13" r="2.5" fill="#f6e05e"/><circle cx="26" cy="18" r="2.5" fill="#f6e05e"/></svg>`,
    "Automóveis": `<svg viewBox="0 0 36 36" class="product-icon-svg"><path d="M7 21l3-6h16l3 6v5H7v-5z" fill="#3182ce"/><circle cx="12" cy="26" r="3" fill="#1a202c"/><circle cx="24" cy="26" r="3" fill="#1a202c"/><rect x="12" y="16" width="12" height="4" rx="1" fill="#bee3f8"/></svg>`,
    "Veículos de carga": `<svg viewBox="0 0 36 36" class="product-icon-svg"><rect x="6" y="13" width="16" height="11" rx="1" fill="#2b6cb0"/><path d="M22 16h6l2 4v4h-8v-8z" fill="#4299e1"/><circle cx="11" cy="25" r="2.8" fill="#1a202c"/><circle cx="25" cy="25" r="2.8" fill="#1a202c"/></svg>`,
    "Autopeças": `<svg viewBox="0 0 36 36" class="product-icon-svg"><circle cx="18" cy="18" r="8" fill="none" stroke="#4a5568" stroke-width="4" stroke-dasharray="4 2"/><circle cx="18" cy="18" r="3" fill="#a0aec0"/></svg>`,
    "Tratores": `<svg viewBox="0 0 36 36" class="product-icon-svg"><rect x="14" y="13" width="11" height="9" rx="1" fill="#38a169"/><rect x="9" y="17" width="6" height="5" fill="#2f855a"/><circle cx="22" cy="24" r="4.5" fill="#1a202c"/><circle cx="11" cy="25" r="2.8" fill="#1a202c"/></svg>`,
    "Aeronaves": `<svg viewBox="0 0 36 36" class="product-icon-svg"><path d="M6 20l10-2 6-9h3l-3 9 7-1 2-3h2l-1 5 1 5h-2l-2-3-7-1 3 9h-3l-6-9-10-2z" fill="#3182ce"/></svg>`,
    "Aço semi-acabado": `<svg viewBox="0 0 36 36" class="product-icon-svg"><polygon points="8,24 14,14 28,14 22,24" fill="#718096"/><polygon points="22,24 28,14 28,19 22,28" fill="#4a5568"/><polygon points="8,24 22,24 22,28 8,28" fill="#a0aec0"/></svg>`,
    "Ferroligas": `<svg viewBox="0 0 36 36" class="product-icon-svg"><polygon points="9,25 14,15 27,15 22,25" fill="#4a5568"/><polygon points="9,25 22,25 22,28 9,28" fill="#718096"/></svg>`,
    "Ouro": `<svg viewBox="0 0 36 36" class="product-icon-svg"><polygon points="7,25 11,17 23,17 27,25" fill="#ecc94b"/><polygon points="11,17 15,13 25,13 23,17" fill="#fefcbf"/><polygon points="23,17 25,13 29,21 27,25" fill="#d69e2e"/></svg>`,
    "Óxido de alumínio": `<svg viewBox="0 0 36 36" class="product-icon-svg"><path d="M9 23c2-7 16-7 18 0H9z" fill="#edf2f7" stroke="#cbd5e0" stroke-width="1"/><path d="M7 23h22l-3 5H10l-3-5z" fill="#a0aec0"/></svg>`,
    "Energia elétrica": `<svg viewBox="0 0 36 36" class="product-icon-svg"><polygon points="20,6 10,20 17,20 15,30 26,16 19,16" fill="#ecc94b" stroke="#d69e2e" stroke-width="1"/></svg>`,
    "Bombas e compressores": `<svg viewBox="0 0 36 36" class="product-icon-svg"><rect x="10" y="13" width="14" height="11" rx="2" fill="#4a5568"/><rect x="24" y="16" width="5" height="5" fill="#2d3748"/><rect x="14" y="9" width="6" height="4" fill="#718096"/></svg>`,
    "default": `<svg viewBox="0 0 36 36" class="product-icon-svg"><polygon points="18,7 29,13 29,24 18,30 7,24 7,13" fill="#ed8936"/><polygon points="18,7 29,13 18,19 7,13" fill="#fbd38d"/><polygon points="18,19 29,13 29,24 18,30" fill="#dd6b20"/></svg>`
};

const tooltip = d3.select("#tooltip");
const mapWidth = 960, mapHeight = 550;
const svgMap = d3.select("#chart-container").append("svg").attr("viewBox", [0, 0, mapWidth, mapHeight]);
const projection = d3.geoNaturalEarth1().scale(230).translate([mapWidth / 1.9, mapHeight / 1.65]);
const pathMap = d3.geoPath().projection(projection);
const strokeScale = d3.scaleLinear().domain([0, 100]).range([1, 12]);

const defs = svgMap.append("defs");
defs.append("marker")
    .attr("id", "arrow")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 8)
    .attr("refY", 0)
    .attr("markerWidth", 4)
    .attr("markerHeight", 4)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("fill", "#009739");

Promise.all([
    d3.json("https://unpkg.com/world-atlas@2/countries-110m.json"),
    d3.json("data/exports.json")
]).then(([world, data]) => {
    exportData = data.exportData;
    rankingData = data.rankingData;
    isoMap = data.isoMap;
    if (data.year) referenceYear = data.year;

    svgMap.append("g").selectAll("path")
        .data(topojson.feature(world, world.objects.countries).features)
        .join("path")
        .attr("class", "country")
        .attr("id", d => "iso-" + d.id)
        .attr("d", pathMap);

    renderRanking();
    drawFlows();
    updateProductChart("Mundo");
});

function renderRanking() {
    const container = d3.select("#ranking-container");
    container.selectAll("*").remove();
    const table = container.append("table").attr("class", "ranking-table");
    const maxVal = d3.max(rankingData.slice(1), d => d.value);
    const rows = table.selectAll("tr").data(rankingData).enter().append("tr")
        .classed("row-fixed-style", d => d.country === "Mundo")
        .classed("selected", d => d.country === "Mundo")
        .classed("hidden-row", (d, i) => i > 3)
        .on("click", function (event, d) {
            d3.selectAll("tr").classed("selected", false);
            d3.select(this).classed("selected", true);
            currentSelectedCountry = d.country;
            updateProductChart(d.country);
            highlightFlow(d.country);
            highlightCountryOnMap(d.country);
        })
        .on("mouseover", function (event, d) {
            if (d.country === "Mundo") return;
            tooltip.style("visibility", "visible")
                .html(`Em ${referenceYear} o Brasil exportou <strong>$${d.value} bn</strong> para <strong>${d.country}</strong>.`);
        })
        .on("mousemove", function (event) {
            tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function () { tooltip.style("visibility", "hidden"); });

    rows.append("td").attr("class", "rank-num").text(d => d.rank);
    rows.append("td").html(d => d.country === "Mundo" ? `<span style="color: #666; font-style: italic;">Selecione um País</span>` : `<img src="https://flagcdn.com/w40/${d.flag}.png" class="flag-icon"> ${d.country}`);
    rows.append("td").html(d => {
        if (d.country === "Mundo") return `<span style="color: #004b23; font-weight: bold; cursor: pointer;">LIMPAR SELEÇÃO</span>`;
        const scale = d3.scaleSqrt().domain([0, maxVal]).range([0, 100]);
        return `<div class="bar-container"><div class="bar-fill" style="width:${scale(d.value)}%; background-color:${d.color};"></div></div><span class="val-text">${d.value}</span>`;
    });
    rows.append("td")
        .html(d => {
            if (d.country === "Mundo") return "";
            if (d.trend.includes("+")) return `<span class="trend-up">▲ ${d.trend}</span>`;
            if (d.trend.includes("-")) return `<span class="trend-down">▼ ${d.trend}</span>`;
            return `<span class="trend-neutral">●</span>`;
        })
        .on("mouseover", function (event, d) {
            if (d.country === "Mundo" || !d.trend) return;
            event.stopPropagation();
            const absPct = d.trend.replace(/[+-]/g, "");
            const dir = d.trend.includes("+") ? "maior" : "menor";
            tooltip.style("visibility", "visible")
                .html(`Em ${referenceYear}, a exportação para <strong>${d.country}</strong> foi <strong>${absPct} ${dir}</strong> comparada com ${referenceYear - 1}.`);
        });
    container.append("button").attr("class", "expand-btn").text("Expandir tabela ▼").on("click", function () {
        const isExpanded = d3.select(this).text().includes("Recolher");
        table.selectAll("tr.hidden-row").style("display", isExpanded ? "none" : "table-row");
        d3.select(this).text(isExpanded ? "Expandir tabela ▼" : "Recolher tabela ▲");
    });
}

function highlightCountryOnMap(countryName) {
    d3.selectAll(".country").classed("active-country", false);
    const isoCode = isoMap[countryName];
    if (isoCode) d3.select("#iso-" + isoCode).classed("active-country", true);
}

function drawFlows() {
    const source = projection([-52, -15]);
    const linesGroup = svgMap.append("g").attr("class", "lines-layer");
    const particlesGroup = svgMap.append("g").attr("class", "particles-layer");
    const labelsGroup = svgMap.append("g").attr("class", "labels-layer");
    svgMap.append("circle").attr("cx", source[0]).attr("cy", source[1]).attr("r", 15).attr("class", "source-circle");
    svgMap.append("text").attr("x", source[0]).attr("y", source[1] + 5).text("Brasil").attr("class", "source-label");
    rankingData.slice(1).forEach((d, i) => {
        const target = projection(d.coords);
        if (!target) return;
        const safeId = d.country.replace(/\s+/g, '');
        const gradId = `grad-${safeId}`;
        const grad = defs.append("linearGradient").attr("id", gradId).attr("gradientUnits", "userSpaceOnUse").attr("x1", source[0]).attr("y1", source[1]).attr("x2", target[0]).attr("y2", target[1]);
        grad.append("stop").attr("offset", "0%").attr("stop-color", "#009739");
        grad.append("stop").attr("offset", "100%").attr("stop-color", "#009739").attr("stop-opacity", 0.1);

        const dx = target[0] - source[0], dy = target[1] - source[1], midX = (source[0] + target[0]) / 2, midY = (source[1] + target[1]) / 2;
        let curveFactor = (d.country === "Argentina" || d.country === "Chile") ? 0.1 : (d.country === "China" ? -0.05 : (d.country === "Índia" ? 0.28 : 0.2));
        const path = linesGroup.append("path").attr("id", `flow-${safeId}`).attr("class", "flow-line").attr("d", `M${source[0]},${source[1]} Q${midX - dy * curveFactor},${midY + dx * curveFactor} ${target[0]},${target[1]}`).style("stroke", `url(#${gradId})`).style("stroke-width", strokeScale(d.value));
        const totalLength = path.node().getTotalLength();
        path.attr("stroke-dasharray", totalLength + " " + totalLength).attr("stroke-dashoffset", totalLength).transition().duration(1500).delay(i * 150).ease(d3.easeCubicOut).attr("stroke-dashoffset", 0).on("end", function () {
            d3.select(this).attr("marker-end", "url(#arrow)");
            for (let j = 0; j < 3; j++) createParticle(path.node(), particlesGroup, safeId, j * 1000);
        });

        let labelX = target[0], labelY = target[1], textAnchor = "middle", offset = 15;
        if (d.labelPos === "top") labelY -= offset; else if (d.labelPos === "bottom") labelY += offset + 10; else if (d.labelPos === "left") { labelX -= offset; textAnchor = "end"; } else { labelX += offset; textAnchor = "start"; }
        const g = labelsGroup.append("g").attr("transform", `translate(${labelX}, ${labelY})`);
        g.append("text").text(d.country).attr("class", "region-name").attr("text-anchor", textAnchor).transition().duration(500).delay(1500 + (i * 150)).style("opacity", 1);
        g.append("text").text(`US$ ${d.value} bi`).attr("class", "region-value").attr("text-anchor", textAnchor).attr("y", 12).transition().duration(500).delay(1700 + (i * 150)).style("opacity", 1);
    });
}

function createParticle(pathNode, container, id, initialDelay = 0) {
    const particle = container.append("circle").attr("class", `particle particle-${id}`).attr("r", 1.8).attr("fill", "#ffffff").style("opacity", 0);
    function animate() {
        particle.transition().delay(initialDelay).duration(2500 + Math.random() * 1000).ease(d3.easeLinear).attrTween("transform", () => {
            const len = pathNode.getTotalLength();
            return (t) => { const point = pathNode.getPointAtLength(t * len); return `translate(${point.x}, ${point.y})`; };
        }).style("opacity", 1).on("end", () => { initialDelay = 0; animate(); });
    }
    animate();
}

function highlightFlow(countryName) {
    d3.selectAll(".flow-line").classed("highlight", false).classed("dimmed", countryName !== "Mundo");
    d3.selectAll(".particle").style("opacity", countryName === "Mundo" ? 1 : 0.1);
    if (countryName !== "Mundo") {
        const safeId = countryName.replace(/\s+/g, '');
        d3.select(`#flow-${safeId}`).classed("dimmed", false).classed("highlight", true);
        d3.selectAll(`.particle-${safeId}`).style("opacity", 1);
    }
}

function updateProductChart(countryName) {
    const data = exportData[countryName] || [];
    const countryEntry = rankingData.find(r => r.country === countryName);
    const totalCountryVal = countryEntry ? countryEntry.value : d3.sum(data, d => d.v);


    const container = d3.select("#product-table-container");
    container.selectAll("*").remove();

    const table = container.append("table").attr("class", "products-table");
    const thead = table.append("thead").append("tr");
    thead.append("th").text("Produto");
    thead.append("th").html("Valor Exportado<br>(US$ Bilhões)");
    thead.append("th").html("Participação<br>(%)");

    const tbody = table.append("tbody");
    const rows = tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr")
        .on("mouseover", (event, d) => {
            const share = totalCountryVal > 0 ? ((d.v / totalCountryVal) * 100).toFixed(1) : "0.0";
            tooltip.style("visibility", "visible")
                .html(`<strong>${d.p}</strong>: US$ ${d.v.toFixed(1)} bi (${share}% do total)`);
        })
        .on("mousemove", (event) => {
            tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", () => tooltip.style("visibility", "hidden"));

    rows.append("td").html(d => {
        const iconSvg = PRODUCT_ICONS[d.p] || PRODUCT_ICONS["default"];
        return `<div class="product-cell-info">${iconSvg}<span class="product-name-text">${d.p}</span></div>`;
    });

    rows.append("td")
        .attr("class", "product-num-val")
        .text(d => d.v.toFixed(1));

    rows.append("td")
        .attr("class", "product-share-val")
        .text(d => {
            const share = totalCountryVal > 0 ? ((d.v / totalCountryVal) * 100).toFixed(1) : "0.0";
            return `${share}%`;
        });
}
