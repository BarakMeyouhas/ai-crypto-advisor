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

  constructor(private dashboardService: DashboardService) { }

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

    // Optimistic UI Update: Instantly highlight the button for a fast user experience
    this.voteState = isPositive;

    this.dashboardService.submitFeedback('Meme', this.memeUrl, isPositive).subscribe({
      error: () => {
        // If the server fails, revert the UI back to null so they can try again
        this.voteState = null;
        console.error('Failed to save vote to the database.');
      }
    });
  }
}
