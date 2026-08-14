import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PreferencesService } from '../../core/preferences.service';

import { ThemeService } from '../../core/theme.service';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.css']
})
export class OnboardingComponent {
  step = 1;
  error = '';
  isSaving = false;

  availableAssets = [
    { id: 'bitcoin', name: 'Bitcoin (BTC)' },
    { id: 'ethereum', name: 'Ethereum (ETH)' },
    { id: 'solana', name: 'Solana (SOL)' },
    { id: 'cardano', name: 'Cardano (ADA)' },
    { id: 'dogecoin', name: 'Dogecoin (DOGE)' }
  ];

  investorTypes = ['HODLer', 'Day Trader', 'NFT Collector', 'DeFi Degen'];

  availableContent = [
    { id: 'news', name: 'Market News' },
    { id: 'prices', name: 'Coin Prices' },
    { id: 'ai', name: 'AI Insights' },
    { id: 'memes', name: 'Fun / Memes' }
  ];

  preferences = {
    interestedAssets: [] as string[],
    investorType: '',
    preferredContent: [] as string[]
  };

  constructor(private preferencesService: PreferencesService, private router: Router, public themeService: ThemeService) { }

  toggleArrayItem(array: string[], item: string) {
    const index = array.indexOf(item);
    if (index > -1) {
      array.splice(index, 1);
    } else {
      array.push(item);
    }
  }

  nextStep() {
    if (this.step === 1 && this.preferences.interestedAssets.length === 0) {
      this.error = 'Please select at least 1 coin to continue.';
      return;
    }
    if (this.step === 2 && !this.preferences.investorType) {
      this.error = 'Please select your investor persona to continue.';
      return;
    }
    this.error = '';
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  finish() {
    if (this.preferences.preferredContent.length === 0) {
      this.error = 'Please select at least 1 type of content to display.';
      return;
    }
    this.error = '';
    this.isSaving = true;

    this.preferencesService.savePreferences(this.preferences).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.error = 'Failed to save preferences.';
        this.isSaving = false;
      }
    });
  }
}
