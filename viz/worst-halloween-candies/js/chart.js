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

function applyHighlights(circles) {
  const matches = getSearchMatches(circles.data());
  const matchedNames = new Set(matches.map(d => d.name));
  const hasSearch = state.search.trim().length > 0;

  circles
    .classed("dimmed", d => {
      if (state.selectedName && d.name !== state.selectedName) {
        return true;
      }
      if (!state.selectedName && hasSearch && !matchedNames.has(d.name)) {
        return true;
      }
      return false;
    })
    .classed("highlighted", d => {
      if (state.selectedName && d.name === state.selectedName) {
        return true;
      }
      if (!state.selectedName && hasSearch && matchedNames.has(d.name)) {
        return true;
      }
      return false;
    });
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

d3.json("data/candies.json").then(rawData => {
  const priceExtent = d3.extent(rawData, d => d.pricePercent);
  const rScale = d3.scaleSqrt()
    .domain(priceExtent)
    .range([3.5, 13.5]);

  const data = rawData.map(d => ({
    ...d,
    r: rScale(d.pricePercent),
    x: innerWidth / 2,
    y: yScale(d.winPercent)
  }));

  function selectCandy(candy) {
    state.selectedName = candy.name;
    state.search = candy.name;
    state.dropdownOpen = false;
    state.activeIndex = -1;
    searchInput.property("value", candy.name);
    render();
  }

  function render() {
    const visibleData = data.filter(isGroupVisible);
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
          .on("mouseenter", (_, d) => {
            tooltip
              .attr("hidden", null)
              .html(
                `<div><strong>${d.name}</strong></div>` +
                `<div>Win rate: ${d.winPercent.toFixed(1)}%</div>` +
                `<div>Price percentile: ${(d.pricePercent * 100).toFixed(0)}%</div>` +
                `<div>Sugar percentile: ${(d.sugarPercent * 100).toFixed(0)}%</div>`
              );
          })
          .on("mousemove", event => {
            tooltip
              .style("left", `${event.clientX + 14}px`)
              .style("top", `${event.clientY + 14}px`);
          })
          .on("mouseleave", () => {
            tooltip.attr("hidden", true);
          })
          .on("click", (event, d) => {
            event.stopPropagation();
            state.selectedName = state.selectedName === d.name ? null : d.name;
            applyHighlights(nodesLayer.selectAll("circle.candy-circle"));
          }),
        update => update,
        exit => exit.remove()
      );

    circles
      .attr("r", d => d.r)
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);

    applyHighlights(circles);
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
    applyHighlights(nodesLayer.selectAll("circle.candy-circle"));
  });

  render();
});
