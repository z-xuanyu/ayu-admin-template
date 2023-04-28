export interface ArticleColumn {
  _id?: string;

  index: number;

  key: string;

  title: string;

  categoryId: null | string;

  category?: any;

  cover: string;

  digest: string;

  views: number;

  author: string;

  updatedAt: string;

  createdAt: string;
}
