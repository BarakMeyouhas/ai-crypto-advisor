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
    const token = localStorage.getItem('token');
    return this.http.get<UserPreferences>(this.apiUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  savePreferences(preferences: UserPreferences): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(this.apiUrl, preferences, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}
