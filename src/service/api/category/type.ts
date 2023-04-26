export interface QueryArticleCategoryParams {
  name?: string;

  pageSize: number;

  pageNumber: number;
}

export interface AddArticleCategoryParams {
  name: string;

  pid: string | null;

  sort: number;
}

export interface UpdateArticleCategoryParams {
  _id: string;

  name: string;

  pid: string;

  sort: number;
}
