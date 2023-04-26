export interface ArticleCategory {
  _id?: string | undefined;

  index?: number;

  key?: string;

  name: string;

  pid: string | null;

  parent?: any;

  sort: number;

  createdAt?: string | Date;

  updatedAt?: string | Date;
}
