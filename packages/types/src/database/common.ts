export type DatabaseId = string;

export interface DatabaseTimestamps {
  createdAt: Date;
  updatedAt: Date;
}

export interface BatchResult {
  count: number;
}

export interface OrderByParam<T extends string = string> {
  field: T;
  direction: 'asc' | 'desc';
}
