import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) { }

  getInsight(): Observable<string> {
    const token = localStorage.getItem('token');
    return this.http.get<{ insight: string }>(`${this.apiUrl}/insight`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      map(res => res.insight),
      catchError(() => of('Unable to fetch AI insight at this time.'))
    );
  }

  getNews(): Observable<any[]> {
    const token = localStorage.getItem('token');
    return this.http.get<any[]>(`${this.apiUrl}/news`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      catchError(() => of([]))
    );
  }

  getPrices(assets: string[]): Observable<any> {
    if (!assets || assets.length === 0) return of({});
    
    // CoinGecko API doesn't require Auth for simple queries
    const ids = assets.join(',');
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;
    return this.http.get(url).pipe(
      catchError(() => of({}))
    );
  }

  getMeme(): Observable<{ memeUrl: string; subreddit: string; relatedAsset: string }> {
    const token = localStorage.getItem('token');
    return this.http.get<{ memeUrl: string; subreddit: string; relatedAsset: string }>(`${this.apiUrl}/meme`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      catchError(() => of({ memeUrl: 'assets/placeholder-meme.jpg', subreddit: 'unknown', relatedAsset: 'general crypto' }))
    );
  }

  submitFeedback(contentType: string, contentReference: string, isPositive: boolean): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post<any>(`${this.apiUrl}/feedback`, 
      { contentType, contentReference, isPositive },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }
}
