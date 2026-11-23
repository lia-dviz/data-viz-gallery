const state = {
  search: "",
  showChocolate: true,
  showNonChocolate: true,
  selectedName: null,
  dropdownOpen: false,
  activeIndex: -1
};

const width = 760;
const height = 640;
const margin = { top: 24, right: 20, bottom: 24, left: 46 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

const yScale = d3.scaleLinear()
  .domain([20, 90])
  .range([innerHeight, 0]);

const svg = d3.select("#chart")
  .append("svg")
  .attr("viewBox", `0 0 ${width} ${height}`);

const g = svg.append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

const ticks = [20, 30, 40, 50, 60, 70, 80, 90];
const gridGroup = g.append("g").attr("class", "grid");

gridGroup.selectAll("line")
  .data(ticks)
  .join("line")
  .attr("x1", 0)
  .attr("x2", innerWidth)
  .attr("y1", d => yScale(d))
  .attr("y2", d => yScale(d))
  .attr("stroke", "#eeeeee")
  .attr("stroke-width", 1);

gridGroup.selectAll("text")
  .data(ticks)
  .join("text")
  .attr("class", "axis-label")
  .attr("x", -10)
  .attr("y", d => yScale(d))
  .attr("dy", "0.32em")
  .attr("text-anchor", "end")
  .text(d => `${d}%`);

const chocLine = g.append("line")
  .attr("class", "median-line chocolate")
  .attr("x1", 0)
  .attr("x2", innerWidth);

const chocLabel = g.append("text")
  .attr("class", "median-label chocolate")
  .attr("x", 4)
  .attr("dy", "-0.4em");

const nonChocLine = g.append("line")
  .attr("class", "median-line non-chocolate")
  .attr("x1", 0)
  .attr("x2", innerWidth);

const nonChocLabel = g.append("text")
  .attr("class", "median-label non-chocolate")
  .attr("x", 4)
  .attr("dy", "-0.4em");

const nodesLayer = g.append("g").attr("class", "nodes");
const tooltip = d3.select("#tooltip");
const searchInput = d3.select("#candy-search");
const resultsList = d3.select("#search-results");

const sentimentConfigs = [
  {
    key: "joy",
    heading: "JOY",
    caption: "Chose joy",
    labels: {
      "Reese's Peanut Butter cup": { text: "Reese's cup", dx: -6, dy: -10, anchor: "end" },
      "Starburst": { text: "Starburst", dx: 10, dy: 4, anchor: "start" },
      "Chiclets": { text: "Chiclets", dx: 10, dy: 4, anchor: "start" }
    }
  },
  {
    key: "despair",
    heading: "DESPAIR",
    caption: "Chose despair",
    labels: {
      "Chiclets": { text: "Chiclets", dx: 10, dy: 4, anchor: "start" },
      "Lemonhead": { text: "Lemonhead", dx: -10, dy: 4, anchor: "end" },
      "Sour Patch Kids": { text: "Sour Patch Kids", dx: 10, dy: 4, anchor: "start" }
    }
  },
  {
    key: "meh",
    heading: "MEH",
    caption: "Chose meh",
    labels: {
      "Chiclets": { text: "Chiclets", dx: -10, dy: 4, anchor: "end" },
      "Candy Corn": { text: "Candy Corn", dx: -10, dy: 4, anchor: "end" },
      "100 Grand": { text: "100 Grand", dx: 0, dy: -10, anchor: "middle" },
      "Reese's Peanut Butter cup": { text: "Reese's cup", dx: 0, dy: -10, anchor: "middle" }
    }
  }
];

const sentimentPanels = sentimentConfigs.map(cfg => {
  const panel = d3.select("#sentiment-charts")
    .append("div")
    .attr("class", "sentiment-panel");

  panel.append("h3")
    .attr("class", "sentiment-panel-heading")
    .text(cfg.heading);

  panel.append("p")
    .attr("class", "sentiment-panel-caption")
    .text(cfg.caption);

  const sWidth = 300;
  const sHeight = 320;
  const sMargin = { top: 14, right: 16, bottom: 42, left: 38 };
  const sInnerW = sWidth - sMargin.left - sMargin.right;
  const sInnerH = sHeight - sMargin.top - sMargin.bottom;

  const xScale = d3.scaleLinear()
    .domain([20, 90])
    .range([0, sInnerW]);

  const yAxisScale = d3.scaleLinear()
    .domain([0, 90])
    .range([sInnerH, 0]);

  const sSvg = panel.append("svg")
    .attr("viewBox", `0 0 ${sWidth} ${sHeight}`);

  const sg = sSvg.append("g")
    .attr("transform", `translate(${sMargin.left},${sMargin.top})`);

  const xTicks = [20, 30, 40, 50, 60, 70, 80, 90];
  const yTicks = [0, 20, 40, 60, 80];

  sg.append("g")
    .attr("class", "grid-y")
    .selectAll("line")
    .data(yTicks)
    .join("line")
    .attr("x1", 0)
    .attr("x2", sInnerW)
    .attr("y1", d => yAxisScale(d))
    .attr("y2", d => yAxisScale(d))
    .attr("stroke", "#eeeeee")
    .attr("stroke-width", 1);

  sg.append("g")
    .attr("class", "grid-x")
    .selectAll("line")
    .data(xTicks)
    .join("line")
    .attr("x1", d => xScale(d))
    .attr("x2", d => xScale(d))
    .attr("y1", 0)
    .attr("y2", sInnerH)
    .attr("stroke", "#eeeeee")
    .attr("stroke-width", 1);

  sg.selectAll("text.y-tick")
    .data(yTicks)
    .join("text")
    .attr("class", "axis-label y-tick")
    .attr("x", -8)
    .attr("y", d => yAxisScale(d))
    .attr("dy", "0.32em")
    .attr("text-anchor", "end")
    .text(d => `${d}%`);

  sg.selectAll("text.x-tick")
    .data(xTicks)
    .join("text")
    .attr("class", "axis-label x-tick")
    .attr("x", d => xScale(d))
    .attr("y", sInnerH + 14)
    .attr("text-anchor", "middle")
    .text(d => `${d}%`);

  sg.append("text")
    .attr("class", "axis-label")
    .attr("x", 0)
    .attr("y", sInnerH + 34)
    .text("Win percentage");

  const trendLine = sg.append("line")
    .attr("class", "trend-line");

  const dotsGroup = sg.append("g").attr("class", "scatter-dots");
  const labelsGroup = sg.append("g").attr("class", "scatter-labels");

  return {
    cfg,
    sInnerW,
    sInnerH,
    xScale,
    yAxisScale,
    trendLine,
    dotsGroup,
    labelsGroup
  };
});

function linearRegression(points) {
  if (points.length < 2) {
    return null;
  }
  const n = points.length;
  const meanX = d3.mean(points, p => p.x);
  const meanY = d3.mean(points, p => p.y);
  let num = 0;
  let den = 0;
  for (const p of points) {
    const dx = p.x - meanX;
    num += dx * (p.y - meanY);
    den += dx * dx;
  }
  if (den === 0) {
    return null;
  }
  const slope = num / den;
  const intercept = meanY - slope * meanX;
  return { slope, intercept };
}

function computeMedian(values) {
  return values.length ? d3.median(values) : null;
}

function updateSummary(allData) {
  const chocWins = allData.filter(d => d.chocolate === 1).map(d => d.winPercent);
  const nonChocWins = allData.filter(d => d.chocolate === 0).map(d => d.winPercent);
  const chocMed = computeMedian(chocWins);
  const nonChocMed = computeMedian(nonChocWins);

  const chocText = chocMed !== null ? `${Math.round(chocMed)}%` : "N/A";
  const nonChocText = nonChocMed !== null ? `${Math.round(nonChocMed)}%` : "N/A";

  d3.select("#summary").html(
    `Among ${allData.length} Halloween candies, chocolate candies won a median of <strong>${chocText}</strong> of their matchups, compared with <strong>${nonChocText}</strong> for non-chocolate candies.`
  );

  if (chocMed !== null) {
    const yChoc = yScale(chocMed);
    chocLine.style("display", null).attr("y1", yChoc).attr("y2", yChoc);
    chocLabel.style("display", null).attr("y", yChoc).text(`Chocolate median, ${chocText}`);
  } else {
    chocLine.style("display", "none");
    chocLabel.style("display", "none");
  }

  if (nonChocMed !== null) {
    const yNonChoc = yScale(nonChocMed);
    nonChocLine.style("display", null).attr("y1", yNonChoc).attr("y2", yNonChoc);
    nonChocLabel.style("display", null).attr("y", yNonChoc).text(`Non-chocolate median, ${nonChocText}`);
  } else {
    nonChocLine.style("display", "none");
    nonChocLabel.style("display", "none");
  }
}

function isGroupVisible(d) {
  return (d.chocolate === 1 && state.showChocolate) || (d.chocolate === 0 && state.showNonChocolate);
}

function getSearchMatches(groupData) {
  const term = state.search.trim().toLowerCase();
  if (!term) {
    return [];
  }
  return groupData.filter(d => d.name.toLowerCase().includes(term));
}

function applyHighlights(circles, scatterDots) {
  const matches = getSearchMatches(circles.data());
  const matchedNames = new Set(matches.map(d => d.name));
  const hasSearch = state.search.trim().length > 0;

  const isDimmed = d => {
    if (state.selectedName && d.name !== state.selectedName) {
      return true;
    }
    if (!state.selectedName && hasSearch && !matchedNames.has(d.name)) {
      return true;
    }
    return false;
  };

  const isHighlighted = d => {
    if (state.selectedName && d.name === state.selectedName) {
      return true;
    }
    if (!state.selectedName && hasSearch && matchedNames.has(d.name)) {
      return true;
    }
    return false;
  };

  circles
    .classed("dimmed", isDimmed)
    .classed("highlighted", isHighlighted);

  if (scatterDots) {
    scatterDots
      .classed("dimmed", isDimmed)
      .classed("highlighted", isHighlighted);
  }
}

function renderDropdown(matches, onSelect) {
  const shouldShow = state.dropdownOpen && state.search.trim().length > 0;
  searchInput.attr("aria-expanded", shouldShow ? "true" : "false");
  resultsList.attr("hidden", shouldShow ? null : true);

  if (!shouldShow) {
    resultsList.selectAll("*").remove();
    return;
  }

  if (matches.length === 0) {
    resultsList.html(`<li class="search-result-empty">No matching candies</li>`);
    return;
  }

  const items = resultsList.selectAll("li.search-result-item")
    .data(matches, d => d.name)
    .join(
      enter => enter.append("li")
        .attr("class", "search-result-item")
        .attr("role", "option")
        .on("mousedown", event => {
          event.preventDefault();
        })
        .on("click", (_, d) => {
          onSelect(d);
        }),
      update => update,
      exit => exit.remove()
    );

  items.classed("active", (_, i) => i === state.activeIndex);

  items.html(d => {
    const kindClass = d.chocolate === 1 ? "chocolate" : "non-chocolate";
    const kindText = d.chocolate === 1 ? "Chocolate" : "Non-chocolate";
    return (
      `<span class="search-result-left">` +
      `<span class="search-result-dot ${kindClass}"></span>` +
      `<span class="search-result-name">${d.name}</span>` +
      `</span>` +
      `<span class="search-result-meta">${kindText} · ${d.winPercent.toFixed(0)}%</span>`
    );
  });
}

function showTooltip(event, d, extraLine) {
  tooltip
    .attr("hidden", null)
    .html(
      `<div><strong>${d.name}</strong></div>` +
      `<div>Win rate: ${d.winPercent.toFixed(1)}%</div>` +
      (extraLine ? `<div>${extraLine}</div>` : "") +
      `<div>Price percentile: ${(d.pricePercent * 100).toFixed(0)}%</div>` +
      `<div>Sugar percentile: ${(d.sugarPercent * 100).toFixed(0)}%</div>`
    )
    .style("left", `${event.clientX + 14}px`)
    .style("top", `${event.clientY + 14}px`);
}

function hideTooltip() {
  tooltip.attr("hidden", true);
}

Promise.all([
  d3.json("data/candies.json"),
  d3.json("data/sentiment.json").catch(() => [])
]).then(([rawData, rawSentiment]) => {
  const sentimentMap = new Map(rawSentiment.map(item => [item.name, item]));
  const priceExtent = d3.extent(rawData, d => d.pricePercent);
  const rScale = d3.scaleSqrt()
    .domain(priceExtent)
    .range([3.5, 13.5]);

  const data = rawData.map(d => {
    const s = sentimentMap.get(d.name);
    return {
      ...d,
      joy: s ? s.joy : null,
      despair: s ? s.despair : null,
      meh: s ? s.meh : null,
      r: rScale(d.pricePercent),
      x: innerWidth / 2,
      y: yScale(d.winPercent)
    };
  });

  const sentimentData = data.filter(
    d => d.joy !== null && d.despair !== null && d.meh !== null
  );

  function selectCandy(candy) {
    state.selectedName = candy.name;
    state.search = candy.name;
    state.dropdownOpen = false;
    state.activeIndex = -1;
    searchInput.property("value", candy.name);
    render();
  }

  function renderSentiment(visibleSentiment) {
    const allScatterDots = [];

    for (const panel of sentimentPanels) {
      const { cfg, xScale, yAxisScale, trendLine, dotsGroup, labelsGroup } = panel;
      const reg = linearRegression(
        visibleSentiment.map(d => ({ x: d.winPercent, y: d[cfg.key] }))
      );

      if (reg) {
        const xMin = 20;
        const xMax = 90;
        const yMin = reg.slope * xMin + reg.intercept;
        const yMax = reg.slope * xMax + reg.intercept;

        trendLine
          .style("display", null)
          .attr("x1", xScale(xMin))
          .attr("y1", yAxisScale(yMin))
          .attr("x2", xScale(xMax))
          .attr("y2", yAxisScale(yMax));
      } else {
        trendLine.style("display", "none");
      }

      const dots = dotsGroup.selectAll("circle.scatter-dot")
        .data(visibleSentiment, d => d.name)
        .join(
          enter => enter.append("circle")
            .attr("class", "scatter-dot")
            .attr("r", 5)
            .attr("fill", d => d.chocolate === 1 ? "#5c3219" : "#f2a96b")
            .on("mouseenter", (event, d) => {
              showTooltip(event, d, `${cfg.heading}: ${d[cfg.key]}%`);
            })
            .on("mousemove", event => {
              tooltip
                .style("left", `${event.clientX + 14}px`)
                .style("top", `${event.clientY + 14}px`);
            })
            .on("mouseleave", hideTooltip)
            .on("click", (event, d) => {
              event.stopPropagation();
              state.selectedName = state.selectedName === d.name ? null : d.name;
              applyHighlights(
                nodesLayer.selectAll("circle.candy-circle"),
                d3.selectAll("circle.scatter-dot")
              );
            }),
          update => update,
          exit => exit.remove()
        );

      dots
        .attr("cx", d => xScale(d.winPercent))
        .attr("cy", d => yAxisScale(d[cfg.key]));

      allScatterDots.push(dots);

      const labeledItems = visibleSentiment.filter(d => Boolean(cfg.labels[d.name]));
      labelsGroup.selectAll("text.point-label")
        .data(labeledItems, d => d.name)
        .join(
          enter => enter.append("text").attr("class", "point-label"),
          update => update,
          exit => exit.remove()
        )
        .attr("x", d => xScale(d.winPercent) + cfg.labels[d.name].dx)
        .attr("y", d => yAxisScale(d[cfg.key]) + cfg.labels[d.name].dy)
        .attr("text-anchor", d => cfg.labels[d.name].anchor)
        .text(d => cfg.labels[d.name].text);
    }

    return d3.selectAll("circle.scatter-dot");
  }

  function render() {
    const visibleData = data.filter(isGroupVisible);
    const visibleSentiment = sentimentData.filter(isGroupVisible);
    const matches = getSearchMatches(visibleData);
    if (state.activeIndex >= matches.length) {
      state.activeIndex = matches.length - 1;
    }

    updateSummary(visibleData);
    renderDropdown(matches, selectCandy);

    const simulation = d3.forceSimulation(visibleData)
      .force("x", d3.forceX(innerWidth / 2).strength(0.18))
      .force("y", d3.forceY(d => yScale(d.winPercent)).strength(1))
      .force("collide", d3.forceCollide(d => d.r + 1.5).iterations(6))
      .stop();

    for (let i = 0; i < 240; i += 1) {
      simulation.tick();
    }

    const circles = nodesLayer.selectAll("circle.candy-circle")
      .data(visibleData, d => d.name)
      .join(
        enter => enter.append("circle")
          .attr("class", "candy-circle")
          .attr("r", d => d.r)
          .attr("fill", d => d.chocolate === 1 ? "#5c3219" : "#f2a96b")
          .on("mouseenter", (event, d) => {
            showTooltip(event, d, null);
          })
          .on("mousemove", event => {
            tooltip
              .style("left", `${event.clientX + 14}px`)
              .style("top", `${event.clientY + 14}px`);
          })
          .on("mouseleave", hideTooltip)
          .on("click", (event, d) => {
            event.stopPropagation();
            state.selectedName = state.selectedName === d.name ? null : d.name;
            applyHighlights(
              nodesLayer.selectAll("circle.candy-circle"),
              d3.selectAll("circle.scatter-dot")
            );
          }),
        update => update,
        exit => exit.remove()
      );

    circles
      .attr("r", d => d.r)
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);

    const scatterDots = renderSentiment(visibleSentiment);
    applyHighlights(circles, scatterDots);
  }

  searchInput.on("input", event => {
    state.search = event.target.value;
    state.selectedName = null;
    state.dropdownOpen = state.search.trim().length > 0;
    state.activeIndex = state.dropdownOpen ? 0 : -1;
    render();
  });

  searchInput.on("focus", () => {
    if (state.search.trim().length > 0) {
      state.dropdownOpen = true;
      renderDropdown(getSearchMatches(data.filter(isGroupVisible)), selectCandy);
    }
  });

  searchInput.on("keydown", event => {
    const matches = getSearchMatches(data.filter(isGroupVisible));
    if (!matches.length) {
      if (event.key === "Escape") {
        state.dropdownOpen = false;
        renderDropdown([], selectCandy);
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      state.dropdownOpen = true;
      state.activeIndex = (state.activeIndex + 1) % matches.length;
      renderDropdown(matches, selectCandy);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      state.dropdownOpen = true;
      state.activeIndex = (state.activeIndex - 1 + matches.length) % matches.length;
      renderDropdown(matches, selectCandy);
    } else if (event.key === "Enter" && state.activeIndex >= 0) {
      event.preventDefault();
      selectCandy(matches[state.activeIndex]);
    } else if (event.key === "Escape") {
      state.dropdownOpen = false;
      renderDropdown([], selectCandy);
    }
  });

  d3.select(document).on("click", event => {
    if (!event.target.closest(".search-box")) {
      state.dropdownOpen = false;
      renderDropdown([], selectCandy);
    }
  });

  d3.selectAll(".filter-toggle").on("click", function () {
    const group = this.dataset.group;
    if (group === "chocolate") {
      state.showChocolate = !state.showChocolate;
      d3.select(this).classed("inactive", !state.showChocolate);
    } else if (group === "non-chocolate") {
      state.showNonChocolate = !state.showNonChocolate;
      d3.select(this).classed("inactive", !state.showNonChocolate);
    }
    render();
  });

  svg.on("click", () => {
    state.selectedName = null;
    applyHighlights(
      nodesLayer.selectAll("circle.candy-circle"),
      d3.selectAll("circle.scatter-dot")
    );
  });

  render();
});