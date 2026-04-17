
پس وارد **مرحله ۴: طراحی API Contract نهایی برای DevAtlas Platform** می‌شویم.

---

## 🎯 هدف مرحله ۴  
طراحی سند API Contract به‌صورت **TypeScript‑first + OpenAPI compatible** برای تمام ماژول‌های اصلی، طوری که کل Frontend, Backend و Types یک زبان مشترک داشته باشند.

---

## 🧩 محدوده Stage 4
ما در این مرحله فقط ساختار و قراردادها را طراحی می‌کنیم (بدون کدنویسی در سرویس‌ها).  
حوزه شامل چهار ماژول اصلی است:

1. **Guides**
2. **Tools**
3. **Categories**
4. **Tags**

---

## 📐 اصول طراحی
- همه endpointها با الگوی REST استاندارد (`/v1/{module}`)  
- پاسخ‌ها با الگوی یکنواخت:

```json
{
  "success": true,
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 144,
    "totalPages": 12
  },
  "timestamp": "2026-04-14T19:41:00.000Z"
}
```

- Pagination اختیاری ولی در تمام لیست‌ها پشتیبانی شود  
- پارامترهای مرتب‌سازی و فیلتر همسان (`sortBy`, `sortOrder`, `search`, `status`, `difficulty`)  
- ساختار response با Zod/TypeScript اعتبارسنجی شود

---

## 💠 DevAtlas API Contract
زیر ساختار کلی هر ماژول آورده‌ام:

---

### 1️⃣  `/v1/guides`

**List Guides**
```http
GET /v1/guides?search=&categorySlug=&tagSlug=&difficulty=&status=&sortBy=createdAt&sortOrder=desc&page=1&limit=12
```

**Response**
```ts
interface GuideListResponse {
  data: GuideSummary[];
  meta: PaginationMeta;
}
```

**Item structure**
```ts
interface GuideSummary {
  id: string;
  title: string;
  slug: string;
  summary: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readingTime: number;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  category: CategoryRef;
  tags: TagRef[];
  createdAt: string;
}
```

**Detail**
```http
GET /v1/guides/:slug
```
Response → `GuideDetail` (+ Markdown content, steps, resources)

---

### 2️⃣  `/v1/tools`

**List Tools**
```http
GET /v1/tools?search=&categorySlug=&sortBy=popularity&sortOrder=desc&page=1&limit=20
```

**Response**
```ts
interface ToolListResponse {
  data: ToolSummary[];
  meta: PaginationMeta;
}

interface ToolSummary {
  id: string;
  name: string;
  slug: string;
  description: string;
  tier: 'free' | 'paid' | 'opensource';
  status: 'ACTIVE' | 'INACTIVE';
  popularity: number;
  category: CategoryRef;
  createdAt: string;
}
```

**Detail**
```http
GET /v1/tools/:slug
```
Response → `ToolDetail` (full description, URLs, pricing, guidesLinks)

---

### 3️⃣  `/v1/categories`

**List Categories**
```http
GET /v1/categories
```
Response:
```ts
interface CategoryListResponse {
  data: CategoryRef[];
}

interface CategoryRef {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}
```

**Detail**
```http
GET /v1/categories/:slug
```

---

### 4️⃣  `/v1/tags`

**List Tags**
```http
GET /v1/tags
```

Response:
```ts
interface TagListResponse {
  data: TagRef[];
}

interface TagRef {
  id: string;
  name: string;
  slug: string;
}
```

---

### 📊 Unified Pagination & Meta Type
```ts
interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
```

---

## 💡 مزایای طراحی مرحله ۴

- اکنون تمام ماژول‌ها روی یک **Request Contract و Response Format واحد** قرار دارند.  
- می‌توان به‌راحتی Swagger یا OpenAPI Spec را از Types و Zod تولید کرد.  
- Frontend می‌تواند با یک Generic API Client کار کند.  
- Backend نیز با Zod Dtos ولیدیشن یکسان تولید می‌کند.

---

## 🧱 خروجی نهایی این مرحله
**DevAtlas API Spec v1.0** شامل:
- Endpointهای Guides, Tools, Categories, Tags  
- مدل داده استاندارد و همگن  
- تعریف کامل DTOهای ورودی و خروجی  
- قالب پاسخ واحد (success/data/meta/timestamp)

---

✅ مرحله ۴ با موفقیت انجام شد  
🪶 آماده ورود به **مرحله ۵ — تعریف Coding Standards و Architecture Constraints** هستیم.

آیا تأیید می‌کنی مرحله ۵ رو شروع کنم؟