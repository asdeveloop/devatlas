/** نوع ID در دیتابیس — همیشه UUID */
export type DatabaseId = string;

/** فیلدهای مشترک هر رکورد در DB */
export interface DatabaseTimestamps {
  createdAt: Date;
  updatedAt: Date;
}

/** Prisma-style include/select helpers */
export type SelectFields<T> = {
  [K in keyof T]?: boolean;
};

/** نتیجه عملیات batch در Prisma */
export interface BatchResult {
  count: number;
}

/** پارامترهای مرتب‌سازی — generic */
export interface OrderByParam<T extends string = string> {
  field: T;
  direction: 'asc' | 'desc';
}
