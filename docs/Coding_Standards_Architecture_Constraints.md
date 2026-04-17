خیلی خوب، وارد **مرحله ۵: تعریف Coding Standards و Architecture Constraints** می‌شویم.  
این مرحله پایه‌ای‌ترین بخش برای جلوگیری از آشفتگی، دوباره‌کاری، اجرای اصول Clean Code و ساخت یک محصول **Production‑grade** است.

---

# 🎯 هدف مرحله ۵  
ایجاد یک مجموعه قوانین سخت‌گیرانه و استاندارد برای:

- ساختار کد Backend, Frontend و Types  
- نام‌گذاری (Naming Conventions)  
- اعتبارسنجی ورودی (DTO/Schema Validation)  
- خطاها (Error Format)  
- ساختار API و الگوی Response واحد  
- معماری ماژول‌ها  
- Git, Commit, PR و CI/CD rules

این قوانین بعداً در **مرحله 29 (Documentation Portal)** به‌عنوان "DevAtlas Engineering Handbook" منتشر می‌شوند.

---

# 🧱 خروجی نهایی مرحله ۵  
در این مرحله ۸ دسته استاندارد تعریف می‌کنیم:

```
A. Naming Standards  
B. Folder Structure Rules  
C. API & DTO Standards  
D. Service/Repository Architecture Rules  
E. Error Handling Rules  
F. Logging & Observability Rules  
G. TypeScript & Zod Rules  
H. Git & Pull Request Standards
```

در ادامه نسخه نهایی و قابل اجرا ارائه شده است.

---

# 🧩 A. Naming Standards
### 1. **Case formats**
- API Query Params → `camelCase`
- Database Fields (Prisma) → `snake_case`
- TypeScript Interfaces → `PascalCase`
- Enum Values → `UPPER_SNAKE_CASE`
- Files → `kebab-case.ts`
- Folders → `lowercase-with-dashes`

### 2. **Consistency examples**
```
reading_time   (database)
readingTime    (typescript)
readingTime    (api query param)
```

### 3. **Module naming**
```
guides/
  guides.controller.ts
  guides.service.ts
  guides.repository.ts
  guides.module.ts
  dto/
  schemas/
```

---

# 🧩 B. Folder Structure Rules (Backend)
ساختار استاندارد هر ماژول NestJS:

```
module-name/
  module-name.module.ts
  module-name.controller.ts
  module-name.service.ts
  module-name.repository.ts
  dto/
    create-*.dto.ts
    update-*.dto.ts
    query-*.dto.ts
  schemas/
  mappers/
  types/
  tests/
```

قواعد:
- همه DTOها در `dto/`
- همه mapping logic در `mappers/`
- هیچ query مستقیم داخل Service — فقط در Repository.

---

# 🧩 C. API & DTO Standards

### 1. **Response Format (اجباری برای همه Endpointها)**

```ts
{
  success: boolean;
  data: any;
  meta?: PaginationMeta | null;
  timestamp: string;
  traceId?: string;
}
```

### 2. **Query DTO Schema (Zod Standard)**
- همه پارامترها optional  
- تبدیل type با `z.coerce.number()`  
- defaultها فقط در Zod تعریف می‌شوند (نه در Service)

### 3. **Sorting Rules**
در همه endpointها:
```
sortBy=createdAt
sortOrder=asc|desc
```

### 4. **Search Rules**
نام استاندارد: `search`  
حالت insensitive  
پشتیبانی از OR multi fields

---

# 🧩 D. Service/Repository Architecture Rules

### 1. **Service مسئولیت:**
- validate business logic
- validation after DTO (second layer)
- mapping

### 2. **Repository مسئولیت:**
- تمام کوئری‌های Prisma  
- هیچ logic در Repository قرار نمی‌گیرد  
- Repository فقط یک کار می‌کند: دسترسی به دیتا

### 3. **Service → Repository طراحی یکنواخت:**
مثال:

```ts
this.guidesRepository.findMany({ 
  where, 
  orderBy, 
  skip, 
  take,
  include: {...}
});
```

---

# 🧩 E. Error Handling Rules

### 1. **Error Response Standard**
```ts
{
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
  traceId: string;
}
```

### 2. **Error Types**
```
BAD_REQUEST
NOT_FOUND
UNAUTHORIZED
INTERNAL_ERROR
VALIDATION_ERROR
```

### 3. **Always include traceId**

---

# 🧩 F. Logging & Observability Rules
### 1. **Log Schema**
```ts
{
  level: "info" | "error" | "warn",
  message: string,
  module: string,
  duration?: number,
  traceId: string,
  timestamp: string
}
```

### 2. **No console.log allowed**  
فقط Logger NestJS + Structured Log.

---

# 🧩 G. TypeScript & Zod Rules

### 1. **تمام ورودی‌ها MUST use Zod**
```ts
export class GuideQueryDto extends createZodDto(guideQuerySchema) {}
```

### 2. **Interfaces به جای Types**  
Except utility types.

### 3. **Server-only types در `/packages/types/server`**

---

# 🧩 H. Git Standards & PR Rules

### 1. **Commit Message Format (Conventional Commits)**
```
feat(guides): add search filter
fix(tools): correct popularity sorting
refactor(api): unify response structure
docs(roadmap): update stage 5
```

### 2. **Pull Request Rules**
- هر PR باید فقط یک موضوع داشته باشد  
- حداقل یک reviewer  
- build + lint + test باید پاس شوند  
- توضیح: "What / Why / How / Impact / Testing"

---

# ✔ خروجی مرحله ۵
- Coding Standards کامل  
- Architecture Constraints نهایی  
- آماده برای توسعه پایدار  
- پایه تمام مراحل بعد  

---

# 🔜 آماده هستم برای شروع **مرحله ۶ — Phase 1: Refactor پکیج Types**  
این مرحله یکی از مهم‌ترین مراحل کل پروژه است.

آیا تأیید می‌کنی وارد مرحله ۶ شویم؟