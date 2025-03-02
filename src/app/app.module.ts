import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ChartModule } from 'primeng/chart';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GanttChartComponent } from './gantt-chart/gantt-chart.component';
import { TableModule } from 'primeng/table'; 
import { ProgressBarModule } from 'primeng/progressbar';



@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    GanttChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    ChartModule,
    BrowserAnimationsModule,
    FormsModule,
    CalendarModule,
    DropdownModule, 
    TableModule,
    ProgressBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
