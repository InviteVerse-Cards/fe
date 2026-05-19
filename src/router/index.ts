import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import UserLayout from '@/components/layout/UserLayout.vue'
import AuthLayout from '@/components/layout/AuthLayout.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PublicLayout from '@/components/layout/PublicLayout.vue'
import EditorLayout from '@/components/layout/EditorLayout.vue'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    // ── Auth pages (no navbar) ─────────────────────────────────
    {
      path: '/auth',
      component: AuthLayout,
      children: [
        { path: '/login',           name: 'Login',           component: () => import('@/pages/LoginPage.vue'),          meta: { guestOnly: true } },
        { path: '/register',        name: 'Register',        component: () => import('@/pages/RegisterPage.vue'),       meta: { guestOnly: true } },
        { path: '/forgot-password', name: 'ForgotPassword',  component: () => import('@/pages/ForgotPasswordPage.vue'), meta: { guestOnly: true } },
        { path: '/reset-password',  name: 'ResetPassword',   component: () => import('@/pages/ResetPasswordPage.vue') },
        { path: '/verify-email',    name: 'VerifyEmail',     component: () => import('@/pages/VerifyEmailPage.vue') },
      ],
    },

    // ── User pages (with navbar + footer) ──────────────────────
    {
      path: '/',
      component: UserLayout,
      children: [
        { path: '',         name: 'Home',           component: () => import('@/pages/HomePage.vue') },
        { path: '/profile', name: 'Profile',        component: () => import('@/pages/ProfilePage.vue'), meta: { requiresAuth: true } },
        { path: '/app/invitations', name: 'MyInvitations', component: () => import('@/pages/app/MyInvitationsPage.vue'), meta: { requiresAuth: true } },
        { path: '/app/templates',   name: 'Templates',       component: () => import('@/pages/app/TemplatesPage.vue'),    meta: { requiresAuth: true } },
      ],
    },

    // ── Editor (full screen, no navbar) ───────────────────────
    {
      path: '/app/editor',
      component: EditorLayout,
      meta: { requiresAuth: true },
      children: [
        { path: ':uuid', name: 'Editor', component: () => import('@/pages/app/EditorPage.vue') },
      ],
    },

    // ── Public invitation page ─────────────────────────────────
    {
      path: '/i',
      component: PublicLayout,
      children: [
        { path: ':slug', name: 'InvitationView', component: () => import('@/pages/public/InvitationViewPage.vue') },
      ],
    },

    // ── Template demo page (public, no auth) ──────────────────
    {
      path: '/templates',
      component: PublicLayout,
      children: [
        { path: ':slug', name: 'TemplateDemo', component: () => import('@/pages/public/TemplateDemoPage.vue') },
      ],
    },

    // ── Admin pages ────────────────────────────────────────────
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAdmin: true },
      children: [
        { path: '',               name: 'AdminDashboard', component: () => import('@/pages/admin/DashboardPage.vue') },
        { path: 'users',          name: 'AdminUsers',     component: () => import('@/pages/admin/UsersPage.vue') },
        { path: 'users/:id',      name: 'AdminUserDetail', component: () => import('@/pages/admin/UserDetailPage.vue') },
        { path: 'credit-orders',  name: 'AdminOrders',    component: () => import('@/pages/admin/CreditOrdersPage.vue') },
        { path: 'credit-packages', name: 'AdminPackages', component: () => import('@/pages/admin/CreditPackagesPage.vue') },
        { path: 'ai-models',      name: 'AdminAIModels',  component: () => import('@/pages/admin/AIModelsPage.vue') },
        { path: 'templates',               name: 'AdminTemplates',       component: () => import('@/pages/admin/TemplatesAdminPage.vue') },
        { path: 'templates/:uuid/editor', name: 'AdminTemplateEditor',  component: () => import('@/pages/admin/TemplateEditorPage.vue') },
        { path: 'music',                   name: 'AdminMusic',           component: () => import('@/pages/admin/MusicAdminPage.vue') },
      ],
    },

    // ── Catch-all ──────────────────────────────────────────────
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach(async to => {
  const auth = useAuthStore()

  // Skip fetchMe on guest-only pages to avoid unnecessary 401 → refresh cycle
  if (auth.user === null && !to.meta.guestOnly) {
    await auth.fetchMe()
  }

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { name: 'Login', query: { redirect: to.fullPath } }
  }
  if (to.meta.requiresAdmin && auth.user?.role !== 'admin') {
    return { name: 'Home' }
  }
  if (to.meta.guestOnly && auth.isLoggedIn) {
    return { name: 'Home' }
  }
})

export default router
