import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../core/dashboard.service';

@Component({
  selector: 'app-news-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news-widget.component.html',
  styleUrls: ['./news-widget.component.css']
})
export class NewsWidgetComponent implements OnInit {
  news: any[] = [];
  votedItems = new Map<string, boolean>();

  isLoading = true;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getNews().subscribe({
      next: (news) => {
        this.news = news;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  vote(article: any, isPositive: boolean) {
    const ref = article.url || article.title;
    if (this.votedItems.has(ref)) return;
    
    this.votedItems.set(ref, isPositive);
    this.dashboardService.submitFeedback('News', ref, isPositive).subscribe();
  }
}
