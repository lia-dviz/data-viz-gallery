import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

export const BulletChart = ({ data }) => {
  const svgRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    const margin = { top: 25, right: 20, bottom: 35, left: 10 };
    const width = 420 - margin.left - margin.right;
    const height = 110 - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const maxDomain = Math.max(data.ticks[data.ticks.length - 1], data.goal, data.current);

    const x = d3.scaleLinear()
      .domain([0, maxDomain])
      .range([0, width]);

    let prevMax = 0;
    data.ranges.forEach(range => {
      svg.append('rect')
        .attr('x', x(prevMax))
        .attr('y', 0)
        .attr('width', x(range.max) - x(prevMax))
        .attr('height', height)
        .attr('fill', range.color);

      svg.append('text')
        .attr('x', x(prevMax) + 2)
        .attr('y', -6)
        .attr('font-size', '10px')
        .attr('font-style', 'italic')
        .attr('font-weight', 'bold')
        .attr('fill', '#333')
        .text(range.label);

      prevMax = range.max;
    });

    const defs = svg.append('defs');
    const gradientId = `grad-${data.id}`;
    const gradient = defs.append('linearGradient')
      .attr('id', gradientId)
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '100%').attr('y2', '0%');

    gradient.append('stop').attr('offset', '0%').attr('stop-color', '#e3d2ff');
    gradient.append('stop').attr('offset', '100%').attr('stop-color', '#3542fc');

    const progressBar = svg.append('rect')
      .attr('x', 0)
      .attr('y', height * 0.2)
      .attr('width', x(data.current))
      .attr('height', height * 0.6)
      .attr('rx', 4)
      .attr('fill', `url(#${gradientId})`)
      .style('cursor', 'pointer')
      .style('transition', 'filter 0.2s');

    progressBar
      .on('mouseover', (event) => {
        d3.select(event.currentTarget).style('filter', 'brightness(1.15)');
        const pct = ((data.current / data.goal) * 100).toFixed(1);
        let status = 'Bad';
        if (data.current >= data.ranges[1].max) status = 'Good';
        else if (data.current >= data.ranges[0].max) status = 'Acceptable';

        setTooltip({
          x: event.clientX,
          y: event.clientY,
          content: `${data.current} ${data.unit} (${pct}% of goal: ${data.goal} ${data.unit}) - Status: ${status}`
        });
      })
      .on('mousemove', (event) => {
        setTooltip(prev => prev ? { ...prev, x: event.clientX, y: event.clientY } : null);
      })
      .on('mouseout', (event) => {
        d3.select(event.currentTarget).style('filter', 'none');
        setTooltip(null);
      });

    const goalMarker = svg.append('circle')
      .attr('cx', x(data.goal))
      .attr('cy', height / 2)
      .attr('r', 6)
      .attr('fill', 'none')
      .attr('stroke', '#111')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer');

    goalMarker
      .on('mouseover', (event) => {
        setTooltip({
          x: event.clientX,
          y: event.clientY,
          content: `Goal: ${data.goal} ${data.unit}`
        });
      })
      .on('mouseout', () => setTooltip(null));

    const xAxis = d3.axisBottom(x)
      .tickValues(data.ticks)
      .tickFormat(d => `${d} ${data.unit}`);

    const gX = svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis);

    gX.select('.domain').attr('stroke', '#bbb');
    gX.selectAll('.tick line').attr('stroke', '#bbb');
    gX.selectAll('.tick text')
      .attr('font-size', '9px')
      .attr('fill', '#333');

  }, [data]);

  return (
    <div style={{ marginBottom: '20px', position: 'relative' }}>
      <h4 style={{ margin: '0 0 5px 10px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {data.title}
      </h4>
      <div style={{ borderTop: '1px solid #111', width: '100%', marginBottom: '10px' }} />
      <svg ref={svgRef}></svg>
      {tooltip && (
        <div style={{
          position: 'fixed',
          top: tooltip.y - 35,
          left: tooltip.x + 10,
          backgroundColor: '#111',
          color: '#fff',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '11px',
          pointerEvents: 'none',
          zIndex: 1000,
          whiteSpace: 'nowrap'
        }}>
          {tooltip.content}
        </div>
      )}
    </div>
  );
};
