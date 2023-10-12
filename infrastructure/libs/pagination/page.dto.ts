import { ApiProperty } from '@nestjs/swagger';
import { PageMetaDto } from './page.meta';

export class PageDto<T> {
  @ApiProperty({ isArray: true })
  data: T[];

  @ApiProperty({
    type: () => PageMetaDto,
  })
  readonly meta: PageMetaDto;

  constructor(data: T[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
