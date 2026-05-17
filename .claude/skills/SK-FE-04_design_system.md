# [SK-FE-04] Design System (Tailwind, Light Mode)

> Trigger: Viết bất kỳ UI component nào. InviteVerse là LIGHT MODE, mobile-first, colorful.

---

## Design Principles

- **Light mode only** — nền trắng/xám nhạt, không có dark mode
- **Mobile-first** — viết classes mobile trước, rồi mới `md:`, `lg:`
- **Warm & inviting** — palette ấm áp, màu sắc tươi tắn (phù hợp thiệp mời)
- **Clean & minimal** — không dùng quá nhiều màu, giữ breathing room

---

## Color Palette

```typescript
// tailwind.config.ts — Extend với InviteVerse colors
extend: {
  colors: {
    // Brand
    primary: {
      50:  '#EEF2FF',
      100: '#E0E7FF',
      500: '#6366F1',   // Indigo chính
      600: '#4F46E5',
      700: '#4338CA',
    },
    // Accent ấm
    rose: {  // Dùng sẵn từ Tailwind
      400: '#FB7185',
      500: '#F43F5E',
    },
    // Neutral
    surface: '#FAFAFA',      // Nền page
    card: '#FFFFFF',         // Nền card
    border: '#E5E7EB',       // Border mặc định
  },
}
```

---

## Typography

```html
<!-- Heading trang chính -->
<h1 class="font-serif text-3xl font-bold text-gray-900 md:text-4xl">
  Tạo thiệp của bạn
</h1>

<!-- Heading section -->
<h2 class="text-xl font-semibold text-gray-800">Thiệp của tôi</h2>

<!-- Body text -->
<p class="text-sm text-gray-600 leading-relaxed">Mô tả...</p>

<!-- Muted text -->
<span class="text-xs text-gray-400">3 ngày trước</span>

<!-- Label -->
<label class="block text-sm font-medium text-gray-700">Tên thiệp</label>
```

---

## Button Variants

```html
<!-- Primary — action chính -->
<button class="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 active:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
  Tạo thiệp
</button>

<!-- Secondary — action phụ -->
<button class="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors">
  Hủy
</button>

<!-- Danger -->
<button class="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-500 transition-colors">
  Xóa
</button>

<!-- Ghost -->
<button class="rounded-lg px-4 py-2.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition-colors">
  Xem tất cả
</button>

<!-- Icon button -->
<button class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
  <svg class="h-5 w-5" .../>
</button>
```

---

## Input & Form

```html
<!-- Text input -->
<div class="space-y-1">
  <label class="block text-sm font-medium text-gray-700">Tên thiệp</label>
  <input
    type="text"
    class="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
    placeholder="VD: Đám cưới Nam & Linh"
  />
  <!-- Error state: thêm border-red-500 focus:border-red-500 focus:ring-red-500 -->
  <p class="text-xs text-red-600">Tên thiệp là bắt buộc</p>
</div>

<!-- Textarea -->
<textarea
  class="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm resize-none focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
  rows="4"
/>

<!-- Select -->
<select class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
  <option>Thiệp cưới</option>
  <option>Thiệp sinh nhật</option>
</select>

<!-- Toggle switch -->
<label class="relative inline-flex cursor-pointer items-center gap-3">
  <div class="relative">
    <input type="checkbox" class="peer sr-only" />
    <div class="h-6 w-11 rounded-full bg-gray-200 transition-colors peer-checked:bg-indigo-600" />
    <div class="absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
  </div>
  <span class="text-sm text-gray-700">Hiển thị section</span>
</label>
```

---

## Card

```html
<!-- Standard card -->
<div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
  <!-- content -->
</div>

<!-- Hover card (clickable) -->
<div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer">
  <!-- content -->
</div>

<!-- Feature card với colored border top -->
<div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm border-t-4 border-t-indigo-500">
  <!-- content -->
</div>
```

---

## Badge / Status

```html
<!-- Green / Success -->
<span class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
  Đã xuất bản
</span>

<!-- Yellow / Warning -->
<span class="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
  Bản nháp
</span>

<!-- Gray / Neutral -->
<span class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
  Lưu trữ
</span>

<!-- Indigo / Feature -->
<span class="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
  PRO
</span>
```

---

## Layout Patterns

```html
<!-- Page wrapper -->
<div class="min-h-screen bg-gray-50">
  <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <!-- content -->
  </main>
</div>

<!-- Two-column (editor) -->
<div class="flex h-screen overflow-hidden">
  <!-- Sidebar -->
  <aside class="w-80 flex-shrink-0 overflow-y-auto border-r border-gray-200 bg-white">
    <!-- form -->
  </aside>
  <!-- Preview -->
  <main class="flex-1 overflow-y-auto bg-gray-100 p-4">
    <!-- preview -->
  </main>
</div>

<!-- Grid responsive -->
<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
  <!-- cards -->
</div>
```

---

## Mobile-first Rules

```html
<!-- Viết mobile classes trước, desktop sau -->
<div class="px-4 py-6 md:px-8 md:py-10 lg:px-16">
<h1 class="text-2xl font-bold md:text-3xl lg:text-4xl">
<div class="flex flex-col gap-3 sm:flex-row sm:items-center">

<!-- Touch targets: min 44px -->
<button class="min-h-[44px] px-4 py-2.5 ...">
<a class="inline-flex min-h-[44px] items-center px-4 ...">

<!-- Font size: min 16px trên mobile (tránh zoom iOS)  -->
<input class="text-base sm:text-sm ...">
```

---

## Animation / Transition

```html
<!-- Fade transition -->
<Transition name="fade" appear>
  <div v-if="show">...</div>
</Transition>

<style>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>

<!-- Slide up -->
<Transition name="slide-up">
  <div v-if="open" class="fixed inset-x-0 bottom-0 ...">...</div>
</Transition>

<style>
.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.3s ease; }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }
</style>
```

---

## Anti-patterns (không làm)

```html
<!-- ❌ Hex màu trực tiếp -->
<div style="background: #6366F1; color: #fff">

<!-- ❌ Dark mode classes (không cần) -->
<div class="bg-white dark:bg-gray-900">

<!-- ❌ Desktop-first (viết lg: trước) -->
<div class="lg:px-16 px-4">  <!-- sai thứ tự -->

<!-- ❌ inline style cho layout -->
<div style="width: 320px; margin-left: auto">
```
