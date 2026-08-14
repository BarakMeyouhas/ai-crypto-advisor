import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsWidgetComponent } from '../../shared/components/news-widget/news-widget.component';
import { PricesWidgetComponent } from '../../shared/components/prices-widget/prices-widget.component';
import { InsightWidgetComponent } from '../../shared/components/insight-widget/insight-widget.component';
import { MemeWidgetComponent } from '../../shared/components/meme-widget/meme-widget.component';
import { AuthService } from '../../core/auth.service';
import { PreferencesService, UserPreferences } from '../../core/preferences.service';
import { ThemeService } from '../../core/theme.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NewsWidgetComponent, PricesWidgetComponent, InsightWidgetComponent, MemeWidgetComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isSidebarCollapsed = false;
  userPreferences: UserPreferences | null = null;
  userName = '';
  isLoading = true;

  constructor(
    private preferencesService: PreferencesService, 
    private auth: AuthService, 
    private router: Router,
    public themeService: ThemeService
  ) {}

  ngOnInit() {
    this.auth.currentUser$.subscribe(user => {
      if (user) this.userName = user.name || 'Investor';
    });

    this.preferencesService.getPreferences().subscribe({
      next: (prefs) => {
        this.userPreferences = prefs;
        this.isLoading = false;
      },
      error: () => {
        // Fallback or handle error
        this.isLoading = false;
      }
    });
  }

  hasContent(type: string): boolean {
    return this.userPreferences?.preferredContent.includes(type) ?? false;
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  goToSettings() {
    this.router.navigate(['/settings']);
  }

  goToPreferences() {
    this.router.navigate(['/onboarding']);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
