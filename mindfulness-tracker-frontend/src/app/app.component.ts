import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputFormComponent } from './components/input-form.component';
import { DashboardComponent } from './components/dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, InputFormComponent, DashboardComponent],
  template: `
    <div class="app-container" [class.dark-mode]="isDarkMode">
      <header class="app-header">
        <div class="header-content">
          <h1>🧘 Mindfulness Tracker</h1>
          <p>Track your presence throughout the day</p>
        </div>
        <button class="dark-mode-toggle" (click)="toggleDarkMode()" title="Toggle dark mode">
          {{ isDarkMode ? '☀️' : '🌙' }}
        </button>
      </header>

      <div class="app-content">
        <nav class="app-tabs">
          <button
            class="tab"
            [class.active]="activeTab === 'input'"
            (click)="activeTab = 'input'"
          >
            Log Presence
          </button>
          <button
            class="tab"
            [class.active]="activeTab === 'dashboard'"
            (click)="activeTab = 'dashboard'"
          >
            View Progress
          </button>
        </nav>

        <div class="tab-content">
          <app-input-form *ngIf="activeTab === 'input'"></app-input-form>
          <app-dashboard *ngIf="activeTab === 'dashboard'"></app-dashboard>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      --primary-bg: white;
      --primary-text: #333;
      --secondary-bg: #f5f5f5;
      --border-color: #ddd;
      --card-shadow: rgba(0, 0, 0, 0.1);
    }

    :host.dark-mode {
      --primary-bg: #1a1a1a;
      --primary-text: #e0e0e0;
      --secondary-bg: #2a2a2a;
      --border-color: #444;
      --card-shadow: rgba(0, 0, 0, 0.5);
    }

    .app-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      transition: background 0.3s ease;
    }

    .app-container.dark-mode {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    }

    .app-header {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      padding: 40px 20px;
      backdrop-filter: blur(10px);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-content {
      text-align: center;
      flex: 1;
    }

    .app-header h1 {
      margin: 0;
      font-size: 36px;
      margin-bottom: 8px;
    }

    .app-header p {
      margin: 0;
      font-size: 16px;
      opacity: 0.9;
    }

    .dark-mode-toggle {
      background: rgba(255, 255, 255, 0.2);
      border: 2px solid rgba(255, 255, 255, 0.3);
      color: white;
      padding: 10px 15px;
      border-radius: 50%;
      font-size: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .dark-mode-toggle:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.1);
    }

    .app-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .app-tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 20px;
    }

    .tab {
      padding: 12px 24px;
      border: none;
      background: rgba(255, 255, 255, 0.15);
      color: white;
      cursor: pointer;
      border-radius: 4px 4px 0 0;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.3s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .tab:hover {
      background: rgba(255, 255, 255, 0.25);
    }

    .tab.active {
      background: rgba(255, 255, 255, 0.9);
      color: #333;
    }

    .app-container.dark-mode .tab.active {
      background: rgba(255, 255, 255, 0.15);
      color: white;
      border-bottom: 3px solid #4caf50;
    }

    .tab-content {
      background: var(--primary-bg, white);
      color: var(--primary-text, #333);
      border-radius: 8px 8px 8px 8px;
      box-shadow: 0 4px 16px var(--card-shadow, rgba(0, 0, 0, 0.1));
      border: 1px solid var(--border-color, #ddd);
      padding: 20px;
      transition: all 0.3s ease;
    }

    .app-container.dark-mode .tab-content {
      background: #1a1a1a;
      color: #e0e0e0;
      border-color: #444;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
    }

    @media (max-width: 768px) {
      .app-header {
        flex-direction: column;
        gap: 20px;
      }

      .app-header h1 {
        font-size: 24px;
      }

      .app-header p {
        font-size: 14px;
      }

      .app-tabs {
        flex-direction: column;
      }

      .tab {
        border-radius: 4px;
        margin-bottom: 8px;
      }

      .tab-content {
        border-radius: 4px;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  activeTab: 'input' | 'dashboard' = 'input';
  isDarkMode = false;

  ngOnInit(): void {
    // Load dark mode preference from localStorage
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
      this.isDarkMode = JSON.parse(savedTheme);
      this.applyDarkMode();
    }
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', JSON.stringify(this.isDarkMode));
    this.applyDarkMode();
  }

  applyDarkMode(): void {
    const element = document.documentElement;
    if (this.isDarkMode) {
      element.classList.add('dark-mode');
    } else {
      element.classList.remove('dark-mode');
    }
  }
}
