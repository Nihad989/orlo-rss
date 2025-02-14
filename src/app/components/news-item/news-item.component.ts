import {
  Component,
  Input,
  OnInit,
  ChangeDetectorRef,
  SimpleChanges,
  HostListener,
} from '@angular/core';
import { ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-news-item',
  templateUrl: './news-item.component.html',
  styleUrls: ['./news-item.component.scss'],
})
export class NewsItemComponent implements OnInit {
  @Input() items: any[] = [];
  @ViewChild('newsGrid', { static: false }) newsGrid!: ElementRef;
  displayedNews: any[] = [];
  itemsPerPage = 100;
  currentPage = 0;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // this.loadMoreNews();
  }

  loadMoreNews(): void {
    if (!this.items || this.items.length === 0) return;

    const nextBatch = this.items.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
    this.displayedNews = [...this.displayedNews, ...nextBatch];
    console.log(this.displayedNews, 'displayedNews');
    this.currentPage++;
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
    setTimeout(() => this.applyMasonryLayout(), 100);
    window.addEventListener('resize', () =>
      setTimeout(() => this.applyMasonryLayout(), 100)
    );
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['items']) {
      this.cdr.detectChanges();

      setTimeout(() => this.applyMasonryLayout(), 100);
    }
    if (changes['items'] && this.items.length > 0) {
      this.displayedNews = [];
      this.currentPage = 1;
      this.loadMoreNews();
    }
  }
  applyMasonryLayout() {
    if (!this.newsGrid || !this.newsGrid.nativeElement) return;

    const gridItems = this.newsGrid.nativeElement.children;
    const rowHeight = 20;

    Array.from(gridItems).forEach((item: any) => {
      const contentHeight = item.getBoundingClientRect().height;
      const rowSpan = Math.ceil(contentHeight / rowHeight);
      item.style.gridRowEnd = `span ${rowSpan}`;
    });
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    const bottomReached =
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;
    if (bottomReached) {
      console.log('Bottom reached! Loading more news...');
      this.loadMoreNews();
    }
  }

  onScrollTriggered() {
    console.log('Scroll detected! Loading more news...');
    this.loadMoreNews();
  }
}
