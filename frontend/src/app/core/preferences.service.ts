import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UserPreferences {
  interestedAssets: string[];
  investorType: string;
  preferredContent: string[];
}

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {
  private apiUrl = `${environment.apiUrl}/preferences`;

  constructor(private http: HttpClient) { }

  getPreferences(): Observable<UserPreferences> {
    return this.http.get<UserPreferences>(this.apiUrl);
  }

  savePreferences(preferences: UserPreferences): Observable<any> {
    return this.http.post(this.apiUrl, preferences);
  }
}
