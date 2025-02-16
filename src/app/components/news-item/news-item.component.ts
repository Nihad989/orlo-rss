import {
  Component,
  Input,
  OnInit,
  ChangeDetectorRef,
  SimpleChanges,
} from '@angular/core';
import { ElementRef, ViewChild } from '@angular/core';
import { Item } from 'src/app/models/rss.model';

@Component({
  selector: 'app-news-item',
  templateUrl: './news-item.component.html',
  styleUrls: ['./news-item.component.scss'],
})
export class NewsItemComponent implements OnInit {
  @Input() items: Item[] = [];
  @ViewChild('newsGrid', { static: false }) newsGrid!: ElementRef;

  displayedNews: Item[] = [];
  itemsPerPage = 30;
  currentPage = 0;
  masonryInitialized = false;

  suggestedSources: string[] = [
    'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml',
    'https://feeds.bbci.co.uk/news/rss.xml',
  ];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadMoreNews();
  }

  loadMoreNews(): void {
    if (!this.items || this.items.length === 0) return;

    const nextBatch = this.items.slice(
      this.currentPage * this.itemsPerPage,
      (this.currentPage + 1) * this.itemsPerPage
    );

    this.displayedNews = [...this.displayedNews, ...nextBatch];

    this.currentPage++;
    setTimeout(() => {
      this.cdr.detectChanges();
      if (!this.masonryInitialized) {
        this.applyMasonryLayout();
      }
    }, 500);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['items']) {
      const previousItems = changes['items'].previousValue;
      const currentItems = changes['items'].currentValue;

      if (!currentItems || currentItems.length === 0) {
        this.displayedNews = [];
        return;
      }

      if (JSON.stringify(previousItems) !== JSON.stringify(currentItems)) {
        this.displayedNews = [];
        this.currentPage = 0;
        this.loadMoreNews();
      }
    }
  }

  applyMasonryLayout() {
    if (!this.newsGrid || !this.newsGrid.nativeElement) return;
    if (!this.displayedNews.length) return;

    const gridItems = this.newsGrid.nativeElement.children;
    const rowHeight = 20;

    Array.from(gridItems).forEach((item: any) => {
      const contentHeight = item.getBoundingClientRect().height;
      const rowSpan = Math.ceil(contentHeight / rowHeight);
      item.style.gridRowEnd = `span ${rowSpan}`;
    });
  }
}
