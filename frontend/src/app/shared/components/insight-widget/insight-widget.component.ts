import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../core/dashboard.service';

@Component({
  selector: 'app-insight-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './insight-widget.component.html',
  styleUrls: ['./insight-widget.component.css']
})
export class InsightWidgetComponent implements OnInit {
  insight = '';
  voteState: boolean | null = null;

  isLoading = true;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getInsight().subscribe({
      next: (insight) => {
        this.insight = insight;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  vote(isPositive: boolean) {
    if (this.voteState !== null || !this.insight) return;
    
    this.voteState = isPositive;
    this.dashboardService.submitFeedback('Insight', this.insight.substring(0, 100), isPositive).subscribe();
  }
}
