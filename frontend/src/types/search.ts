export type SearchCategory = 'products' | 'customers' | 'sales' | 'users' | 'inventory';

export interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  category: SearchCategory;
  url: string;
  badge?: string;
}

export interface SearchGroup {
  category: SearchCategory;
  label: string;
  items: SearchResultItem[];
}