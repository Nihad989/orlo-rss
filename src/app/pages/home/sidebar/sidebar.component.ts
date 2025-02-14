import {
  Component,
  EventEmitter,
  Output,
  HostListener,
  Input,
} from '@angular/core';
import { RssService } from 'src/app/services/rss.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @Output() sidebarToggled = new EventEmitter<boolean>();
  @Input() preselectedIds: number[] = [];
  @Output() selectionChange = new EventEmitter<number[]>();
  @Output() searchChange = new EventEmitter<string>();
  siteNames: any[] = [];
  selectedIds: number[] = [];
  searchText: string = '';

  isClosed = false;
  isMobile = false;

  constructor(private rssService: RssService) {
    this.checkScreenSize();
  }

  @HostListener('window:resize', [])
  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
    if (this.isMobile) {
      this.isClosed = true;
    } else {
      this.isClosed = false;
    }
  }

  rssSites: { site: string; url: string; id: number }[] = [];
  newSite: string = '';

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
  }

  toggleSidebar() {
    this.isClosed = !this.isClosed;
  }

  onSearchChange() {
    this.searchChange.emit(this.searchText);
  }

  ngOnInit() {
    this.rssService.urlList$.subscribe((data) => {
      this.siteNames = data;
    });
    this.selectedIds = [...this.preselectedIds];
  }
}
