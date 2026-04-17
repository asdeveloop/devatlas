import { PaginationDto } from './pagination-query.dto';
import { SortingDto } from './sorting.dto';

export class BaseQueryDto extends PaginationDto implements SortingDto {
  sortBy?: string;
  order?: 'asc' | 'desc';
}
