export class PagedListHolder<T> {
  private list: T[];
  private pageSize: number;
  private pageNumber: number;
  private count: number;

  constructor(list: T[], pageSize: number, pageNumber: number, count: number) {
    this.list = list;
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
    this.count = count;
  }
}