export interface SearchResultItem {
  id: string;
  contentType: 'guide' | 'tool';
  title: string;
  description: string;
  category: string;
  url: string;
  tags: string[];
  score: number;
}
