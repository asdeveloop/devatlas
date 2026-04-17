import { BaseQueryDto } from '../dto/base-query.dto';

export class QueryPrismaMapper {
  static buildFindManyArgs<T extends BaseQueryDto>(query: T) {
    const { skip, take, sortBy, order, ...filters } = query;

    return {
      skip,
      take,
      where: { ...this.clean(filters) },
      orderBy: sortBy ? { [sortBy]: order ?? 'desc' } : undefined,
    };
  }

  private static clean(obj: any) {
    const result: any = {};
    for (const key in obj) {
      if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
        result[key] = obj[key];
      }
    }
    return result;
  }
}
