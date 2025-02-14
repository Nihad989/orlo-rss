import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';

// { site: 'BBC', url: 'http://feeds.bbci.co.uk/news/rss.xml', id: 1 },
// { site: 'CNN', url: 'http://rss.cnn.com/rss/edition.rss', id: 2 },
// { site: 'TechCrunch', url: 'https://techcrunch.com/feed/', id: 3 }

interface UrlData {
  id: number;
  title: string;
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class RssService {
  private rssToJsonUrl = 'https://api.rss2json.com/v1/api.json?rss_url=';
  private localStorageKey = 'rssFeeds';

  private urlListSubject = new BehaviorSubject<UrlData[]>(
    this.loadUrlsFromLocalStorage()
  );
  urlList$ = this.urlListSubject.asObservable();

  private rssDataSubject = new BehaviorSubject<any[]>([]);
  rssData$ = this.rssDataSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadFeedsForStoredUrls();
  }

  private loadUrlsFromLocalStorage(): UrlData[] {
    const storedUrls = localStorage.getItem(this.localStorageKey);
    return storedUrls ? JSON.parse(storedUrls) : [];
  }

  private saveUrlsToLocalStorage(urls: UrlData[]) {
    localStorage.setItem(this.localStorageKey, JSON.stringify(urls));
  }

  private loadFeedsForStoredUrls() {
    this.urlListSubject
      .getValue()
      .forEach((urlData) => this.fetchDataFromUrl(urlData));
  }

  addUrl(newData: UrlData): Observable<any> {
    return this.http
      .get(`${this.rssToJsonUrl}${encodeURIComponent(newData.url)}`)
      .pipe(
        tap(() => {
          const currentUrls = this.urlListSubject.getValue();
          const updatedUrls = [...currentUrls, newData];

          this.urlListSubject.next(updatedUrls);
          this.saveUrlsToLocalStorage(updatedUrls);

          this.fetchDataFromUrl(newData);
        }),
        catchError((error) => {
          console.error('Error fetching RSS feed:', error);
          return throwError(() => error);
        })
      );
  }

  removeUrl(id: number) {
    const updatedUrls = this.urlListSubject
      .getValue()
      .filter((item) => item.id !== id);
    this.urlListSubject.next(updatedUrls);
    this.saveUrlsToLocalStorage(updatedUrls);

    const updatedData = this.rssDataSubject
      .getValue()
      .filter((item) => item.id !== id);


    this.rssDataSubject.next(updatedData);
  }

  fetchDataFromUrl(newData: UrlData) {
    const url = newData.url;

    this.http
      .get(`${this.rssToJsonUrl}${encodeURIComponent(url)}`)
      .subscribe((response: any) => {
        const updatedResponse = response.items.map((item: any) =>
          this.transformItem(item, newData)
        );

        const currentData = this.rssDataSubject.getValue();
        const sortedData = [...currentData, ...updatedResponse].sort(
          (a, b) => b.pubDate.getTime() - a.pubDate.getTime()
        );

        this.rssDataSubject.next(sortedData);
      });
  }

  private transformItem(item: any, newData: UrlData) {
    return {
      id: newData.id,
      site: newData.title,
      title: item.title || '',
      content: item.content || item.description || '',
      link: item.link || '',
      pubDate: new Date(item.pubDate),
      image: item.enclosure?.link || item.thumbnail || '',
    };
  }
}
