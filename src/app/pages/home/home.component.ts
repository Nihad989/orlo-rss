import { Component, Output } from '@angular/core';
import { Item } from 'src/app/models/rss.model';
import { RssService } from 'src/app/services/rss.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  isSidebarCollapsed = false;
  selectedIds: number[] = [];
  searchText: string = '';
  selectedNews: Item[] = this.filteredItems;
  @Output() rssFeeds: Item[] = [];

  toggleSidebar(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
  }

  constructor(private rssService: RssService) {}

  ngOnInit() {
    this.rssService.rssData$.subscribe((data) => {
      this.rssFeeds = data;
    });
  }

  updateSelectedIds(selectedIds: number[]) {
    this.selectedIds = selectedIds;
  }

  updateSearchText(search: string) {
    this.searchText = search;
  }

  get filteredItems() {
    let filtered =
      this.selectedIds.length > 0
        ? this.rssFeeds.filter((item) => this.selectedIds.includes(item.id))
        : this.rssFeeds;

    if (this.searchText.trim() !== '') {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }

    return filtered;
  }
}
