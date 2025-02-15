// export interface News {
//   id?: number;
//   title: string;
//   content: string;
//   pubDate: Date;
//   enclosure: string;
//   source: string;
//   url: string;
//   site: string;
//   link: string;
// }

export interface UrlData {
  id: number;
  title: string;
  url: string;
}

export interface RssItem {
  title?: string;
  link?: string;
  pubDate?: string | Date;
  description?: string;
  content?: string;
  thumbnail?: string;
  image?: string;
  enclosure?: { link?: string };
  [key: string]: any;
}

export interface RssResponse {
  items: RssItem[];
  [key: string]: any;
}

export interface Item {
  id: number;
  site: string;
  title: string;
  content: string;
  link: string;
  pubDate: Date;
  image: string;
}
