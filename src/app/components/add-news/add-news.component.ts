import { Component } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { RssService } from '../../services/rss.service';

@Component({
  selector: 'app-add-news',
  templateUrl: './add-news.component.html',
  styleUrls: ['./add-news.component.scss'],
})
export class AddNewsComponent {
  urlForm!: FormGroup;
  errorMessage: string = '';

  constructor(private rssService: RssService) {}

  ngOnInit() {
    this.urlForm = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
      ]),
      url: new FormControl('', [
        Validators.required,
        Validators.pattern('https?://.+'),
      ]),
    });
  }
  addNewUrl() {
    if (this.urlForm.valid) {
      this.errorMessage = '';

      const newUrlData = {
        id: this.generateUniqueId(),
        title: this.urlForm.value.title,
        url: this.urlForm.value.url,
      };

      this.rssService.addUrl(newUrlData).subscribe({
        next: () => {
          this.urlForm.reset();
        },
        error: (error) => {
          this.errorMessage = 'Invalid URL! Please check and try again.';
          console.error(error);
        },
      });
    }
  }

  private generateUniqueId(): number {
    return Date.now() + Math.floor(Math.random() * 10000);
  }
}
