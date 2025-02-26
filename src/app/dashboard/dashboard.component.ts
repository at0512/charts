import { Component } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  tableData: any[] = [
    { x: ['2022-10-01', '2022-10-08'], y: 'Task 1', name: 'John', completion: 80, status: 'Completed' },
    { x: ['2022-10-02', '2022-10-06'], y: 'Task 2', name: 'Alice', completion: 50, status: 'Pending' },
    { x: ['2022-10-04', '2022-10-08'], y: 'Task 3', name: 'Bob', completion: 30, status: 'Delayed' },
  ];

  editedRow: number | null = null;
  editedField: string | null = null;

  constructor(private dataService: DataService) {}

  // Enable editing for a specific cell
  editCell(rowIndex: number, field: string) {
    this.editedRow = rowIndex;
    this.editedField = field;
  }

  // Save changes and disable editing
  saveChanges() {
    this.editedRow = null;
    this.editedField = null;
  }

  // Add a new row
  addRow() {
    this.tableData.push({ x: ['', ''], y: '', name: '', completion: 0, status: '' });
  }

  // Update the chart only when the button is clicked
  updateChart() {
    this.dataService.setData(this.tableData);
    
  }
}