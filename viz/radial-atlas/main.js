const canvas = document.getElementById("chart");
const ctx = canvas.getContext("2d");
const tooltip = document.getElementById("tooltip");
const statusText = document.getElementById("status-text");
const resetBtn = document.getElementById("reset-btn");

let width = window.innerWidth;
let height = window.innerHeight;
const dpr = window.devicePixelRatio || 1;

function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

resizeCanvas();

const palette = [
  "#4f5bd5", "#7a49a5", "#a84a67", "#b56e38",
  "#7d9b3c", "#2d8a7b", "#3a6ea5", "#5c4d9c"
];
const colorScale = d3.scaleOrdinal(palette);

async function fetchTopics() {
  const res = await fetch("https://api.openalex.org/topics?per-page=200&sort=works_count:desc");
  if (!res.ok) {
    throw new Error(`HTTP error ${res.status}`);
  }
  const data = await res.json();
  if (!Array.isArray(data.results) || data.results.length === 0) {
    throw new Error("No data returned by the API.");
  }
  return data.results;
}

function buildHierarchyGraph(topics) {
  const rootMap = { name: "root", children: new Map() };

  topics.forEach(t => {
    const dName = t.domain?.display_name || "General";
    const fName = t.field?.display_name || "Interdisciplinary";
    const sName = t.subfield?.display_name || "Core Topics";
    const count = t.works_count || 0;

    if (!rootMap.children.has(dName)) {
      rootMap.children.set(dName, { name: dName, level: 0, domain: dName, children: new Map(), count: 0 });
    }
    const dNode = rootMap.children.get(dName);
    dNode.count += count;

    if (!dNode.children.has(fName)) {
      dNode.children.set(fName, { name: fName, level: 1, domain: dName, children: new Map(), count: 0 });
    }
    const fNode = dNode.children.get(fName);
    fNode.count += count;

    if (!fNode.children.has(sName)) {
      fNode.children.set(sName, { name: sName, level: 2, domain: dName, children: [], count: 0 });
    }
    const sNode = fNode.children.get(sName);
    sNode.count += count;

    sNode.children.push({
      name: t.display_name,
      level: 3,
      domain: dName,
      count
    });
  });

  function toArrayTree(node) {
    if (!node.children) return node;
    const arr = Array.isArray(node.children)
      ? node.children
      : Array.from(node.children.values()).map(toArrayTree);
    return { ...node, children: arr };
  }

  const hierarchy = d3.hierarchy(toArrayTree(rootMap))
    .sum(d => (d.children ? 0 : d.count))
    .sort((a, b) => b.value - a.value);

  const cx = width * 0.44;
  const cy = height * 0.50;
  const maxRadius = Math.min(width * 0.46, height * 0.44);

  const startAngle = -Math.PI * 0.72;
  const totalAngle = Math.PI * 1.52;

  const cluster = d3.cluster()
    .size([totalAngle, maxRadius])
    .separation((a, b) => (a.parent === b.parent ? 1 : 1.6));

  cluster(hierarchy);

  const ringRadii = {
    1: maxRadius * 0.34,
    2: maxRadius * 0.66,
    3: maxRadius * 0.98
  };

  const domains = hierarchy.children || [];
  colorScale.domain(domains.map(d => d.data.name));

  const radiusScale = d3.scaleSqrt()
    .domain(d3.extent(hierarchy.descendants().filter(d => d.depth > 0), d => d.value))
    .range([2.2, 22]);

  const nodes = [];
  const links = [];

  const labelAnchorX = cx - maxRadius * 0.52;
  const labelSpacing = 24;
  const startY = cy - ((domains.length - 1) * labelSpacing) / 2;

  domains.forEach((d, idx) => {
    d.xPos = labelAnchorX;
    d.yPos = startY + idx * labelSpacing;
    d.r = 5.5;
    d.domainName = d.data.name;
    d.label = d.data.name;
    d.isLabelNode = true;
    nodes.push(d);
  });

  hierarchy.descendants().forEach(d => {
    if (d.depth <= 1) return;
    const angle = startAngle + d.x;
    const rRing = ringRadii[d.depth - 1] || maxRadius;
    d.angle = angle;
    d.rRing = rRing;
    d.xPos = cx + Math.cos(angle) * rRing;
    d.yPos = cy + Math.sin(angle) * rRing;
    d.r = radiusScale(d.value);
    d.domainName = d.data.domain;
    d.label = d.data.name;
    nodes.push(d);
  });

  hierarchy.links().forEach(l => {
    if (l.source.depth === 0) return;
    links.push({
      source: l.source,
      target: l.target,
      domain: l.target.domainName
    });
  });

  return { nodes, links, domains, cx, cy, maxRadius, ringRadii };
}

let state = null;
let hoveredNode = null;
let selectedDomain = null;

function isNodeActive(node) {
  if (selectedDomain && node.domainName !== selectedDomain) return false;
  if (!hoveredNode) return true;
  if (node === hoveredNode) return true;
  return (
    hoveredNode.ancestors().includes(node) ||
    node.ancestors().includes(hoveredNode)
  );
}

function draw() {
  if (!state) return;
  const { nodes, links, domains, cx, cy, ringRadii } = state;

  ctx.clearRect(0, 0, width, height);

  Object.values(ringRadii).forEach(r => {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(0, 0, 0, 0.03)";
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  links.forEach(link => {
    const active = isNodeActive(link.source) && isNodeActive(link.target);
    const col = colorScale(link.domain);

    ctx.beginPath();
    ctx.moveTo(link.source.xPos, link.source.yPos);

    if (link.source.isLabelNode) {
      const cp1x = link.source.xPos + 75;
      const cp1y = link.source.yPos;
      const cp2x = cx + (link.target.xPos - cx) * 0.45;
      const cp2y = cy + (link.target.yPos - cy) * 0.45;
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, link.target.xPos, link.target.yPos);
    } else {
      const r1 = link.source.rRing;
      const r2 = link.target.rRing;
      const rMid = (r1 + r2) * 0.5;
      const cp1x = cx + Math.cos(link.source.angle) * rMid;
      const cp1y = cy + Math.sin(link.source.angle) * rMid;
      const cp2x = cx + Math.cos(link.target.angle) * rMid;
      const cp2y = cy + Math.sin(link.target.angle) * rMid;
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, link.target.xPos, link.target.yPos);
    }

    ctx.strokeStyle = col;
    if (hoveredNode || selectedDomain) {
      ctx.globalAlpha = active ? 0.55 : 0.03;
      ctx.lineWidth = active ? 1.4 : 0.7;
    } else {
      ctx.globalAlpha = link.source.isLabelNode ? 0.42 : 0.16;
      ctx.lineWidth = link.source.isLabelNode ? 1.3 : 0.9;
    }
    ctx.stroke();
  });

  nodes.forEach(n => {
    if (n.isLabelNode) return;
    const active = isNodeActive(n);
    ctx.beginPath();
    ctx.arc(n.xPos, n.yPos, n.r, 0, Math.PI * 2);
    ctx.fillStyle = colorScale(n.domainName);
    ctx.globalAlpha = (hoveredNode || selectedDomain)
      ? (active ? 0.88 : 0.08)
      : 0.82;
    ctx.fill();

    if (n === hoveredNode) {
      ctx.globalAlpha = 1;
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#111";
      ctx.stroke();
    }
  });

  ctx.font = "500 12px Inter, system-ui, sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";

  domains.forEach(d => {
    const active = !selectedDomain || selectedDomain === d.domainName;
    ctx.globalAlpha = active ? 1 : 0.3;
    ctx.fillStyle = selectedDomain === d.domainName ? colorScale(d.domainName) : "#555";
    ctx.fillText(d.label, d.xPos - 10, d.yPos);

    ctx.beginPath();
    ctx.arc(d.xPos, d.yPos, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = colorScale(d.domainName);
    ctx.fill();
  });

  ctx.globalAlpha = 1;
}

function findNodeAt(mx, my) {
  if (!state) return null;
  for (const d of state.domains) {
    if (mx >= d.xPos - 210 && mx <= d.xPos + 8 && Math.abs(my - d.yPos) <= 10) {
      return d;
    }
  }
  let closest = null;
  let minDist = Infinity;
  for (const n of state.nodes) {
    if (n.isLabelNode) continue;
    const dist = Math.hypot(n.xPos - mx, n.yPos - my);
    if (dist <= Math.max(n.r + 3, 6) && dist < minDist) {
      minDist = dist;
      closest = n;
    }
  }
  return closest;
}

const levelNames = {
  1: "Domain",
  2: "Field",
  3: "Subfield",
  4: "Topic"
};

canvas.addEventListener("mousemove", e => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  const hit = findNodeAt(mx, my);
  if (hit !== hoveredNode) {
    hoveredNode = hit;
    draw();
  }

  if (hit) {
    canvas.style.cursor = "pointer";
    tooltip.style.opacity = 1;
    tooltip.style.left = Math.min(e.clientX + 14, width - 260) + "px";
    tooltip.style.top = Math.min(e.clientY + 14, height - 90) + "px";
    tooltip.innerHTML = `
      <div class="sub">${levelNames[hit.depth] || "Category"} • ${hit.domainName}</div>
      <strong>${hit.label}</strong><br/>
      <span class="sub">Publications: ${Math.round(hit.value).toLocaleString("en-US")}</span>
    `;
  } else {
    canvas.style.cursor = "default";
    tooltip.style.opacity = 0;
  }
});

canvas.addEventListener("click", () => {
  if (hoveredNode) {
    selectedDomain =
      selectedDomain === hoveredNode.domainName ? null : hoveredNode.domainName;
    resetBtn.classList.toggle("visible", Boolean(selectedDomain));
    draw();
  }
});

resetBtn.addEventListener("click", () => {
  selectedDomain = null;
  resetBtn.classList.remove("visible");
  draw();
});

let rawTopics = [];

fetchTopics()
  .then(topics => {
    rawTopics = topics;
    state = buildHierarchyGraph(rawTopics);
    statusText.innerHTML = `
      <strong>Source:</strong> OpenAlex API (${topics.length} top topics).<br/>
      <strong>Interaction:</strong> Hover to trace branches or click to filter a domain.
    `;
    draw();
  })
  .catch(err => {
    statusText.innerHTML = `<strong>Failed to load data from OpenAlex API:</strong> ${err.message}`;
  });

window.addEventListener("resize", () => {
  resizeCanvas();
  if (rawTopics.length) {
    state = buildHierarchyGraph(rawTopics);
    draw();
  }
});
