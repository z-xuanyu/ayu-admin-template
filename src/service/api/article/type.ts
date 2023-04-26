export interface QueryArticleParams {
  title?: string;

  pageSize: number;

  pageNumber: number;
}

export interface AddArticleParams {
  title: string;
  categoryId: null | string;
  cover: string;
  desc: string;
  digest: string;
  author: string;
  views: number;
  sort: number;
  content: string;
  status: boolean;
}

export interface UdateArticleParams extends AddArticleParams {
  _id: string;
}
