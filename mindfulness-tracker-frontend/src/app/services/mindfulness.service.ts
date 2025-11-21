import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MindfulnessEntry {
  _id?: string;
  date: Date;
  hour: number;
  presentPercentage: number;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DailySummary {
  _id: string;
  averagePresent: number;
  entryCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class MindfulnessService {
  private apiUrl = 'http://localhost:3000/api/mindfulness';

  constructor(private http: HttpClient) { }

  // Create or update an entry
  createOrUpdateEntry(entry: MindfulnessEntry): Observable<any> {
    // Convert Date to string for transmission
    const payload = {
      ...entry,
      date: entry.date instanceof Date ? entry.date.toISOString().split('T')[0] : entry.date
    };
    return this.http.post(`${this.apiUrl}/entry`, payload);
  }

  // Get entries for a specific date
  getEntriesByDate(date: Date): Observable<any> {
    const dateString = date.toISOString().split('T')[0];
    let params = new HttpParams().set('date', dateString);
    return this.http.get(`${this.apiUrl}/entries-by-date`, { params });
  }

  // Get entries for a date range
  getEntriesByDateRange(startDate: Date, endDate: Date): Observable<any> {
    const startString = startDate.toISOString().split('T')[0];
    const endString = endDate.toISOString().split('T')[0];
    let params = new HttpParams()
      .set('startDate', startString)
      .set('endDate', endString);
    return this.http.get(`${this.apiUrl}/entries-by-range`, { params });
  }

  // Get daily summary
  getDailySummary(startDate: Date, endDate: Date): Observable<any> {
    const startString = startDate.toISOString().split('T')[0];
    const endString = endDate.toISOString().split('T')[0];
    let params = new HttpParams()
      .set('startDate', startString)
      .set('endDate', endString);
    return this.http.get(`${this.apiUrl}/daily-summary`, { params });
  }

  // Get hourly breakdown for a specific date
  getHourlyBreakdown(date: Date): Observable<any> {
    const dateString = date.toISOString().split('T')[0];
    let params = new HttpParams().set('date', dateString);
    return this.http.get(`${this.apiUrl}/hourly-breakdown`, { params });
  }

  // Delete an entry
  deleteEntry(date: Date, hour: number): Observable<any> {
    const dateString = date.toISOString().split('T')[0];
    let params = new HttpParams()
      .set('date', dateString)
      .set('hour', hour.toString());
    return this.http.delete(`${this.apiUrl}/entry`, { params });
  }

  // Get all entries
  getAllEntries(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
  }

  // Check backend health
  checkHealth(): Observable<any> {
    return this.http.get('http://localhost:3000/api/health');
  }
}
