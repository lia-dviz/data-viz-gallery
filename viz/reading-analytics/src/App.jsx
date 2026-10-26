import React from 'react';
import { dashboardData } from './data/mockData';
import { BulletChart } from './components/BulletChart';
import { ScatterPlot } from './components/ScatterPlot';

export default function App() {
  return (
    <div style={{
      fontFamily: 'sans-serif',
      backgroundColor: '#ffffff',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '0px',
        padding: '10px 40px',
        border: '1px solid #e5e7eb',
        maxWidth: '950px',
        width: '100%'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <div style={{ fontSize: '11px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontWeight: 'bold' }}>{dashboardData.legend.result}</span>
              <div style={{
                width: '40px',
                height: '10px',
                borderRadius: '5px',
                background: 'linear-gradient(to right, #e3d2ff, #3542fc)'
              }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 'bold' }}>{dashboardData.legend.goal}</span>
              <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                border: '1.5px solid #111'
              }} />
            </div>
          </div>

          <h2 style={{
            margin: 0,
            fontSize: '20px',
            fontStyle: 'italic',
            fontWeight: '600',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}>
            {dashboardData.title}
          </h2>
          <div style={{ width: '100px' }} />
        </div>

        <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
          <div style={{ flex: '1' }}>
            {dashboardData.bulletCharts.map(chart => (
              <BulletChart key={chart.id} data={chart} />
            ))}
          </div>

          <div style={{ flex: '1' }}>
            <ScatterPlot data={dashboardData.scatterPlot} />
          </div>
        </div>

      </div>
    </div>
  );
}
