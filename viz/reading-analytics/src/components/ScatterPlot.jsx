import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

export const ScatterPlot = ({ data }) => {
  const svgRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!data || !svgRef.current) return;

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 450 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([0, 1000]).range([0, width]);
    const y = d3.scaleLinear().domain([0, 30]).range([height, 0]);

    const xTicks = [100, 300, 500, 700, 900];
    const yTicks = [5, 10, 15, 20, 25, 30];

    xTicks.forEach(t => {
      svg.append('line')
        .attr('x1', x(t)).attr('x2', x(t))
        .attr('y1', 0).attr('y2', height)
        .attr('stroke', '#ccc')
        .attr('stroke-dasharray', '2,2');
    });

    yTicks.forEach(t => {
      svg.append('line')
        .attr('x1', 0).attr('x2', width)
        .attr('y1', y(t)).attr('y2', y(t))
        .attr('stroke', '#ccc')
        .attr('stroke-dasharray', '2,2');
    });

    const xAxis = d3.axisBottom(x).tickValues(xTicks).tickFormat(d => `${d} ${data.xUnit}`);
    const yAxis = d3.axisLeft(y).tickValues(yTicks).tickFormat(d => `${d} ${data.yUnit}`);

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis)
      .select('.domain').remove();

    svg.append('g')
      .call(yAxis)
      .select('.domain').remove();

    svg.selectAll('.tick line').remove();

    const visiblePoints = data.points.filter(p => filter === 'all' || (filter === 'highlights' && p.highlight));

    visiblePoints.forEach(p => {
      const circle = svg.append('circle')
        .attr('cx', x(p.distance))
        .attr('cy', y(p.speed))
        .attr('r', p.highlight ? 6 : 4)
        .attr('fill', '#858cf5')
        .attr('opacity', p.highlight ? 1 : 0.6)
        .attr('stroke', p.highlight ? '#111' : 'none')
        .attr('stroke-width', p.highlight ? 1.5 : 0)
        .style('cursor', 'pointer')
        .style('transition', 'transform 0.2s, r 0.2s');

      circle
        .on('mouseover', (event) => {
          d3.select(event.currentTarget)
            .attr('r', p.highlight ? 9 : 7)
            .attr('opacity', 1);

          setTooltip({
            x: event.clientX,
            y: event.clientY,
            content: `${p.label ? p.label + ': ' : ''}${p.distance} ${data.xUnit} | Read in ${p.speed} ${data.yUnit}`
          });
        })
        .on('mousemove', (event) => {
          setTooltip(prev => prev ? { ...prev, x: event.clientX, y: event.clientY } : null);
        })
        .on('mouseout', (event) => {
          d3.select(event.currentTarget)
            .attr('r', p.highlight ? 6 : 4)
            .attr('opacity', p.highlight ? 1 : 0.6);
          setTooltip(null);
        });

      if (p.highlight) {
        const text = svg.append('text')
          .attr('x', x(p.distance))
          .attr('y', y(p.speed) - 10)
          .attr('text-anchor', 'middle')
          .attr('font-size', '9px')
          .attr('font-style', 'italic')
          .attr('font-weight', 'bold')
          .style('pointer-events', 'none');

        const lines = p.label.split(' ');
        if (lines.length > 1) {
          text.append('tspan').attr('x', x(p.distance)).attr('dy', '-0.3em').text(lines[0]);
          text.append('tspan').attr('x', x(p.distance)).attr('dy', '1em').text(lines.slice(1).join(' '));
        } else {
          text.text(p.label);
        }
      }
    });

  }, [data, filter]);

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
        <h4 style={{ margin: 0, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {data.title}
        </h4>
        <div style={{ display: 'flex', gap: '5px' }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              fontSize: '9px',
              padding: '2px 6px',
              border: '1px solid #111',
              backgroundColor: filter === 'all' ? '#111' : '#fff',
              color: filter === 'all' ? '#fff' : '#111',
              borderRadius: '0px',
              cursor: 'pointer'
            }}
          >
            All
          </button>
          <button
            onClick={() => setFilter('highlights')}
            style={{
              fontSize: '9px',
              padding: '2px 6px',
              border: '1px solid #111',
              backgroundColor: filter === 'highlights' ? '#111' : '#fff',
              color: filter === 'highlights' ? '#fff' : '#111',
              borderRadius: '0px',
              cursor: 'pointer'
            }}
          >
            Highlights
          </button>
        </div>
      </div>
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
