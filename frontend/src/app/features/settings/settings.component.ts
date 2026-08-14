import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PreferencesService } from '../../core/preferences.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  error = '';
  isSaving = false;
  isLoading = true;

  availableAssets = [
    { id: 'bitcoin', name: 'Bitcoin (BTC)' },
    { id: 'ethereum', name: 'Ethereum (ETH)' },
    { id: 'solana', name: 'Solana (SOL)' },
    { id: 'cardano', name: 'Cardano (ADA)' },
    { id: 'dogecoin', name: 'Dogecoin (DOGE)' },
    { id: 'polkadot', name: 'Polkadot (DOT)' },
    { id: 'chainlink', name: 'Chainlink (LINK)' }
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

  constructor(private preferencesService: PreferencesService, private router: Router) { }

  ngOnInit() {
    this.preferencesService.getPreferences().subscribe({
      next: (data) => {
        this.preferences.interestedAssets = data.interestedAssets || [];
        this.preferences.investorType = data.investorType || '';
        this.preferences.preferredContent = data.preferredContent || [];
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load settings.';
        this.isLoading = false;
      }
    });
  }

  toggleArrayItem(array: string[], item: string) {
    const index = array.indexOf(item);
    if (index > -1) {
      array.splice(index, 1);
    } else {
      array.push(item);
    }
  }

  save() {
    if (this.preferences.interestedAssets.length === 0) {
      this.error = 'Please select at least 1 coin to continue.';
      return;
    }
    if (!this.preferences.investorType) {
      this.error = 'Please select your investor persona to continue.';
      return;
    }
    if (this.preferences.preferredContent.length === 0) {
      this.error = 'Please select at least 1 type of dashboard content.';
      return;
    }
    this.error = '';
    this.isSaving = true;

    this.preferencesService.savePreferences(this.preferences).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.error = 'Failed to save settings.';
        this.isSaving = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/dashboard']);
  }
}
