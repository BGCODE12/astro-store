<template>
  <div class="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 min-h-screen">
    
    <!-- Top Header & Admin Actions -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-dark-border">
      <div>
        <div class="flex items-center gap-3">
          <span class="px-3 py-1 rounded-full bg-brand-500/20 text-brand-400 text-xs font-bold border border-brand-500/30">
            <i class="fa-solid fa-shield-halved mr-1"></i> وضع الأدمن
          </span>
          <h1 class="text-3xl font-black text-white">{{ t('admin.title') }}</h1>
        </div>
        <p class="text-gray-400 text-sm font-semibold mt-1">مرحباً بك في مركز إدارة متجر أسترو ومتابعة المنتجات والمبيعات.</p>
      </div>

      <div class="flex items-center gap-3">
        <button class="btn-primary text-xs py-2.5 px-4 gap-2" @click="openAddModal">
          <i class="fa-solid fa-plus"></i>
          <span>{{ t('admin.add_product') }}</span>
        </button>
        <button class="btn-secondary text-xs py-2.5 px-4 text-red-400 border-red-500/30 hover:bg-red-500/10" @click="handleLogout">
          <i class="fa-solid fa-right-from-bracket"></i>
          <span>{{ t('admin.logout') }}</span>
        </button>
      </div>
    </div>

    <!-- Navigation Tabs (Overview, Products, Orders) -->
    <div class="flex border-b border-dark-border space-x-4 rtl:space-x-reverse text-sm font-bold">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="pb-3 px-2 border-b-2 transition-all flex items-center gap-2 cursor-pointer"
        :class="activeTab === tab.id
          ? 'border-brand-500 text-brand-400 font-black'
          : 'border-transparent text-gray-400 hover:text-white'"
        @click="activeTab = tab.id"
      >
        <i :class="tab.icon"></i>
        <span>{{ tab.label }}</span>
      </button>
    </div>

    <!-- TAB 1: OVERVIEW & STATISTICS -->
    <div v-if="activeTab === 'overview'" class="space-y-8">
      
      <!-- Metric Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <!-- Card 1: Revenue -->
        <div class="bg-dark-card border border-dark-border rounded-2xl p-6 space-y-3 relative overflow-hidden">
          <div class="flex justify-between items-center">
            <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">{{ t('admin.stats.total_sales') }}</span>
            <div class="w-10 h-10 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center text-lg">
              <i class="fa-solid fa-dollar-sign"></i>
            </div>
          </div>
          <h3 class="text-3xl font-black text-white">$48,290.00</h3>
          <p class="text-xs text-green-400 font-semibold flex items-center gap-1">
            <i class="fa-solid fa-arrow-trend-up"></i> +14.2% مقارنة بالشهر الماضي
          </p>
        </div>

        <!-- Card 2: Orders -->
        <div class="bg-dark-card border border-dark-border rounded-2xl p-6 space-y-3 relative overflow-hidden">
          <div class="flex justify-between items-center">
            <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">{{ t('admin.stats.total_orders') }}</span>
            <div class="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-lg">
              <i class="fa-solid fa-bag-shopping"></i>
            </div>
          </div>
          <h3 class="text-3xl font-black text-white">1,420</h3>
          <p class="text-xs text-blue-400 font-semibold flex items-center gap-1">
            <i class="fa-solid fa-arrow-trend-up"></i> +8.5% طلبيات جديدة
          </p>
        </div>

        <!-- Card 3: Products -->
        <div class="bg-dark-card border border-dark-border rounded-2xl p-6 space-y-3 relative overflow-hidden">
          <div class="flex justify-between items-center">
            <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">{{ t('admin.stats.total_products') }}</span>
            <div class="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center text-lg">
              <i class="fa-solid fa-shoe-prints"></i>
            </div>
          </div>
          <h3 class="text-3xl font-black text-white">{{ productStore.productCount }}</h3>
          <p class="text-xs text-gray-400 font-semibold">متوفرة في المتجر حالياً</p>
        </div>

        <!-- Card 4: Customers -->
        <div class="bg-dark-card border border-dark-border rounded-2xl p-6 space-y-3 relative overflow-hidden">
          <div class="flex justify-between items-center">
            <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">{{ t('admin.stats.total_customers') }}</span>
            <div class="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-lg">
              <i class="fa-solid fa-users"></i>
            </div>
          </div>
          <h3 class="text-3xl font-black text-white">3,890</h3>
          <p class="text-xs text-purple-400 font-semibold flex items-center gap-1">
            <i class="fa-solid fa-user-plus"></i> +120 مسجل هذا الأسبوع
          </p>
        </div>

      </div>

      <!-- Sales Bar Chart Visual Simulation -->
      <div class="bg-dark-card border border-dark-border rounded-3xl p-6 md:p-8 space-y-6">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-xl font-bold text-white">مؤشر المبيعات والأرباح (2026)</h3>
            <p class="text-xs text-gray-400 mt-1">عرض رسومي لمبيعات الأحذية الرياضية للأشهر الأخيرة.</p>
          </div>
          <span class="text-xs font-bold bg-dark-hover border border-dark-border px-3 py-1 rounded-full text-brand-400">تحديث فوري</span>
        </div>

        <div class="h-64 flex items-end gap-3 md:gap-6 pt-8 pb-2 border-b border-dark-border px-4">
          <div v-for="(val, month) in monthlySales" :key="month" class="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
            <div class="text-[10px] font-bold text-gray-400 group-hover:text-brand-400 transition-colors">${{ val }}k</div>
            <div
              class="w-full bg-gradient-to-t from-brand-600 to-brand-400 rounded-t-lg transition-all duration-500 group-hover:brightness-125"
              :style="{ height: `${(val / 60) * 100}%` }"
            ></div>
            <span class="text-xs font-bold text-gray-400 uppercase mt-2">{{ month }}</span>
          </div>
        </div>
      </div>

    </div>

    <!-- TAB 2: PRODUCT MANAGEMENT TABLE -->
    <div v-else-if="activeTab === 'products'" class="space-y-6">
      
      <!-- Table Filter & Search -->
      <div class="flex flex-col sm:flex-row justify-between gap-4">
        <div class="relative flex-1 max-w-md">
          <i class="fa-solid fa-magnifying-glass absolute right-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2 text-gray-500 text-sm"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="بحث برقم الحذاء أو الاسم أو الماركة..."
            class="input-base text-xs pr-9 rtl:pr-9 rtl:pl-3"
          />
        </div>
        <button class="btn-primary text-xs py-2.5 px-4 gap-2" @click="openAddModal">
          <i class="fa-solid fa-plus"></i>
          <span>{{ t('admin.add_product') }}</span>
        </button>
      </div>

      <!-- Products Table -->
      <div class="bg-dark-card border border-dark-border rounded-2xl overflow-x-auto shadow-xl">
        <table class="w-full text-start text-xs text-gray-300">
          <thead class="bg-dark-hover border-b border-dark-border text-gray-400 font-bold uppercase tracking-wider">
            <tr>
              <th class="p-4 text-start">الحذاء</th>
              <th class="p-4 text-start">{{ t('admin.brand') }}</th>
              <th class="p-4 text-start">{{ t('admin.category') }}</th>
              <th class="p-4 text-start">{{ t('admin.price') }}</th>
              <th class="p-4 text-start">{{ t('admin.stock') }}</th>
              <th class="p-4 text-center">{{ t('admin.actions') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-dark-border/50">
            <tr v-for="p in filteredProducts" :key="p.id" class="hover:bg-dark-hover/50 transition-colors">
              <!-- Shoe & Name -->
              <td class="p-4 flex items-center gap-3">
                <img :src="p.image" class="w-12 h-12 rounded-lg object-cover bg-gray-900 flex-shrink-0" />
                <div>
                  <h4 class="font-bold text-white text-sm">{{ uiStore.isRTL ? p.name_ar : p.name_en }}</h4>
                  <p class="text-[10px] text-gray-500">ID: #{{ p.id }}</p>
                </div>
              </td>
              <!-- Brand -->
              <td class="p-4 font-bold text-brand-400">{{ p.brand }}</td>
              <!-- Category -->
              <td class="p-4">
                <span class="px-2 py-0.5 rounded-full bg-dark-hover border border-dark-border font-semibold">
                  {{ p.category }}
                </span>
              </td>
              <!-- Price -->
              <td class="p-4 font-black text-white text-sm">${{ p.price }}</td>
              <!-- Stock -->
              <td class="p-4 font-bold" :class="p.stock < 10 ? 'text-red-400' : 'text-green-400'">
                {{ p.stock }} قطعة
              </td>
              <!-- Actions -->
              <td class="p-4 text-center">
                <div class="flex items-center justify-center gap-2">
                  <button class="btn-icon w-8 h-8 text-xs text-blue-400 hover:border-blue-500/40" @click="openEditModal(p)" title="تعديل">
                    <i class="fa-solid fa-pen"></i>
                  </button>
                  <button class="btn-icon w-8 h-8 text-xs text-red-400 hover:border-red-500/40" @click="confirmDelete(p)" title="حذف">
                    <i class="fa-regular fa-trash-can"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>

    <!-- TAB 3: ORDERS MANAGEMENT -->
    <div v-else-if="activeTab === 'orders'" class="bg-dark-card border border-dark-border rounded-2xl p-6 space-y-4">
      <h3 class="text-lg font-bold text-white">الطلبات الحديثة (Simulated)</h3>
      <div class="space-y-3">
        <div v-for="order in recentOrders" :key="order.id" class="p-4 rounded-xl bg-dark-hover border border-dark-border flex justify-between items-center text-xs">
          <div>
            <h4 class="font-bold text-white text-sm">طلب #{{ order.id }} - {{ order.customer }}</h4>
            <p class="text-gray-400">{{ order.items }} منتجات • {{ order.date }}</p>
          </div>
          <div class="flex items-center gap-4">
            <span class="font-black text-white text-sm">${{ order.total }}</span>
            <span class="px-2.5 py-1 rounded-full font-bold text-[10px]" :class="orderStatusClass(order.status)">
              {{ order.status }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Add / Edit Product Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="isModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto" @click.self="isModalOpen = false">
          <div class="modal-content w-full max-w-xl bg-dark-card border border-dark-border rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 my-8">
            <div class="flex justify-between items-center border-b border-dark-border pb-4">
              <h3 class="text-xl font-bold text-white">{{ isEditing ? t('admin.edit_product') : t('admin.add_product') }}</h3>
              <button class="btn-icon" @click="isModalOpen = false">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form class="space-y-4" @submit.prevent="handleSaveProduct">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="text-xs font-bold text-gray-300 block mb-1">{{ t('admin.product_name_ar') }} *</label>
                  <input v-model="form.name_ar" type="text" required class="input-base" placeholder="أسترو سبيس 2026" />
                </div>
                <div>
                  <label class="text-xs font-bold text-gray-300 block mb-1">{{ t('admin.product_name_en') }} *</label>
                  <input v-model="form.name_en" type="text" required class="input-base" placeholder="Astro Space 2026" />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label class="text-xs font-bold text-gray-300 block mb-1">{{ t('admin.brand') }} *</label>
                  <select v-model="form.brand" class="input-base cursor-pointer">
                    <option v-for="b in BRANDS" :key="b" :value="b">{{ b }}</option>
                  </select>
                </div>
                <div>
                  <label class="text-xs font-bold text-gray-300 block mb-1">{{ t('admin.category') }} *</label>
                  <select v-model="form.category" class="input-base cursor-pointer">
                    <option v-for="c in CATEGORIES" :key="c" :value="c">{{ c }}</option>
                  </select>
                </div>
                <div>
                  <label class="text-xs font-bold text-gray-300 block mb-1">{{ t('admin.price') }} *</label>
                  <input v-model.number="form.price" type="number" step="5" required class="input-base" placeholder="199" />
                </div>
              </div>

              <div>
                <label class="text-xs font-bold text-gray-300 block mb-1">رابط صورة الحذاء (URL) *</label>
                <input v-model="form.image" type="url" required class="input-base text-xs" placeholder="https://images.unsplash.com/photo-..." />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="text-xs font-bold text-gray-300 block mb-1">{{ t('admin.stock') }} *</label>
                  <input v-model.number="form.stock" type="number" required class="input-base" placeholder="15" />
                </div>
              </div>

              <div class="flex justify-end gap-3 pt-4 border-t border-dark-border">
                <button type="button" class="btn-secondary text-xs" @click="isModalOpen = false">{{ t('common.cancel') }}</button>
                <button type="submit" class="btn-primary text-xs">{{ t('common.save') }}</button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../../stores/useAuthStore.js'
import { useProductStore } from '../../stores/useProductStore.js'
import { useNotificationStore } from '../../stores/useNotificationStore.js'
import { useUiStore } from '../../stores/useUiStore.js'
import { BRANDS, CATEGORIES } from '../../services/mockData.js'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const productStore = useProductStore()
const notificationStore = useNotificationStore()
const uiStore = useUiStore()

const activeTab = ref('overview')
const searchQuery = ref('')
const isModalOpen = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const tabs = [
  { id: 'overview', label: 'admin.overview', icon: 'fa-solid fa-chart-line' },
  { id: 'products', label: 'admin.manage_products', icon: 'fa-solid fa-shoe-prints' },
  { id: 'orders', label: 'admin.orders', icon: 'fa-solid fa-box' },
]

const monthlySales = {
  Jan: 24, Feb: 32, Mar: 45, Apr: 38, May: 52, Jun: 60
}

const recentOrders = [
  { id: 'ASTRO-9821', customer: 'خالد العتيبي', items: 2, total: '345.00', status: 'مكتمـل', date: '2026-07-21' },
  { id: 'ASTRO-9820', customer: 'سارة الشمري', items: 1, total: '185.00', status: 'قيد الشحن', date: '2026-07-21' },
  { id: 'ASTRO-9819', customer: 'محمد القحطاني', items: 3, total: '520.00', status: 'قيد التجهيز', date: '2026-07-20' },
]

const form = reactive({
  name_ar: '',
  name_en: '',
  brand: 'Nike',
  category: 'running',
  price: 180,
  stock: 15,
  image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
})

const filteredProducts = computed(() => {
  if (!searchQuery.value.trim()) return productStore.products
  const q = searchQuery.value.toLowerCase()
  return productStore.products.filter(p =>
    p.name_ar.includes(q) || p.name_en.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
  )
})

onMounted(() => {
  productStore.fetchProducts()
})

function handleLogout() {
  authStore.logoutAdmin()
  notificationStore.info('تم تسجيل خروج الأدمن')
  router.push('/')
}

function openAddModal() {
  isEditing.value = false
  editingId.value = null
  Object.assign(form, {
    name_ar: '',
    name_en: '',
    brand: 'Nike',
    category: 'running',
    price: 180,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
  })
  isModalOpen.value = true
}

function openEditModal(product) {
  isEditing.value = true
  editingId.value = product.id
  Object.assign(form, {
    name_ar: product.name_ar,
    name_en: product.name_en,
    brand: product.brand,
    category: product.category,
    price: product.price,
    stock: product.stock || 10,
    image: product.image,
  })
  isModalOpen.value = true
}

async function handleSaveProduct() {
  try {
    if (isEditing.value && editingId.value) {
      await productStore.updateProduct(editingId.value, { ...form })
      notificationStore.success(t('admin.save_success'))
    } else {
      await productStore.addProduct({ ...form })
      notificationStore.success(t('admin.save_success'))
    }
    isModalOpen.value = false
  } catch (err) {
    notificationStore.error(err.message || 'حدث خطأ في الحفظ')
  }
}

async function confirmDelete(product) {
  if (confirm(t('admin.confirm_delete'))) {
    try {
      await productStore.deleteProduct(product.id)
      notificationStore.success(t('admin.delete_success'))
    } catch (err) {
      notificationStore.error('فشل في حذف المنتج')
    }
  }
}

function orderStatusClass(status) {
  if (status === 'مكتمـل') return 'bg-green-500/20 text-green-400'
  if (status === 'قيد الشحن') return 'bg-blue-500/20 text-blue-400'
  return 'bg-yellow-500/20 text-yellow-400'
}
</script>
