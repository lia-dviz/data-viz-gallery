export const dashboardData = {
    title: "Reading Analytics",
    legend: {
      result: "2025 result",
      goal: "2026 goal"
    },
    bulletCharts: [
      {
        id: "books_read",
        title: "BOOKS READ / YEAR",
        unit: "books",
        current: 64,
        goal: 75,
        ranges: [
          { label: "Bad", max: 20, color: "#f0f0f0" },
          { label: "Acceptable", max: 50, color: "#e4e4e4" },
          { label: "Good", max: 90, color: "#d8d8d8" }
        ],
        ticks: [0, 20, 40, 60, 80, 100]
      },
      {
        id: "daily_pages",
        title: "AVG PAGES / DAY",
        unit: "pages",
        current: 20,
        goal: 35,
        ranges: [
          { label: "Bad", max: 15, color: "#f0f0f0" },
          { label: "Acceptable", max: 30, color: "#e4e4e4" },
          { label: "Good", max: 50, color: "#d8d8d8" }
        ],
        ticks: [0, 10, 20, 30, 40, 50]
      },
      {
        id: "reading_hours",
        title: "AVG READING HOURS / WEEK",
        unit: "hrs",
        current: 4.6,
        goal: 8.0,
        ranges: [
          { label: "Bad", max: 3.0, color: "#f0f0f0" },
          { label: "Acceptable", max: 6.0, color: "#e4e4e4" },
          { label: "Good", max: 10.0, color: "#d8d8d8" }
        ],
        ticks: [0, 2, 4, 6, 8, 10]
      }
    ],
    scatterPlot: {
      title: "BOOK LENGTH VS DAYS TO FINISH",
      xUnit: "pages",
      yUnit: "days",
      points: [
        // --- DESTAQUES (Highlights) ---
        { id: 1, distance: 40, speed: 1, label: "Fastest read", highlight: true },
        { id: 2, distance: 720, speed: 18, label: "Fastest thick book", highlight: true },
        { id: 3, distance: 310, speed: 15, label: "Average book", highlight: true },
        { id: 4, distance: 100, speed: 28, label: "Reading slump book", highlight: true },
  
        // --- CLUSTER 1: 20 pontos (Foco em 100 páginas) ---
        { id: 5, distance: 98, speed: 4 },   { id: 6, distance: 100, speed: 5 },
        { id: 7, distance: 100, speed: 10 }, { id: 8, distance: 95, speed: 10 },
        { id: 9, distance: 98, speed: 9 },   { id: 10, distance: 99, speed: 11 },
        { id: 11, distance: 100, speed: 10 },{ id: 12, distance: 97, speed: 10 },
        { id: 13, distance: 96, speed: 9 },  { id: 14, distance: 100, speed: 10 },
        { id: 15, distance: 99, speed: 10 }, { id: 16, distance: 98, speed: 11 },
        { id: 17, distance: 100, speed: 9 }, { id: 18, distance: 95, speed: 10 },
        { id: 19, distance: 100, speed: 10 },{ id: 20, distance: 94, speed: 10 },
        { id: 21, distance: 99, speed: 9 },  { id: 22, distance: 97, speed: 11 },
        { id: 23, distance: 100, speed: 10 },{ id: 24, distance: 98, speed: 10 },
  
        // --- CLUSTER 2: 30 pontos (~300 páginas em ~20 dias, variação 12–20 dias) ---
        { id: 25, distance: 270, speed: 12 }, { id: 26, distance: 275, speed: 14 },
        { id: 27, distance: 280, speed: 13 }, { id: 28, distance: 285, speed: 15 },
        { id: 29, distance: 290, speed: 14 }, { id: 30, distance: 292, speed: 16 },
        { id: 31, distance: 295, speed: 15 }, { id: 32, distance: 298, speed: 17 },
        { id: 33, distance: 300, speed: 16 }, { id: 34, distance: 302, speed: 18 },
        { id: 35, distance: 305, speed: 17 }, { id: 36, distance: 308, speed: 19 },
        { id: 37, distance: 310, speed: 18 }, { id: 38, distance: 312, speed: 20 },
        { id: 39, distance: 315, speed: 19 }, { id: 40, distance: 318, speed: 16 },
        { id: 41, distance: 320, speed: 20 }, { id: 42, distance: 325, speed: 17 },
        { id: 43, distance: 280, speed: 18 }, { id: 44, distance: 285, speed: 19 },
        { id: 45, distance: 290, speed: 20 }, { id: 46, distance: 295, speed: 13 },
        { id: 47, distance: 300, speed: 14 }, { id: 48, distance: 305, speed: 15 },
        { id: 49, distance: 310, speed: 13 }, { id: 50, distance: 315, speed: 14 },
        { id: 51, distance: 320, speed: 15 }, { id: 52, distance: 325, speed: 18 },
        { id: 53, distance: 290, speed: 17 }, { id: 54, distance: 300, speed: 19 },
  
        // --- CLUSTER 3: 10 pontos (~700 páginas em até 25 dias) ---
        { id: 55, distance: 660, speed: 20 }, { id: 56, distance: 670, speed: 21 },
        { id: 57, distance: 680, speed: 22 }, { id: 58, distance: 690, speed: 21 },
        { id: 59, distance: 700, speed: 23 }, { id: 60, distance: 710, speed: 22 },
        { id: 61, distance: 720, speed: 24 }, { id: 62, distance: 730, speed: 23 },
        { id: 63, distance: 740, speed: 25 }, { id: 64, distance: 685, speed: 24 }
      ]
    }
  };
  