import { Component } from '@angular/core';
import 'chartjs-adapter-date-fns';


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

  // Original data (unfiltered)
  originalData = [
    { x: ['2022-10-01', '2022-10-08'], y: 'Task 1', name: 'John', completion: 80, status: 'Completed' },
    { x: ['2022-10-02', '2022-10-06'], y: 'Task 2', name: 'Alice', completion: 50, status: 'Pending' },
    { x: ['2022-10-04', '2022-10-08'], y: 'Task 3', name: 'Bob', completion: 30, status: 'Delayed' },
    { x: ['2022-11-10', '2022-11-15'], y: 'Task 4', name: 'Eve', completion: 90, status: 'Completed' },
    { x: ['2022-11-15', '2022-11-22'], y: 'Task 5', name: 'Charlie', completion: 60, status: 'Pending' },
    { x: ['2022-12-08', '2022-12-12'], y: 'Task 6', name: 'Diana', completion: 70, status: 'Delayed' },
    { x: ['2022-10-10', '2022-10-15'], y: 'Task 7', name: 'Eve', completion: 90, status: 'Completed' },
    { x: ['2022-10-15', '2022-10-22'], y: 'Task 8', name: 'Charlie', completion: 60, status: 'Pending' },
    { x: ['2022-10-22', '2022-10-28'], y: 'Task 9', name: 'Diana', completion: 70, status: 'Delayed' },
  ];

  constructor() {
    // Initialize chart with data for October 2022
    const initialMonth = '2022-10'; // Set the initial month
    const initialData = this.filterDataByMonth(initialMonth);
    this.updateChartData(initialData);
  }

  // Method to filter data by month
  filterDataByMonth(month: string) {
    return this.originalData.filter((task) => {
      const taskStartDate = task.x[0]; // e.g., "2022-10-01"
      return taskStartDate.startsWith(month);
    });
  }

  // Method to update chart data
  updateChartData(filteredData: any[]) {
    this.chartData = {
      datasets: [
        {
          label: 'Tasks',
          data: filteredData,
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
          borderRadius: 6,
          barThickness: 30, // Set a fixed bar width (in pixels)
        }
      ]
    };
  
    this.chartOptions = {
      indexAxis: 'y', // Horizontal bar chart
      responsive: true,
      maintainAspectRatio: false, // Allows custom height
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
        }
      },
      scales: {
        x: {
          position: 'top',
          type: 'time', // Use time scale for the x-axis
          time: {
            unit: 'day', // Display by day
            displayFormats: {
              day: 'MMM d' // Format as "Jun 5", "Jun 6", etc.
            },
            tooltipFormat: 'MMM d', // Format tooltips similarly
          },
          min: this.getMinDate(filteredData), // Set min date based on filtered data
          max: this.getMaxDate(filteredData), // Set max date based on filtered data
          ticks: {
            autoSkip: false, // Ensure all dates are displayed
            maxRotation: 0, // Prevent rotation of labels
            minRotation: 0,
          }
        },
        y: {
          ticks: {
            autoSkip: false, // Ensures all labels are displayed
            maxRotation: 0,
            minRotation: 0,
            callback: (value: any, index: number, values: any) => {
              const data = this.chartData.datasets[0].data[index];
              return `${data.name} - ${data.y} (${data.status})`; // Display name, task, and status
            }
          }
        }
      }
    };
  }

  // Method to handle month selection
  onMonthChange(event: any) {
    const selectedMonth = event.target.value; // e.g., "2022-10"
    const filteredData = this.filterDataByMonth(selectedMonth);
    this.updateChartData(filteredData);
  }

  // Helper method to get the minimum date from filtered data
  getMinDate(data: any[]) {
    return data.reduce((min, task) => (task.x[0] < min ? task.x[0] : min), data[0].x[0]);
  }

  // Helper method to get the maximum date from filtered data
  getMaxDate(data: any[]) {
    return data.reduce((max, task) => (task.x[1] > max ? task.x[1] : max), data[0].x[1]);
  }
}