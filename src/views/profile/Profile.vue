<template>
  <div class="min-h-screen bg-[#f8f9fa] pb-[120px]">
    <!-- Login View -->
    <div v-if="!isLoggedIn" class="flex flex-col justify-center items-center h-[90vh] px-8">
      <div
        class="w-24 h-24 rounded-full bg-gradient-to-tr from-orange-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-200 mb-6"
      >
        <span class="text-5xl">🍳</span>
      </div>
      <h1 class="text-2xl font-bold text-gray-900 mb-2">欢迎来到暖阳厨房</h1>
      <p class="text-gray-500 text-sm mb-10">记录美食，分享爱与温暖</p>

      <div class="w-full max-w-sm space-y-5">
        <var-input
          v-model="phone"
          placeholder="手机号"
          variant="outlined"
          :active-color="'#f97316'"
          focus-color="#f97316"
        >
          <template #prepend-icon>
            <var-icon name="phone" />
          </template>
        </var-input>
        <var-input
          v-model="password"
          type="password"
          placeholder="密码"
          variant="outlined"
          :active-color="'#f97316'"
          focus-color="#f97316"
        >
          <template #prepend-icon>
            <var-icon name="lock" />
          </template>
        </var-input>
        <var-button
          block
          class="mt-8 h-12 rounded-xl text-lg shadow-lg shadow-orange-200"
          color="linear-gradient(to right, #f97316, #fb923c)"
          text-color="#fff"
          @click="handleLogin"
        >
          立即登录
        </var-button>
      </div>
      <p class="mt-6 text-xs text-gray-400">登录即代表同意《用户协议》与《隐私政策》</p>
    </div>

    <!-- Main Profile View -->
    <div v-else class="contents">
      <!-- Header -->
      <header
        class="relative bg-gradient-to-br from-[#ff9f43] to-[#ff6b6b] pt-14 pb-20 px-6 rounded-b-[40px] shadow-sm"
      >
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-4">
            <div class="relative">
              <var-avatar
                :src="avatar"
                size="72"
                bordered
                class="border-4 border-white/30 shadow-md"
              />
              <div
                v-if="store.currentUser?.isPro"
                class="absolute -bottom-1 -right-1 bg-yellow-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm border border-white"
              >
                PRO
              </div>
            </div>
            <div>
              <h2 class="text-white text-2xl font-bold tracking-wide">{{ nickname }}</h2>
              <p class="text-white/80 text-sm mt-0.5 font-medium">{{ userRole }}</p>
            </div>
          </div>
          <button
            class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            @click="openProfileModal"
          >
            <var-icon name="cog-outline" size="22" />
          </button>
        </div>
      </header>

      <!-- Stats Card -->
      <div class="px-6 -mt-12 mb-6 relative z-10">
        <div
          class="bg-white rounded-2xl shadow-xl shadow-orange-100/50 p-6 flex justify-between items-center border border-orange-50/50"
        >
          <div class="flex-1 text-center border-r border-gray-100 last:border-0">
            <div class="text-orange-600 text-2xl font-bold font-mono">0</div>
            <div class="text-xs text-gray-400 mt-1 font-medium">私房菜谱</div>
          </div>
          <div class="flex-1 text-center border-r border-gray-100 last:border-0">
            <div class="text-orange-600 text-2xl font-bold font-mono">0</div>
            <div class="text-xs text-gray-400 mt-1 font-medium">生成记录</div>
          </div>
          <div class="flex-1 text-center">
            <div class="text-orange-600 text-2xl font-bold font-mono">{{ equipmentCount }}</div>
            <div class="text-xs text-gray-400 mt-1 font-medium">厨房设备</div>
          </div>
        </div>
      </div>

      <!-- Action Cards -->
      <div class="px-6 space-y-5">
        <!-- Family Card -->
        <div
          class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 active:scale-[0.98] transition-all cursor-pointer group"
          @click="openFamilyEditModal"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <div
                class="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500"
              >
                <var-icon name="account-circle-outline" />
              </div>
              <span class="text-lg font-bold text-gray-800">家庭档案</span>
            </div>
            <var-icon
              name="chevron-right"
              class="text-gray-300 group-hover:text-orange-400 transition-colors"
            />
          </div>

          <div class="bg-gray-50 rounded-xl p-4 flex flex-col gap-3">
            <div class="flex items-center justify-between">
              <div class="flex grow-0 shrink-0 items-center gap-2 text-sm text-gray-600">
                <span class="text-lg">👨‍👩‍👧</span>
                <span>{{ familySizeText }}</span>
              </div>
              <div class="h-4 w-[1px] bg-gray-300 mx-4"></div>
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <span class="text-lg">🌶️</span>
                <span class="line-clamp-2">{{ tastePref || '口味未设置' }}</span>
              </div>
            </div>
            <div
              v-if="allergies.length > 0"
              class="flex flex-wrap gap-2 pt-2 border-t border-gray-200 border-dashed"
            >
              <span class="text-xs text-gray-400 py-1">忌口:</span>
              <var-chip
                v-for="tag in allergies"
                :key="tag"
                size="mini"
                plain
                :color="'#ef4444'"
                class="bg-red-50 border-red-100 text-red-500"
                >{{ tag }}</var-chip
              >
            </div>
          </div>
        </div>

        <!-- Assets Card -->
        <div
          class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 active:scale-[0.98] transition-all cursor-pointer group"
          @click="openAssetsModal"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <div
                class="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-500"
              >
                <var-icon name="notebook-outline" />
              </div>
              <span class="text-lg font-bold text-gray-800">厨房管理</span>
            </div>
            <var-icon
              name="chevron-right"
              class="text-gray-300 group-hover:text-orange-400 transition-colors"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <!-- Equipment Preview -->
            <div class="bg-gray-50 rounded-xl p-3 flex flex-col h-full">
              <span class="text-xs font-bold text-gray-500 mb-2 block">我的设备</span>
              <div
                v-if="equipmentPreview.length > 0"
                class="flex-1 flex flex-wrap gap-2 content-start"
              >
                <div
                  v-for="item in equipmentPreview.slice(0, 4)"
                  :key="item.name"
                  class="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-sm border border-gray-100"
                  :title="item.name"
                >
                  {{ item.icon }}
                </div>
                <div
                  v-if="equipmentOverflow > 0"
                  class="w-8 h-8 rounded-full bg-orange-100 text-orange-500 text-xs flex items-center justify-center font-bold"
                >
                  +{{ equipmentOverflow }}
                </div>
              </div>
              <div
                v-else
                class="flex-1 flex items-center justify-center text-xs text-gray-400 py-2"
              >
                暂无设备
              </div>
            </div>

            <!-- Ingredients Preview -->
            <div class="bg-gray-50 rounded-xl p-3 flex flex-col h-full">
              <span class="text-xs font-bold text-gray-500 mb-2 block">我的食材</span>
              <div
                v-if="ingredientsPreview.length > 0"
                class="flex-1 flex flex-wrap gap-1.5 content-start"
              >
                <span
                  v-for="ing in ingredientsPreview.slice(0, 3)"
                  :key="ing.name"
                  class="px-2 py-1 bg-white rounded text-[10px] text-gray-600 border border-gray-100 shadow-sm truncate max-w-full"
                >
                  {{ ing.name }}
                </span>
                <span
                  v-if="ingredientsOverflow > 0"
                  class="px-2 py-1 bg-orange-50 text-orange-500 rounded text-[10px] font-bold"
                >
                  +{{ ingredientsOverflow }}
                </span>
              </div>
              <div
                v-else
                class="flex-1 flex items-center justify-center text-xs text-gray-400 py-2"
              >
                暂无食材
              </div>
            </div>
          </div>
        </div>

        <!-- Settings List -->
        <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          <var-cell
            title="帮助与反馈"
            icon="message-text-outline"
            clickable
            border
            class="hover:bg-gray-50 transition-colors"
          />
          <var-cell
            title="关于应用"
            icon="information-outline"
            clickable
            border
            class="hover:bg-gray-50 transition-colors"
          />
          <var-cell
            title="退出登录"
            icon="power"
            clickable
            :border="false"
            class="text-red-500 hover:bg-red-50 transition-colors"
            @click="handleLogout"
          />
        </div>
      </div>

      <!-- Modals Components -->
      <ProfileEditModal
        v-model:show="profileEditModal"
        :initial-nickname="nickname"
        :initial-avatar="avatar"
        @save="saveBasicInfo"
      />

      <FamilyEditModal
        v-model:show="familyEditModal"
        :initial-size="familySize"
        :initial-taste="tastePref"
        :initial-allergies="allergies"
        @save="saveFamilyEdit"
      />

      <KitchenAssetsModal
        v-model:show="assetsModal"
        :selected-map="selectedMap"
        :custom-ingredients="customIngredients"
        @save="saveKitchenAssets"
        @add-custom="handleAddCustom"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { cloudService } from '@/utils/cloud'
import { Snackbar } from '@varlet/ui'
import ProfileEditModal from './components/ProfileEditModal.vue'
import FamilyEditModal from './components/FamilyEditModal.vue'
import KitchenAssetsModal from './components/KitchenAssetsModal.vue'

const store = useUserStore()
const avatar = computed(
  () => store?.currentUser?.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chef',
)
const nickname = computed(() => store?.currentUser?.nickname || '爱做饭的妈妈')
const userRole = computed(() => (store?.currentUser?.isPro ? 'Pro 会员' : '家庭主厨'))

const isLoggedIn = ref(false)
const phone = ref('')
const password = ref('')

// Modal States
const profileEditModal = ref(false)
const familyEditModal = ref(false)
const assetsModal = ref(false)

// Family State
const familySize = ref(3)
const tastePref = ref('清淡, 少油')
const allergies = ref(['花生', '海鲜'])
const familySizeText = computed(() => `${familySize.value}人`)

// Kitchen Assets State
const customIngredients = ref([])
const selectedMap = reactive({})

// Computed Previews for Cards
const equipmentAll = [
  { icon: '🔥', name: '燃气灶', category: '火源' },
  { icon: '💨', name: '空气炸锅', category: '烘焙' },
  { icon: '🥘', name: '烤箱', category: '烘焙' },
  { icon: '🌪️', name: '破壁机', category: '饮品' },
  { icon: '🍳', name: '电磁炉', category: '火源' },
  { icon: '🍚', name: '电饭煲', category: '主食' },
  { icon: '🍲', name: '电压力锅', category: '主食' },
  { icon: '🥣', name: '慢炖锅', category: '主食' },
  { icon: '🫖', name: '电热水壶', category: '饮品' },
  { icon: '🧇', name: '华夫饼机', category: '烘焙' },
  { icon: '🥤', name: '榨汁机', category: '饮品' },
  { icon: '🍞', name: '面包机', category: '烘焙' },
  { icon: '🍝', name: '意面机', category: '主食' },
  { icon: '🧊', name: '制冰机', category: '饮品' },
]

const ingredientsAll = [
  { name: '鸡蛋', category: '主食' },
  { name: '西红柿', category: '蔬菜' },
  { name: '土豆', category: '蔬菜' },
  { name: '胡萝卜', category: '蔬菜' },
  { name: '牛肉', category: '肉类' },
  { name: '鸡胸肉', category: '肉类' },
  { name: '三文鱼', category: '肉类' },
  { name: '面粉', category: '烘焙' },
  { name: '黄油', category: '烘焙' },
  { name: '牛奶', category: '饮品' },
  { name: '酸奶', category: '饮品' },
  { name: '玉米', category: '蔬菜' },
  { name: '洋葱', category: '蔬菜' },
  { name: '青椒', category: '蔬菜' },
  { name: '香菇', category: '蔬菜' },
  { name: '酱油', category: '调料' },
  { name: '食盐', category: '调料' },
  { name: '黑胡椒', category: '调料' },
  { name: '蜂蜜', category: '烘焙' },
]

const equipmentPreview = computed(() => {
  const selected = equipmentAll.filter((e) => selectedMap[e.name])
  return selected.slice(0, 5)
})
const equipmentOverflow = computed(() => {
  const count = Object.values(selectedMap).filter((v) => v).length
  return Math.max(0, count - 5)
})
const equipmentCount = computed(() => Object.values(selectedMap).filter((v) => v).length)

const ingredientsPreview = computed(() => {
  // Combine custom + preset for preview
  const all = [...customIngredients.value, ...ingredientsAll]
  const selected = all.filter((i) => selectedMap[i.name])
  return selected.slice(0, 9)
})
const ingredientsOverflow = computed(() => {
  const count = Object.values(selectedMap).filter((v) => v).length
  return Math.max(0, count - 9)
})

// Data Loading & Saving
const loadData = async () => {
  if (!store.currentUser?.id) return
  try {
    const res = await cloudService.callFunction('user-center', {
      action: 'get',
      userId: store.currentUser.id,
    })
    if (res.ret.code === 0) {
      const user = res.result
      store.updateProfile(user)

      // Family Context
      try {
        const fc = user.familyContext ? JSON.parse(user.familyContext) : {}
        familySize.value = fc.size || 3
        tastePref.value = fc.taste || ''
        allergies.value = fc.allergies || []
      } catch (e) {
        console.warn('Parse familyContext failed', e)
        familySize.value = 3
        tastePref.value = ''
        allergies.value = []
      }

      // Kitchen Profile
      try {
        const kp = user.kitchenProfile ? JSON.parse(user.kitchenProfile) : {}
        for (const key in selectedMap) delete selectedMap[key]
        customIngredients.value = [] // Reset custom

        if (Array.isArray(kp.equipment)) {
          kp.equipment.forEach((e) => (selectedMap[e] = true))
        }
        if (Array.isArray(kp.ingredients)) {
          kp.ingredients.forEach((i) => {
            selectedMap[i] = true
            const exists = ingredientsAll.some((item) => item.name === i)
            if (!exists) {
              if (!customIngredients.value.some((c) => c.name === i)) {
                customIngredients.value.push({ name: i, category: '自选' })
              }
            }
          })
        }
      } catch (e) {
        console.warn('Parse kitchenProfile failed', e)
        for (const key in selectedMap) delete selectedMap[key]
      }
    }
  } catch (e) {
    console.error('Load profile error:', e)
  }
}

const updateRemote = async (updateData) => {
  try {
    const res = await cloudService.callFunction('user-center', {
      action: 'update',
      userId: store.currentUser.id,
      data: updateData,
    })
    if (res.ret.code === 0) {
      store.updateProfile(res.result)
      Snackbar.success('保存成功')
    } else {
      Snackbar.error(res.ret.desc)
    }
  } catch (e) {
    console.error(e)
    Snackbar.error('保存失败')
  }
}

// Actions
const openProfileModal = () => (profileEditModal.value = true)
const openFamilyEditModal = () => (familyEditModal.value = true)
const openAssetsModal = () => (assetsModal.value = true)

const saveBasicInfo = async (data) => {
  await updateRemote(data)
  profileEditModal.value = false
}

const saveFamilyEdit = async (data) => {
  familySize.value = data.size
  tastePref.value = data.taste
  allergies.value = data.allergies
  await updateRemote({ familyContext: JSON.stringify(data) })
  familyEditModal.value = false
}

const saveKitchenAssets = async ({ equipment, ingredients }) => {
  // Update local map first to reflect changes immediately
  // Reset map first? Or just update.
  // The Child sends us the LIST of selected names. We should update map to match.
  for (const key in selectedMap) delete selectedMap[key]
  equipment.forEach((e) => (selectedMap[e] = true))
  ingredients.forEach((i) => (selectedMap[i] = true))

  const data = { equipment, ingredients }
  await updateRemote({ kitchenProfile: JSON.stringify(data) })
  assetsModal.value = false
}

const handleAddCustom = (name) => {
  customIngredients.value.push({ name, category: '自选' })
  // Also select it in parent map?
  // The child component does local selection, but if we close/reopen, we rely on parent map.
  // The child component emits 'add-custom' then updates its local map.
  // We should also update our map so the preview card updates instantly if we close.
  // Wait, if we don't save, should we update?
  // User flow: Add custom -> Selects it (in modal) -> Clicks Save.
  // If user adds custom but cancels modal, the custom ingredient persists in list but not selection?
  // Let's keep it simple: Add custom adds to list. Selection happens via save.
  // But for the preview card to update if we save, we need it in list.
}

const handleLogin = async () => {
  try {
    const user = await cloudService.loginByPhone(phone.value, password.value)
    localStorage.setItem('user_token', user.id)
    localStorage.setItem('user_profile', JSON.stringify(user))
    store.updateProfile(user)
    isLoggedIn.value = true
    Snackbar.success('欢迎回来')
    loadData()
  } catch (e) {
    const msg = typeof e?.message === 'string' ? e.message : '登录失败'
    Snackbar.error(msg)
  }
}

const handleLogout = () => {
  localStorage.removeItem('user_token')
  localStorage.removeItem('user_profile')
  isLoggedIn.value = false
  store.updateProfile({})
}

onMounted(() => {
  const token = localStorage.getItem('user_token')
  const profileStr = localStorage.getItem('user_profile')
  if (token) {
    isLoggedIn.value = true
    if (profileStr) {
      try {
        const p = JSON.parse(profileStr)
        store.updateProfile(p)
      } catch (e) {}
    }
    loadData()
  }
})
</script>

<style scoped>
@import "tailwindcss";

/* [Refactor]: Extract repeating login view styles */
.login-container {
  @apply flex flex-col justify-center items-center h-[90vh] px-8;
}

.logo-circle {
  @apply w-24 h-24 rounded-full bg-gradient-to-tr from-orange-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-200 mb-6;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
