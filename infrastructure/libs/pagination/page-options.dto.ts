export class PageOptionsDto {
  readonly order?: Order = Order.ASC;
  readonly page?: number = 1;
  readonly take?: number = 10;
  readonly skip: number = (this.page - 1) * this.take;

  static getSkip(page, take): number {
    return (page - 1) * take;
  }
}

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}
