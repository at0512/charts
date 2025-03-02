import { Component } from '@angular/core';
import 'chartjs-adapter-date-fns';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'gantt_chart_app';
  chartHeight: number = 400; // Default height
  chartData: any;
  chartOptions: any;

  // Original data with hierarchical structure
  originalData = [
    {
      section: 'Strategy',
      tasks: [
        { x: ['2022-10-01', '2022-10-03'], y: 'Goals', name: 'John', completion: 80, status: 'Completed' },
        { x: ['2022-10-04', '2022-10-06'], y: 'Target Audience', name: 'Alice', completion: 50, status: 'Pending' },
        { x: ['2022-10-07', '2022-10-08'], y: 'Terms of Reference', name: 'Bob', completion: 30, status: 'Delayed' }
      ]
    },
    {
      section: 'Design',
      tasks: [
        { x: ['2022-10-01', '2022-10-12'], y: 'User Experience', name: 'Eve', completion: 90, status: 'Completed' },
        { x: ['2022-10-13', '2022-10-15'], y: 'User Interface', name: 'Charlie', completion: 60, status: 'Pending' },
        { x: ['2022-10-16', '2022-10-18'], y: 'Icons Pack', name: 'Diana', completion: 70, status: 'Delayed' },
        { x: ['2022-10-19', '2022-10-20'], y: 'Style Guide', name: 'Eve', completion: 90, status: 'Completed' }
      ]
    },
    {
      section: 'Testing',
      tasks: [
        { x: ['2022-10-02', '2022-10-05'], y: 'User Experience Testing', name: 'Eve', completion: 90, status: 'Completed' },
        { x: ['2022-10-06', '2022-10-08'], y: 'Functional Testing', name: 'Charlie', completion: 60, status: 'Pending' }
      ]
    }
  ];

  constructor() {
    // Initialize chart with all data
    this.updateChartData(this.originalData);
  }
  
  generateDateRange(minDate: Date, maxDate: Date): Date[] {
    const dates = [];
    let currentDate = new Date(minDate);
    while (currentDate <= maxDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  }

 

  // Method to update chart data
  updateChartData(data: any[]) {
    const flattenedData = data.flatMap(section => section.tasks.map((task: { x: string[]; }) => ({
      ...task,
      x: task.x.map((date: string) => new Date(date + "T00:00:00Z")) // Convert string dates to Date objects
    })));
   
    const allDates = flattenedData.flatMap(task => task.x);

// Find the minimum and maximum dates
var minDate = new Date(Math.min(...allDates.map(date => date.getTime())));
minDate.setDate(minDate.getDate() - 1);
minDate.setUTCHours(0, 0, 0, 0);
var maxDate = new Date(Math.max(...allDates.map(date => date.getTime())));
maxDate.setUTCHours(23, 59, 59, 999); 

console.log("Min Date (UTC):", minDate.toISOString());
console.log("Max Date (UTC):", maxDate.toISOString());
console.log("Min Date:", minDate);
console.log("Max Date:", maxDate);



    this.chartData = {
      datasets: [
        {
          label: 'Tasks',
          data: flattenedData,
          backgroundColor: (context: any) => {
            const status = context.dataset.data[context.dataIndex].status;
            switch (status) {
              case 'Completed':
                return 'rgba(75, 192, 192, 0.5)'; // Green
              case 'Pending':
                return 'rgba(255, 206, 86, 0.5)'; // Yellow
              case 'Delayed':
                return 'rgba(255, 99, 132, 0.5)'; // Red
              default:
                return 'rgba(54, 162, 235, 0.5)'; // Blue
            }
          },
          borderColor: (context: any) => {
            const status = context.dataset.data[context.dataIndex].status;
            switch (status) {
              case 'Completed':
                return 'rgba(75, 192, 192, 1)'; // Green
              case 'Pending':
                return 'rgba(255, 206, 86, 1)'; // Yellow
              case 'Delayed':
                return 'rgba(255, 99, 132, 1)'; // Red
              default:
                return 'rgba(54, 162, 235, 1)'; // Blue
            }
          },
          borderWidth: 1,
          borderSkipped: false,
          borderRadius: 10,
          barThickness: 30, // Set a fixed bar width (in pixels)
          categoryPercentage: 0.8, // Reduce the space between categories
          barPercentage: 0.9, // Reduce the space between bars within a category
        }
      ]
    };

    this.chartOptions = {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          top: 50, // Increased top padding to make space for month and year labels
          bottom: 0,
          left: 50, // Increased left padding to ensure the first date is visible
          right: 10
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const data = context.dataset.data[context.dataIndex];
              return `${data.name}: ${data.y} (${data.completion}% completed, Status: ${data.status})`;
            }
          }
        },
      },
      scales: {
        x: {
          position: 'top',
          type: 'time',
        
    
          time: {
            unit: 'day',
            
            displayFormats: {
              day: 'd EEE' // Example: "1 T" (date + first letter of weekday)
            },
            tooltipFormat: 'd MMM (EEE)'
          },
          min: minDate.toISOString(), // Set min date based on data
          max: maxDate.toISOString(), // Set max date based on data
 
          grid: {
          display:true,
            color: (context: any) => {
              const date = new Date(context.tick.value);
              return date.getDate() === 1 ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.1)';
            }
          },
          ticks: {
            size: 10,
            autoSkip: false,  // Ensure every date is displayed
            sampleSize: 100,  // Process more tick labels
            
        
            source: 'auto',   // Use actual data for ticks
            maxRotation: 0,   // Keep labels horizontal
            minRotation: 0,
            
            padding: 0,      // Avoid text clipping
            callback: (value: any) => {
              const date = new Date(value);
              //const day = date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0); // First letter of day
              return `${date.getDate()} ${date.toLocaleString('default', { weekday: 'short' }).charAt(0)}`; // Example: "1 T"
            },
          }                    
        },
        y: {
          stacked: true,
          grid: {
            display: false // Remove grid lines
          },
          ticks: {
            autoSkip: false, // Ensures all labels are displayed
            maxRotation: 0,
            minRotation: 0,
            callback: (value: any, index: number, values: any) => {
              const data = this.chartData.datasets[0].data[index];
              return data.y; // Display task name on y-axis
            }
          }
        }
      }
    };

    // Register the custom plugin
    Chart.register({
      id: 'xAxisTwoRows',
      afterDraw: (chart) => {
        const ctx = chart.ctx;
        const xAxis = chart.scales['x'];
        const yAxis = chart.scales['y'];
    
        if (!xAxis || !yAxis) return;
    
        const firstTick = xAxis.ticks[0];
        const lastTick = xAxis.ticks[xAxis.ticks.length - 1];
        const firstDate = new Date(firstTick.value);
        const lastDate = new Date(lastTick.value);
    
        let currentDate = new Date(firstDate);
        currentDate.setDate(1);
    
        ctx.textAlign = 'center'; // Centered alignment for better visibility
        ctx.fillStyle = 'black';
        ctx.font = '14px Arial';
       
    
        while (currentDate <= lastDate) {
          const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
          const monthStartTimestamp = monthStart.getTime();
          const startPixel = xAxis.getPixelForValue(monthStartTimestamp);

    
          if (startPixel >= xAxis.left - 30 && startPixel <= xAxis.right) { // Extend left padding
            ctx.fillText(
              monthStart.toLocaleString('default', { month: 'short', year: 'numeric' }),
              startPixel + 20,
              yAxis.top - 35 // Position above the x-axis
            );
          }
    
          currentDate.setMonth(currentDate.getMonth() + 1);
        }
      }
    });
  }

  // Helper method to get the minimum date from data
  getMinDate(data: any[]) {
    return data.reduce((min, task) => (task.x[0] < min ? task.x[0] : min), data[0].x[0]);
  }

  // Helper method to get the maximum date from data
  getMaxDate(data: any[]) {
    return data.reduce((max, task) => (task.x[1] > max ? task.x[1] : max), data[0].x[1]);
  }
  
}