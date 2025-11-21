import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MindfulnessService } from '../services/mindfulness.service';

@Component({
  selector: 'app-input-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input-form.component.html',
  styleUrls: ['./input-form.component.css']
})
export class InputFormComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  maxDate: string; // Maximum date (today)

  // Only waking hours: 10 AM to 10 PM (hours 10-22)
  hours = Array.from({ length: 13 }, (_, i) => 10 + i);

  constructor(
    private fb: FormBuilder,
    private mindfulnessService: MindfulnessService
  ) {
    // Set max date to today using local time (not UTC)
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    this.maxDate = `${year}-${month}-${day}`;
  }

  ngOnInit(): void {
    // Get today's date using local time (not UTC)
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const todayStr = String(today.getDate()).padStart(2, '0');
    const todayDate = `${year}-${month}-${todayStr}`;
    
    let currentHour = today.getHours();
    // If current hour is in sleep time (0-9 or 23), default to 10
    if (currentHour < 10 || currentHour === 23) {
      currentHour = 10;
    }
    this.form = this.fb.group({
      date: [todayDate, Validators.required],
      hour: [currentHour.toString(), Validators.required],
      presentPercentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      notes: ['']
    });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.form.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly';
      return;
    }

    this.isLoading = true;

    // Check if backend is reachable
    this.mindfulnessService.checkHealth().subscribe({
      next: (response: any) => {
        // Backend is reachable, proceed with saving
        // MongoDB connection is optional - we have in-memory fallback
        const formValue = this.form.value;
        const entry = {
          date: new Date(formValue.date),
          hour: parseInt(formValue.hour),
          presentPercentage: parseInt(formValue.presentPercentage),
          notes: formValue.notes
        };

        this.mindfulnessService.createOrUpdateEntry(entry).subscribe({
          next: (response: any) => {
            this.isLoading = false;
            const storageType = response.storage || 'Database';
            this.successMessage = `Entry saved successfully! (${storageType})`;
            
            // Get today's date using local time
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const todayStr = String(today.getDate()).padStart(2, '0');
            const todayDate = `${year}-${month}-${todayStr}`;
            
            let currentHour = today.getHours();
            if (currentHour < 10 || currentHour === 23) {
              currentHour = 10;
            }
            this.form.reset({
              date: todayDate,
              hour: currentHour.toString(),
              presentPercentage: '',
              notes: ''
            });
            this.submitted = false;
            setTimeout(() => this.successMessage = '', 3000);
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = error.error?.message || 'Failed to save entry. Check console for details.';
            console.error('Error:', error);
          }
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Cannot connect to backend server. Is it running on port 3000?';
        console.error('Backend connection error:', error);
      }
    });
  }
}
