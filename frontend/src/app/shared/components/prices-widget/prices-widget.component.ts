import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../core/dashboard.service';

@Component({
  selector: 'app-prices-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prices-widget.component.html',
  styleUrls: ['./prices-widget.component.css']
})
export class PricesWidgetComponent implements OnInit {
  @Input() assets: string[] = [];
  prices: any = {};
  objectKeys = Object.keys;
  voteState: boolean | null = null;

  isLoading = true;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getPrices(this.assets).subscribe({
      next: (data) => {
        this.prices = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  vote(isPositive: boolean) {
    if (this.voteState !== null) return;
    
    // Optimistic UI update
    this.voteState = isPositive;
    this.dashboardService.submitFeedback('Prices', this.assets.join(','), isPositive).subscribe({
      error: () => {
        this.voteState = null;
        console.error('Failed to save vote to the database.');
      }
    });
  }
}
