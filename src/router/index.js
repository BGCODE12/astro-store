import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
    meta: { title: 'متجر أسترو | Astro Store' },
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('../views/ProductsView.vue'),
    meta: { title: 'المنتجات | Products' },
  },
  {
    path: '/products/:id',
    name: 'ProductDetail',
    component: () => import('../views/ProductDetailView.vue'),
    meta: { title: 'تفاصيل المنتج | Product Detail' },
    props: true,
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('../views/CartView.vue'),
    meta: { title: 'السلة | Cart' },
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('../views/CheckoutView.vue'),
    meta: { title: 'الدفع | Checkout' },
    beforeEnter: (to, from, next) => {
      // Guard: ensure cart has items (dynamic import to avoid circular deps)
      import('../stores/useCartStore.js').then(({ useCartStore }) => {
        const cartStore = useCartStore()
        if (cartStore.isEmpty) {
          next({ name: 'Cart' })
        } else {
          next()
        }
      })
    },
  },
  {
    path: '/wishlist',
    name: 'Wishlist',
    component: () => import('../views/WishlistView.vue'),
    meta: { title: 'المفضلة | Wishlist' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue'),
    meta: { title: '404 - الصفحة غير موجودة' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0, behavior: 'smooth' }
  },
})

// Global navigation guard - Update document title
router.beforeEach((to, from, next) => {
  const title = to.meta?.title
  if (title) document.title = title
  next()
})

export default router
