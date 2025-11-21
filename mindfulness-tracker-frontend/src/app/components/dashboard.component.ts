import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MindfulnessService, DailySummary } from '../services/mindfulness.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  selectedDate: string = '';
  selectedRange: string = '7days';
  maxDate: string = '';
  
  hourlyData: any[] = [];
  dailyData: DailySummary[] = [];
  todayAverage: number = 0;
  weekAverage: number = 0;
  entryCountToday: number = 0;
  isLoading = false;
  hoveredPoint: any = null;
  chartType: 'hourly' | 'daily' = 'daily'; // Track chart type

  constructor(private mindfulnessService: MindfulnessService) {
    // Initialize with today's date using local time (not UTC)
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    this.selectedDate = `${year}-${month}-${day}`;
    this.maxDate = this.selectedDate;
  }

  ngOnInit(): void {
    // If viewing today, show hourly chart by default
    this.chartType = 'hourly';
    this.selectedRange = 'today';
    this.loadTodayData();
  }

  loadTodayData(): void {
    this.isLoading = true;
    const date = new Date(this.selectedDate);
    
    this.mindfulnessService.getHourlyBreakdown(date).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.hourlyData = response.data;
        this.calculateTodayAverage();
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('Error loading today data:', error);
      }
    });
  }

  loadWeeklyData(): void {
    this.isLoading = true;
    const endDate = new Date();
    const startDate = new Date();
    
    if (this.selectedRange === '7days') {
      startDate.setDate(endDate.getDate() - 7);
    } else if (this.selectedRange === '30days') {
      startDate.setDate(endDate.getDate() - 30);
    } else if (this.selectedRange === '3months') {
      startDate.setMonth(endDate.getMonth() - 3);
    } else if (this.selectedRange === '6months') {
      startDate.setMonth(endDate.getMonth() - 6);
    } else if (this.selectedRange === '1year') {
      startDate.setFullYear(endDate.getFullYear() - 1);
    }

    this.mindfulnessService.getDailySummary(startDate, endDate).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.dailyData = response.data;
        this.calculateWeekAverage();
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('Error loading weekly data:', error);
      }
    });
  }

  calculateTodayAverage(): void {
    // Filter out sleeping hours (0-9 and 23) and entries with no data
    const entries = this.hourlyData.filter(h => h.presentPercentage !== null && h.hour >= 10 && h.hour < 23);
    const total = entries.reduce((sum, h) => sum + h.presentPercentage, 0);
    this.entryCountToday = entries.length;
    this.todayAverage = entries.length > 0 ? Math.round((total / entries.length) * 10) / 10 : 0;
  }

  calculateWeekAverage(): void {
    const total = this.dailyData.reduce((sum, d) => sum + d.averagePresent, 0);
    this.weekAverage = this.dailyData.length > 0 ? Math.round((total / this.dailyData.length) * 10) / 10 : 0;
  }

  onDateChange(): void {
    // Check if selected date is today
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const todayStr = String(today.getDate()).padStart(2, '0');
    const todayDate = `${year}-${month}-${todayStr}`;
    
    if (this.selectedDate === todayDate) {
      this.chartType = 'hourly';
      this.loadTodayData();
    } else {
      this.chartType = 'daily';
      // Load single day summary
      const selectedDateObj = new Date(this.selectedDate);
      const endDate = new Date(selectedDateObj);
      endDate.setDate(endDate.getDate() + 1);
      this.mindfulnessService.getDailySummary(selectedDateObj, endDate).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.dailyData = response.data;
          this.calculateWeekAverage();
        },
        error: (error: any) => {
          this.isLoading = false;
          console.error('Error loading data:', error);
        }
      });
    }
  }

  onRangeChange(): void {
    // Show daily data for ranges, hourly for today
    if (this.selectedRange === 'today') {
      this.chartType = 'hourly';
      this.loadTodayData();
    } else if (this.selectedRange === '7days' || this.selectedRange === '30days' || 
               this.selectedRange === '3months' || this.selectedRange === '6months' || 
               this.selectedRange === '1year') {
      this.chartType = 'daily';
      this.loadWeeklyData();
    }
  }

  formatHour(hour: number): string {
    return String(hour).padStart(2, '0');
  }

  getProgressBar(percentage: number): string {
    const filled = Math.round(percentage / 5);
    return '█'.repeat(filled) + '░'.repeat(20 - filled);
  }

  // Generate chart points as a string for the polyline
  getChartPoints(): string {
    if (this.dailyData.length === 0) return '';
    
    const points = this.getChartPointsArray();
    return points.map(p => `${p.x},${p.y}`).join(' ');
  }

  // Generate array of chart points with coordinates
  getChartPointsArray(): any[] {
    if (this.chartType === 'hourly') {
      // Use hourly data for current day
      const wakingHours = this.hourlyData.filter(h => h.hour >= 10 && h.hour < 23);
      if (wakingHours.length === 0) return [];
      
      const chartWidth = 870;
      const chartHeight = 270;
      const pointSpacing = chartWidth / (wakingHours.length - 1 || 1);
      
      return wakingHours.map((hour, index) => {
        const x = 80 + (index * pointSpacing);
        const y = 320 - ((hour.presentPercentage / 100) * chartHeight);
        return {
          x,
          y,
          percentage: hour.presentPercentage,
          date: `${this.formatHour(hour.hour)}:00`
        };
      });
    } else {
      // Use daily data for ranges
      if (this.dailyData.length === 0) return [];
      
      const chartWidth = 870;
      const chartHeight = 270;
      const pointSpacing = chartWidth / (this.dailyData.length - 1 || 1);
      
      return this.dailyData.map((day, index) => {
        const x = 80 + (index * pointSpacing);
        const y = 320 - ((day.averagePresent / 100) * chartHeight);
        return {
          x,
          y,
          percentage: Math.round(day.averagePresent * 10) / 10,
          date: day._id
        };
      });
    }
  }

  // Generate labels for x-axis
  getChartLabels(): any[] {
    if (this.chartType === 'hourly') {
      const wakingHours = this.hourlyData.filter(h => h.hour >= 10 && h.hour < 23);
      if (wakingHours.length === 0) return [];
      
      const chartWidth = 870;
      const pointSpacing = chartWidth / (wakingHours.length - 1 || 1);
      const step = Math.max(1, Math.ceil(wakingHours.length / 5));
      
      return wakingHours
        .map((hour, index) => ({
          x: 80 + (index * pointSpacing),
          text: `${this.formatHour(hour.hour)}:00`,
          index
        }))
        .filter(label => label.index % step === 0);
    } else {
      if (this.dailyData.length === 0) return [];
      
      const chartWidth = 870;
      const pointSpacing = chartWidth / (this.dailyData.length - 1 || 1);
      const step = Math.ceil(this.dailyData.length / 5);
      
      return this.dailyData
        .map((day, index) => ({
          x: 80 + (index * pointSpacing),
          text: day._id,
          index
        }))
        .filter(label => label.index % step === 0);
    }
  }
}
