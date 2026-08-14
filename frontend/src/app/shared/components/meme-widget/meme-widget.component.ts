import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../core/dashboard.service';

@Component({
  selector: 'app-meme-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './meme-widget.component.html',
  styleUrls: ['./meme-widget.component.css']
})
export class MemeWidgetComponent implements OnInit {
  memeUrl: string = '';
  relatedAsset: string = '';
  voteState: boolean | null = null;

  isLoading = true;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getMeme().subscribe({
      next: (data) => {
        this.memeUrl = data.memeUrl;
        this.relatedAsset = data.relatedAsset;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  vote(isPositive: boolean) {
    if (this.voteState !== null) return;
    
    this.voteState = isPositive;
    this.dashboardService.submitFeedback('Meme', this.memeUrl, isPositive).subscribe();
  }
}
