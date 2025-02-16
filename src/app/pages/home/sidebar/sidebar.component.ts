import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { UrlData } from 'src/app/models/rss.model';
import { RssService } from 'src/app/services/rss.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  @Output() sidebarToggled = new EventEmitter<boolean>();
  @Input() preselectedIds: number[] = [];
  @Output() selectionChange = new EventEmitter<number[]>();
  @Output() searchChange = new EventEmitter<string>();

  siteNames: UrlData[] = [];
  selectedIds: number[] = [];
  searchText: string = '';

  isClosed = false;
  isMobile = false;

  constructor(private rssService: RssService) {}

  ngOnInit() {
    this.detectMobile();

    this.rssService.urlList$.subscribe((data) => {
      this.siteNames = data;
    });
    this.selectedIds = [...this.preselectedIds];
  }

  detectMobile() {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    this.isMobile = mediaQuery.matches;

    if (this.isMobile) {
      this.isClosed = true;
    }

    mediaQuery.addEventListener('change', (event) => {
      this.isMobile = event.matches;
      if (this.isMobile) {
        this.isClosed = true;
      }
    });
  }

  toggleSidebar() {
    this.isClosed = !this.isClosed;
  }

  toggleSelection(id: number) {
    if (this.selectedIds.includes(id)) {
      this.selectedIds = this.selectedIds.filter((itemId) => itemId !== id);
    } else {
      this.selectedIds.push(id);
    }
    this.selectionChange.emit(this.selectedIds);
  }

  deleteSite(siteId: number) {
    this.rssService.removeUrl(siteId);

    if (this.selectedIds.includes(siteId)) {
      this.selectedIds = this.selectedIds.filter((id) => id !== siteId);
      this.selectionChange.emit(this.selectedIds);
    }

    this.searchText = '';
    this.searchChange.emit(this.searchText);
  }

  onSearchChange() {
    this.searchChange.emit(this.searchText);
  }
}
