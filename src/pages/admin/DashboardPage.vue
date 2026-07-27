<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import type { ApexOptions } from 'apexcharts'
import { adminService } from '@/services/admin.service'
import type {
  StatsOverview,
  DailyTraffic,
  HourlyTraffic,
  PopularTemplate,
  CategoryStats,
  OnlineUsersStats,
  RevenueStats,
  GeographicStats
} from '@/services/admin.service'
import { useUIStore } from '@/stores/ui'
import AppSpinner from '@/components/common/AppSpinner.vue'

const ui = useUIStore()

const activeTab = ref<'system' | 'traffic' | 'revenue'>('system')
const isLoading = ref(false)
const isOnlineLoading = ref(false)

// State data
const statsOverview = ref<StatsOverview | null>(null)
const dailyTraffic = ref<DailyTraffic[]>([])
const hourlyTraffic = ref<HourlyTraffic[]>([])
const popularTemplates = ref<PopularTemplate[]>([])
const cardsByCategory = ref<CategoryStats[]>([])
const onlineUsers = ref<OnlineUsersStats | null>(null)
const revenueStats = ref<RevenueStats | null>(null)
const geoStats = ref<GeographicStats | null>(null)

// Format currency
function formatVND(val: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)
}

// Load data based on active tab
async function loadSystemData() {
  isLoading.value = true
  try {
    const [ov, pt, cbc] = await Promise.all([
      adminService.getStatsOverview(),
      adminService.getPopularTemplates(),
      adminService.getCardsByCategory(),
    ])
    statsOverview.value = ov
    popularTemplates.value = pt
    cardsByCategory.value = cbc
  } catch (err) {
    ui.toast.error('Không thể tải dữ liệu hệ thống')
  } finally {
    isLoading.value = false
  }
}

async function loadTrafficData() {
  isLoading.value = true
  try {
    const [dt, ht, ou, geo] = await Promise.all([
      adminService.getDailyTraffic(),
      adminService.getHourlyTraffic(),
      adminService.getOnlineUsers(),
      adminService.getGeographicStats(),
    ])
    dailyTraffic.value = dt
    hourlyTraffic.value = ht
    onlineUsers.value = ou
    geoStats.value = geo
  } catch (err) {
    ui.toast.error('Không thể tải dữ liệu lượng truy cập')
  } finally {
    isLoading.value = false
  }
}

async function loadRevenueData() {
  isLoading.value = true
  try {
    const rev = await adminService.getRevenueStats()
    revenueStats.value = rev
  } catch (err) {
    ui.toast.error('Không thể tải dữ liệu tài chính')
  } finally {
    isLoading.value = false
  }
}

// Live online updates every 30s
let onlineInterval: any = null
async function updateOnlineUsers() {
  if (activeTab.value === 'traffic') {
    isOnlineLoading.value = true
    try {
      onlineUsers.value = await adminService.getOnlineUsers()
    } catch {
      // silent
    } finally {
      isOnlineLoading.value = false
    }
  }
}

watch(activeTab, (newTab) => {
  if (newTab === 'system') loadSystemData()
  else if (newTab === 'traffic') loadTrafficData()
  else if (newTab === 'revenue') loadRevenueData()
}, { immediate: true })

onMounted(() => {
  onlineInterval = setInterval(updateOnlineUsers, 30000)
})

onUnmounted(() => {
  if (onlineInterval) clearInterval(onlineInterval)
})

// ── Chart 1: Popular Templates (Bar) ──────────────────────────
const templateChartOptions = computed<ApexOptions>(() => ({
  chart: {
    type: 'bar',
    fontFamily: 'Inter, sans-serif',
    toolbar: { show: false }
  },
  colors: ['#4f46e5'],
  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 4,
      barHeight: '60%'
    }
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: popularTemplates.value.map(t => t.name),
    labels: { style: { colors: '#6b7280', fontSize: '11px' } }
  },
  yaxis: {
    labels: { style: { colors: '#6b7280', fontSize: '11px' } }
  },
  grid: { borderColor: '#f1f5f9' },
  tooltip: { theme: 'light' }
}))

const templateChartSeries = computed(() => [{
  name: 'Lượt dùng',
  data: popularTemplates.value.map(t => t.use_count)
}])

// ── Chart 2: Cards by Category (Donut) ───────────────────────
const categoryMap: Record<string, string> = {
  wedding: 'Đám cưới',
  birthday: 'Sinh nhật',
  party: 'Tiệc tùng',
  anniversary: 'Kỷ niệm',
  event: 'Sự kiện khác'
}

const categoryChartOptions = computed<ApexOptions>(() => ({
  chart: {
    type: 'donut',
    fontFamily: 'Inter, sans-serif'
  },
  labels: cardsByCategory.value.map(c => categoryMap[c.category] || c.category),
  colors: ['#4f46e5', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'],
  legend: {
    position: 'bottom',
    labels: { colors: '#4b5563' }
  },
  dataLabels: { enabled: true },
  tooltip: { theme: 'light' }
}))

const categoryChartSeries = computed(() => cardsByCategory.value.map(c => c.count))

// ── Chart 3: Daily Traffic (Area) ────────────────────────────
const trafficChartOptions = computed<ApexOptions>(() => ({
  chart: {
    type: 'area',
    fontFamily: 'Inter, sans-serif',
    toolbar: { show: false }
  },
  colors: ['#4f46e5', '#10b981'],
  xaxis: {
    categories: dailyTraffic.value.map(d => d.date),
    labels: { style: { colors: '#6b7280', fontSize: '11px' } }
  },
  yaxis: {
    labels: { style: { colors: '#6b7280', fontSize: '11px' } }
  },
  stroke: { curve: 'smooth', width: 2 },
  fill: {
    type: 'gradient',
    gradient: {
      opacityFrom: 0.3,
      opacityTo: 0.05
    }
  },
  dataLabels: { enabled: false },
  grid: { borderColor: '#f1f5f9' },
  tooltip: { theme: 'light' }
}))

const trafficChartSeries = computed(() => [
  { name: 'Lượt xem trang', data: dailyTraffic.value.map(d => d.page_views) },
  { name: 'Khách độc lập (Sessions)', data: dailyTraffic.value.map(d => d.unique_visitors) }
])

// ── Chart 4: Hourly Traffic (Bar) ───────────────────────────
const hourlyChartOptions = computed<ApexOptions>(() => ({
  chart: {
    type: 'bar',
    fontFamily: 'Inter, sans-serif',
    toolbar: { show: false }
  },
  colors: ['#f59e0b'],
  plotOptions: {
    bar: {
      borderRadius: 3,
      columnWidth: '70%'
    }
  },
  xaxis: {
    categories: hourlyTraffic.value.map(h => `${h.hour}h`),
    labels: { style: { colors: '#6b7280', fontSize: '11px' } }
  },
  yaxis: {
    labels: { style: { colors: '#6b7280', fontSize: '11px' } }
  },
  grid: { borderColor: '#f1f5f9' },
  tooltip: { theme: 'light' }
}))

const hourlyChartSeries = computed(() => [{
  name: 'Lượt xem',
  data: hourlyTraffic.value.map(h => h.page_views)
}])

// ── Chart 5: Daily Revenue (Area) ───────────────────────────
const revenueDailyOptions = computed<ApexOptions>(() => ({
  chart: {
    type: 'area',
    fontFamily: 'Inter, sans-serif',
    toolbar: { show: false }
  },
  colors: ['#10b981'],
  xaxis: {
    categories: (revenueStats.value?.daily ?? []).map(d => d.date),
    labels: { style: { colors: '#6b7280', fontSize: '11px' } }
  },
  yaxis: {
    labels: {
      formatter: (v) => formatVND(v),
      style: { colors: '#6b7280', fontSize: '11px' }
    }
  },
  stroke: { curve: 'smooth', width: 2 },
  fill: {
    type: 'gradient',
    gradient: {
      opacityFrom: 0.3,
      opacityTo: 0.05
    }
  },
  dataLabels: { enabled: false },
  grid: { borderColor: '#f1f5f9' },
  tooltip: { theme: 'light' }
}))

const revenueDailySeries = computed(() => [{
  name: 'Doanh thu',
  data: (revenueStats.value?.daily ?? []).map(d => d.revenue)
}])

// ── Chart 6: Monthly Revenue (Bar) ──────────────────────────
const revenueMonthlyOptions = computed<ApexOptions>(() => ({
  chart: {
    type: 'bar',
    fontFamily: 'Inter, sans-serif',
    toolbar: { show: false }
  },
  colors: ['#3b82f6'],
  plotOptions: {
    bar: {
      borderRadius: 4,
      columnWidth: '50%'
    }
  },
  xaxis: {
    categories: (revenueStats.value?.monthly ?? []).map(m => m.month),
    labels: { style: { colors: '#6b7280', fontSize: '11px' } }
  },
  yaxis: {
    labels: {
      formatter: (v) => formatVND(v),
      style: { colors: '#6b7280', fontSize: '11px' }
    }
  },
  grid: { borderColor: '#f1f5f9' },
  tooltip: { theme: 'light' }
}))

const revenueMonthlySeries = computed(() => [{
  name: 'Doanh thu tháng',
  data: (revenueStats.value?.monthly ?? []).map(m => m.revenue)
}])

// ── Chart 7: Packages Sold (Donut) ──────────────────────────
const packageChartOptions = computed<ApexOptions>(() => ({
  chart: {
    type: 'donut',
    fontFamily: 'Inter, sans-serif'
  },
  labels: (revenueStats.value?.packages ?? []).map(p => p.package_name),
  colors: ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899'],
  legend: {
    position: 'bottom',
    labels: { colors: '#4b5563' }
  },
  tooltip: { theme: 'light' }
}))

const packageChartSeries = computed(() => (revenueStats.value?.packages ?? []).map(p => p.count))

// Export CSV for daily traffic
function exportTrafficCsv() {
  const header = 'Ngày,Lượt xem trang,Khách truy cập độc lập'
  const rows = dailyTraffic.value.map(d => `${d.date},${d.page_views},${d.unique_visitors}`)
  const blob = new Blob([header + '\n' + rows.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `inviteverse_traffic_${new Date().toISOString().slice(0,10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// Pages label translations
const PAGE_LABELS: Record<string, string> = {
  '/': 'Trang chủ',
  '/profile': 'Hồ sơ cá nhân',
  '/app/templates': 'Kho mẫu thiệp',
  '/app/invitations': 'Danh sách thiệp của tôi',
  '/admin': 'Dashboard Admin',
  '/admin/users': 'Quản lý người dùng',
  '/admin/credit-orders': 'Giao dịch đơn hàng',
  '/admin/credit-packages': 'Gói credit',
  '/admin/ai-models': 'Mô hình AI',
  '/admin/templates': 'Quản trị mẫu thiệp',
  '/admin/categories': 'Danh mục mẫu thiệp',
  '/admin/music': 'Kho nhạc nền',
}

function resolvePageLabel(page: string) {
  if (page.startsWith('/i/')) return `Xem thiệp: ${page.replace('/i/', '')}`
  if (page.startsWith('/templates/')) return `Demo mẫu: ${page.replace('/templates/', '')}`
  if (page.startsWith('/app/editor/')) return `Trình sửa thiệp`
  return PAGE_LABELS[page] ?? page
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight text-gray-900">Quản trị hệ thống</h1>
        <p class="text-sm text-gray-500 mt-1">Quản lý và thống kê tổng thể dự án InviteVerse</p>
      </div>

      <!-- Tab Buttons -->
      <div class="flex items-center gap-1.5 bg-white p-1.5 border border-gray-200 rounded-2xl shadow-sm">
        <button
          @click="activeTab = 'system'"
          class="px-4 py-2 text-sm font-semibold rounded-xl transition-all"
          :class="activeTab === 'system' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
        >
          📊 Hệ thống
        </button>
        <button
          @click="activeTab = 'traffic'"
          class="px-4 py-2 text-sm font-semibold rounded-xl transition-all"
          :class="activeTab === 'traffic' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
        >
          🌐 Lưu lượng
        </button>
        <button
          @click="activeTab = 'revenue'"
          class="px-4 py-2 text-sm font-semibold rounded-xl transition-all"
          :class="activeTab === 'revenue' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
        >
          💰 Tài chính
        </button>
      </div>
    </div>

    <!-- Spinner Loading -->
    <div v-if="isLoading" class="flex justify-center items-center py-32 bg-white rounded-3xl border border-gray-200 shadow-sm">
      <div class="text-center">
        <AppSpinner size="lg" />
        <p class="text-sm text-gray-500 mt-3 font-medium">Đang tải dữ liệu báo cáo...</p>
      </div>
    </div>

    <template v-else>
      <!-- TAB 1: SYSTEM -->
      <div v-if="activeTab === 'system'" class="space-y-6 animate-fade-in">
        <!-- System overview cards -->
        <div v-if="statsOverview" class="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div class="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-semibold uppercase tracking-wider text-gray-400">Tổng người dùng</p>
                <p class="mt-2 text-3xl font-extrabold text-gray-900">{{ statsOverview.total_users?.toLocaleString('vi-VN') ?? 0 }}</p>
                <p class="mt-1 text-xs text-indigo-600 font-medium">Hôm nay +{{ statsOverview.today_users ?? 0 }}</p>
              </div>
              <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-2xl group-hover:scale-110 transition-transform">👥</div>
            </div>
          </div>
          <div class="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-semibold uppercase tracking-wider text-gray-400">Người dùng có nạp</p>
                <p class="mt-2 text-3xl font-extrabold text-gray-900">{{ statsOverview.active_users?.toLocaleString('vi-VN') ?? 0 }}</p>
                <p class="mt-1 text-xs text-gray-500">Số dư credit > 0</p>
              </div>
              <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-2xl group-hover:scale-110 transition-transform">✅</div>
            </div>
          </div>
          <div class="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-semibold uppercase tracking-wider text-gray-400">Tổng số thiệp</p>
                <p class="mt-2 text-3xl font-extrabold text-gray-900">{{ statsOverview.total_invitations?.toLocaleString('vi-VN') ?? 0 }}</p>
                <p class="mt-1 text-xs text-emerald-600 font-medium">Đã xuất bản: {{ statsOverview.published_invitations ?? 0 }}</p>
              </div>
              <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-2xl group-hover:scale-110 transition-transform">💌</div>
            </div>
          </div>
          <div class="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-semibold uppercase tracking-wider text-gray-400">Tổng doanh thu</p>
                <p class="mt-2 text-2xl font-black text-gray-900">{{ formatVND(statsOverview.total_revenue ?? 0) }}</p>
                <p class="mt-1.5 text-xs text-emerald-600 font-medium">Hôm nay +{{ formatVND(statsOverview.today_revenue ?? 0) }}</p>
              </div>
              <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-2xl group-hover:scale-110 transition-transform">💰</div>
            </div>
          </div>
        </div>

        <!-- Charts row -->
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <!-- Popular Templates -->
          <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 class="text-base font-bold text-gray-900 mb-4">🔥 Mẫu thiệp được sử dụng nhiều nhất</h2>
            <div v-if="popularTemplates.length">
              <VueApexCharts
                type="bar"
                height="280"
                :options="templateChartOptions"
                :series="templateChartSeries"
              />
            </div>
            <div v-else class="flex items-center justify-center h-48 text-sm text-gray-400">
              Chưa có dữ liệu thống kê mẫu
            </div>
          </div>

          <!-- Categories distribution -->
          <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col justify-between">
            <h2 class="text-base font-bold text-gray-900 mb-4 font-sans">📊 Phân bổ thiệp theo danh mục</h2>
            <div v-if="cardsByCategory.length" class="flex-1 flex items-center justify-center">
              <VueApexCharts
                type="donut"
                width="100%"
                max-width="380"
                :options="categoryChartOptions"
                :series="categoryChartSeries"
              />
            </div>
            <div v-else class="flex items-center justify-center h-48 text-sm text-gray-400">
              Chưa có dữ liệu danh mục
            </div>
          </div>
        </div>

        <!-- Recent transactions -->
        <div class="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 class="text-base font-bold text-gray-900">🛒 Giao dịch đơn hàng gần đây</h2>
            <RouterLink to="/admin/credit-orders" class="text-xs font-semibold text-indigo-600 hover:text-indigo-900">Xem tất cả</RouterLink>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-gray-200 bg-gray-50 text-left">
                  <th class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Mã đơn</th>
                  <th class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Khách hàng</th>
                  <th class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Gói cước</th>
                  <th class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Số tiền</th>
                  <th class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Trạng thái</th>
                  <th class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ngày nạp</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 bg-white">
                <tr
                  v-for="order in statsOverview?.recent_orders"
                  :key="order.id"
                  class="hover:bg-gray-50 transition-colors"
                >
                  <td class="px-6 py-3.5 font-mono text-xs font-semibold text-gray-900">{{ order.topup_code }}</td>
                  <td class="px-6 py-3.5">
                    <p class="font-medium text-gray-900">{{ order.user?.full_name || 'Khách ẩn danh' }}</p>
                    <p class="text-xs text-gray-500">{{ order.user?.email || 'N/A' }}</p>
                  </td>
                  <td class="px-6 py-3.5">
                    <span class="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">
                      {{ order.package?.name || `${order.credits} Credits` }}
                    </span>
                  </td>
                  <td class="px-6 py-3.5 text-right font-semibold text-gray-900">{{ formatVND(order.amount) }}</td>
                  <td class="px-6 py-3.5 text-center">
                    <span
                      class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                      :class="{
                        'bg-emerald-100 text-emerald-800': order.status === 'paid',
                        'bg-amber-100 text-amber-800': order.status === 'pending',
                        'bg-red-100 text-red-800': order.status === 'failed',
                        'bg-gray-100 text-gray-800': order.status === 'cancelled'
                      }"
                    >
                      {{ order.status === 'paid' ? 'Đã thu' : order.status === 'pending' ? 'Chờ duyệt' : 'Hủy' }}
                    </span>
                  </td>
                  <td class="px-6 py-3.5 text-xs text-gray-500">{{ new Date(order.created_at).toLocaleString('vi-VN') }}</td>
                </tr>
                <tr v-if="!statsOverview?.recent_orders?.length">
                  <td colspan="6" class="px-6 py-10 text-center text-sm text-gray-400 italic">Chưa có giao dịch nào được ghi nhận</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- TAB 2: TRAFFIC & ONLINE -->
      <div v-if="activeTab === 'traffic'" class="space-y-6 animate-fade-in">
        <!-- Live Online Widget -->
        <div class="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-emerald-50/50 p-6 shadow-sm">
          <div class="absolute right-0 top-0 h-24 w-24 translate-x-4 -translate-y-4 rounded-full bg-emerald-100/30 blur-2xl"></div>
          <div class="flex flex-wrap items-center justify-between gap-6">
            <!-- Ping details -->
            <div class="flex items-center gap-4">
              <div class="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 shadow-lg shadow-emerald-200">
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60"></span>
                <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-wider text-emerald-800">Đang trực tuyến</p>
                <p class="mt-1 text-4xl font-extrabold text-emerald-950">
                  {{ onlineUsers?.total_online ?? 0 }}
                  <span class="text-sm font-normal text-emerald-800 ml-1">người dùng</span>
                </p>
              </div>
            </div>

            <!-- Breakdown -->
            <div class="flex items-center gap-8">
              <div class="text-center">
                <p class="text-2xl font-bold text-indigo-700">{{ onlineUsers?.registered_online ?? 0 }}</p>
                <p class="text-xs text-gray-500 mt-1 font-medium">Đã đăng nhập</p>
              </div>
              <div class="h-8 w-px bg-emerald-500/10"></div>
              <div class="text-center">
                <p class="text-2xl font-bold text-gray-700">{{ onlineUsers?.anonymous_online ?? 0 }}</p>
                <p class="text-xs text-gray-500 mt-1 font-medium">Khách ẩn danh</p>
              </div>
            </div>

            <!-- Online pages widget -->
            <div class="min-w-64 flex-1 max-w-sm rounded-xl border border-emerald-500/10 bg-white/70 p-3 text-xs shadow-inner">
              <p class="font-bold text-gray-800 mb-2 border-b border-gray-100 pb-1.5">Trang đang xem nhiều nhất:</p>
              <div class="space-y-1.5">
                <div
                  v-for="page in onlineUsers?.pages?.slice(0, 3)"
                  :key="page.page"
                  class="flex items-center justify-between text-gray-600"
                >
                  <span class="truncate pr-4 font-mono">{{ resolvePageLabel(page.page) }}</span>
                  <span class="font-bold text-emerald-600 shrink-0">{{ page.count }} người</span>
                </div>
                <p v-if="!onlineUsers?.pages?.length" class="text-gray-400 italic">Chưa có ai hoạt động</p>
              </div>
            </div>

            <!-- Live time -->
            <div class="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Tự cập nhật sau 30s
            </div>
          </div>
        </div>

        <!-- Daily traffic chart -->
        <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-base font-bold text-gray-900">🌐 Lượng truy cập 30 ngày gần đây</h2>
            <button
              @click="exportTrafficCsv"
              class="px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Xuất dữ liệu CSV
            </button>
          </div>
          <div v-if="dailyTraffic.length">
            <VueApexCharts
              type="area"
              height="280"
              :options="trafficChartOptions"
              :series="trafficChartSeries"
            />
          </div>
          <div v-else class="flex items-center justify-center h-48 text-sm text-gray-400">
            Chưa thu thập đủ dữ liệu truy cập
          </div>
        </div>

        <!-- Hourly + Page Views Row -->
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <!-- Peak hours chart -->
          <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 class="text-base font-bold text-gray-900 mb-2">⚡ Phân bổ lượng truy cập theo khung giờ</h2>
            <p class="text-xs text-gray-500 mb-4">Giúp xác định giờ cao điểm người dùng truy cập nhiều nhất trong 30 ngày qua</p>
            <div v-if="hourlyTraffic.length">
              <VueApexCharts
                type="bar"
                height="240"
                :options="hourlyChartOptions"
                :series="hourlyChartSeries"
              />
            </div>
            <div v-else class="flex items-center justify-center h-48 text-sm text-gray-400">
              Chưa có dữ liệu phân bổ giờ
            </div>
          </div>

          <!-- Online users list -->
          <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col">
            <h2 class="text-base font-bold text-gray-900 mb-4">👥 Người dùng đang trực tuyến gần đây</h2>
            <div class="flex-1 overflow-y-auto max-h-[260px] divide-y divide-gray-100">
              <div
                v-for="usr in onlineUsers?.recent_users"
                :key="usr.session_id"
                class="py-2.5 flex items-center justify-between text-xs hover:bg-gray-50/50 px-1 rounded-lg"
              >
                <div>
                  <p class="font-semibold text-gray-900">
                    {{ usr.user_name || 'Khách ẩn danh' }}
                  </p>
                  <p class="text-[10px] text-gray-500 font-mono">IP: {{ usr.ip_address || '—' }} | {{ usr.user_email || '—' }}</p>
                </div>
                <div class="text-right">
                  <span class="inline-flex rounded-md bg-indigo-50 px-2 py-0.5 font-medium text-indigo-700 text-[10px] max-w-32 truncate">
                    {{ resolvePageLabel(usr.page || '') }}
                  </span>
                  <p class="text-[10px] text-gray-400 mt-0.5">seen {{ new Date(usr.last_seen).toLocaleTimeString('vi-VN') }}</p>
                </div>
              </div>
              <div v-if="!onlineUsers?.recent_users?.length" class="text-center py-10 text-xs text-gray-400 italic">
                Chưa có nhật ký online trong 3 phút qua
              </div>
            </div>
          </div>
        </div>

        <!-- Geographic Distribution Row -->
        <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="text-base font-bold text-gray-900">📍 Phân bổ địa lý (Top Tỉnh / Thành phố)</h2>
              <p class="text-xs text-gray-500 mt-0.5">Thống kê khu vực có lượng truy cập nhiều nhất để hỗ trợ định hướng Target Quảng cáo (Ads)</p>
            </div>
            <span class="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
              GeoIP Tracking Active
            </span>
          </div>

          <div v-if="geoStats?.cities?.length" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Cities Table -->
            <div class="overflow-x-auto border border-gray-100 rounded-xl">
              <table class="w-full text-xs">
                <thead>
                  <tr class="bg-gray-50 text-gray-500 border-b border-gray-100 text-left">
                    <th class="py-2.5 px-4 font-semibold">Tỉnh / Thành phố</th>
                    <th class="py-2.5 px-4 font-semibold">Quốc gia</th>
                    <th class="py-2.5 px-4 font-semibold text-right">Lượt truy cập</th>
                    <th class="py-2.5 px-4 font-semibold text-right">Khách độc lập</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr v-for="city in geoStats.cities" :key="city.city" class="hover:bg-gray-50/60 transition-colors">
                    <td class="py-2 px-4 font-medium text-gray-900 flex items-center gap-2">
                      <span class="text-base">🏢</span>
                      {{ city.city }}
                    </td>
                    <td class="py-2 px-4 text-gray-500">{{ city.country }}</td>
                    <td class="py-2 px-4 text-right font-bold text-indigo-600">{{ city.visits.toLocaleString('vi-VN') }}</td>
                    <td class="py-2 px-4 text-right text-gray-600">{{ city.unique_visitors.toLocaleString('vi-VN') }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Country breakdown -->
            <div class="space-y-3">
              <p class="text-xs font-bold text-gray-700">Top Quốc gia có lượt xem cao nhất:</p>
              <div class="space-y-2">
                <div v-for="c in geoStats.countries" :key="c.country" class="space-y-1">
                  <div class="flex justify-between text-xs font-medium text-gray-700">
                    <span>Quốc gia: {{ c.country }}</span>
                    <span class="font-bold text-indigo-600">{{ c.visits }} lượt</span>
                  </div>
                  <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      class="bg-indigo-600 h-2 rounded-full transition-all"
                      :style="{ width: `${Math.min(100, (c.visits / (geoStats.countries[0]?.visits || 1)) * 100)}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-10 text-xs text-gray-400 italic">
            Đang thu thập thêm dữ liệu vị trí địa lý...
          </div>
        </div>
      </div>

      <!-- TAB 3: REVENUE & BILLING -->
      <div v-if="activeTab === 'revenue'" class="space-y-6 animate-fade-in">
        <!-- Revenue overview card -->
        <div v-if="statsOverview" class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div class="group overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5">
            <p class="text-xs font-semibold uppercase tracking-wider text-gray-400">Doanh thu tích lũy</p>
            <p class="mt-2 text-3xl font-black text-emerald-600">{{ formatVND(statsOverview.total_revenue ?? 0) }}</p>
            <p class="mt-1 text-xs text-gray-500 font-medium">Toàn bộ đơn hàng đã thanh toán thành công</p>
          </div>
          <div class="group overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5">
            <p class="text-xs font-semibold uppercase tracking-wider text-gray-400">Doanh thu hôm nay</p>
            <p class="mt-2 text-3xl font-black text-indigo-600">{{ formatVND(statsOverview.today_revenue ?? 0) }}</p>
            <p class="mt-1 text-xs text-gray-500 font-medium">Doanh số phát sinh tính từ 00h00</p>
          </div>
          <div class="group overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5">
            <p class="text-xs font-semibold uppercase tracking-wider text-gray-400">Tỉ lệ đơn hoàn tất</p>
            <p class="mt-2 text-3xl font-black text-gray-900">
              {{ statsOverview.total_orders > 0 ? ((statsOverview.paid_orders / statsOverview.total_orders) * 100).toFixed(1) : 0 }}%
            </p>
            <p class="mt-1 text-xs text-gray-500 font-medium">Đã thanh toán {{ statsOverview.paid_orders }} / {{ statsOverview.total_orders }} đơn</p>
          </div>
        </div>

        <!-- Revenue charts -->
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <!-- Daily revenue -->
          <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 class="text-base font-bold text-gray-900 mb-4">📈 Biểu đồ doanh thu 30 ngày qua</h2>
            <div v-if="revenueStats?.daily?.length">
              <VueApexCharts
                type="area"
                height="260"
                :options="revenueDailyOptions"
                :series="revenueDailySeries"
              />
            </div>
            <div class="flex items-center justify-center h-48 text-sm text-gray-400" v-else>
              Chưa có dữ liệu doanh số hàng ngày
            </div>
          </div>

          <!-- Packages sold distribution -->
          <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col justify-between">
            <h2 class="text-base font-bold text-gray-900 mb-4">📦 Thị phần phân bổ các gói cước</h2>
            <div v-if="revenueStats?.packages?.length" class="flex-1 flex items-center justify-center">
              <VueApexCharts
                type="donut"
                width="100%"
                max-width="360"
                :options="packageChartOptions"
                :series="packageChartSeries"
              />
            </div>
            <div class="flex items-center justify-center h-48 text-sm text-gray-400" v-else>
              Chưa có dữ liệu phân loại gói cước
            </div>
          </div>
        </div>

        <!-- Monthly billing -->
        <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 class="text-base font-bold text-gray-900 mb-4 font-sans">📅 Doanh thu phân tích theo tháng</h2>
          <div v-if="revenueStats?.monthly?.length">
            <VueApexCharts
              type="bar"
              height="280"
              :options="revenueMonthlyOptions"
              :series="revenueMonthlySeries"
            />
          </div>
          <div class="flex items-center justify-center h-48 text-sm text-gray-400" v-else>
            Chưa có doanh số hàng tháng
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
