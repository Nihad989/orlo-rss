import { RssItem, UrlData } from '../models/rss.model';
export class RssItemTransformer {
  static transform(item: RssItem, newData: UrlData): any {
    return {
      id: newData.id,
      site: newData.title,
      title: item.title || '',
      content: item.content || item.description || '',
      link: item.link || '',
      pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
      image: item.enclosure?.link || item.thumbnail || '',
    };
  }
}
