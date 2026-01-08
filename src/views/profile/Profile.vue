<template>
  <div class="min-h-screen bg-gray-50 pb-[100px]">
    <div v-if="!isLoggedIn" class="flex flex-col justify-center items-center h-[80vh] px-6">
      <div
        class="w-20 h-20 rounded-full bg-orange-500 flex items-center justify-center text-4xl text-white"
      >
        🍳
      </div>
      <div class="text-2xl font-bold text-gray-800 mb-8 mt-4">登录暖阳厨房</div>
      <div class="w-full max-w-md space-y-4">
        <var-input v-model="phone" placeholder="请输入手机号" />
        <var-input v-model="password" type="password" placeholder="请输入密码" />
        <var-button block class="mt-6" type="primary" :color="'#f97316'" @click="handleLogin"
          >登录</var-button
        >
      </div>
      <div class="mt-6 text-xs text-gray-500">登录即代表同意用户协议</div>
    </div>
    <div v-else class="contents">
      <div class="bg-gradient-to-br from-orange-400 to-amber-300">
        <div class="px-5 py-6 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <var-avatar :src="avatar" size="large" bordered class="border-4 border-white shadow" />
            <div>
              <div class="text-white text-xl font-bold">爱做饭的妈妈</div>
              <div class="text-white/90 text-xs">家庭主厨</div>
            </div>
          </div>
          <var-button round text color="white" text-color="#333">
            <var-icon name="cog-outline" size="24" />
          </var-button>
        </div>
      </div>

      <div class="px-5 -mt-6">
        <div class="bg-white rounded-2xl shadow-sm border border-amber-100 p-4">
          <div class="flex items-center justify-between">
            <div class="flex-1 text-center">
              <div class="text-orange-600 text-2xl font-bold">12</div>
              <div class="text-xs text-gray-500">私房菜谱</div>
            </div>
            <div class="flex-1 text-center">
              <div class="text-orange-600 text-2xl font-bold">45</div>
              <div class="text-xs text-gray-500">生成记录</div>
            </div>
            <div class="flex-1 text-center">
              <div class="text-orange-600 text-2xl font-bold">5</div>
              <div class="text-xs text-gray-500">厨房设备</div>
            </div>
          </div>
        </div>
      </div>

      <div class="px-5 mt-4 space-y-4">
        <var-card
          :elevation="0"
          class="rounded-2xl border border-amber-100 overflow-hidden cursor-pointer active:scale-[0.99] transition-transform"
          @click="openFamilyEditModal"
        >
          <div class="px-4 pt-4 pb-2 flex items-center justify-between">
            <div class="text-lg font-bold text-orange-900">家庭档案</div>
          </div>
          <div class="px-4 pb-4 space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-xl select-none">👨‍👩‍👧</span>
                <span class="text-orange-900 font-bold text-lg">{{ familySizeText }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xl select-none">🌶️</span>
                <span class="text-orange-900 font-bold text-lg">{{ tastePref }}</span>
              </div>
            </div>
            <div class="space-y-2">
              <div class="text-xs text-gray-500">🚫 忌口/过敏</div>
              <div class="flex flex-wrap gap-2">
                <var-chip
                  v-for="tag in allergies"
                  :key="tag"
                  size="small"
                  plain
                  style="background-color: #fef2f2; color: #ef4444"
                  >{{ tag }}</var-chip
                >
              </div>
            </div>
          </div>
        </var-card>

        <var-card
          :elevation="0"
          class="rounded-2xl border border-amber-100 overflow-hidden cursor-pointer"
          @click="openAssetsModal"
        >
          <div class="px-4 pt-4 pb-2 flex items-center justify-between">
            <div class="text-lg font-bold text-orange-900">厨房设备 · 食材</div>
          </div>
          <div class="px-4 pb-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="surface-elev-1 rounded-xl p-3">
                <div class="text-xs text-gray-500 mb-2">设备</div>
                <div class="grid grid-cols-2 gap-3">
                  <div
                    v-for="item in equipmentPreview"
                    :key="item.name"
                    class="flex flex-col items-center gap-1"
                  >
                    <div
                      class="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-xl"
                    >
                      {{ item.icon }}
                    </div>
                    <div class="text-xs text-gray-700">{{ item.name }}</div>
                  </div>
                  <div v-if="equipmentOverflow > 0" class="flex items-center justify-center">
                    <span class="pill-outline" title="查看更多">+{{ equipmentOverflow }}</span>
                  </div>
                </div>
              </div>
              <div class="surface-elev-1 rounded-xl p-3">
                <div class="text-xs text-gray-500 mb-2">已有食材</div>
                <div class="flex flex-wrap gap-2">
                  <span v-for="ing in ingredientsPreview" :key="ing.name" class="pill">{{
                    ing.name
                  }}</span>
                  <span v-if="ingredientsOverflow > 0" class="pill-outline" title="查看更多"
                    >+{{ ingredientsOverflow }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </var-card>

        <var-popup
          v-model:show="familyEditModal"
          position="bottom"
          class="rounded-t-3xl h-[70vh] flex flex-col"
          :overlay-style="{ backgroundColor: 'rgba(0,0,0,0.25)' }"
        >
          <div class="flex-none px-4 pt-4 pb-3 border-b border-amber-100">
            <div class="text-orange-900 font-bold">编辑家庭档案</div>
          </div>
          <div class="flex-1 overflow-y-auto p-4 space-y-4">
            <div class="surface-elev-1 rounded-xl p-3">
              <div class="text-xs text-gray-500 mb-2">人数</div>
              <input type="number" min="1" class="search-input" v-model.number="familySize" />
            </div>
            <div class="surface-elev-1 rounded-xl p-3">
              <div class="text-xs text-gray-500 mb-2">口味偏好</div>
              <input
                type="text"
                class="search-input"
                v-model="tastePref"
                placeholder="如：清淡, 少油"
              />
            </div>
            <div class="surface-elev-1 rounded-xl p-3">
              <div class="text-xs text-gray-500 mb-2">忌口/过敏</div>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in allAllergyOptions"
                  :key="tag"
                  class="pill"
                  :class="{ selected: allergies.includes(tag) }"
                  @click="toggleAllergy(tag)"
                  >{{ tag }}</span
                >
              </div>
            </div>
          </div>
          <div class="flex-none p-4 border-t border-amber-100 flex gap-2">
            <button class="pill-outline" @click="closeFamilyEditModal">关闭</button>
            <button class="pill-outline" @click="saveFamilyEdit">保存</button>
          </div>
        </var-popup>

        <var-popup
          v-model:show="assetsModal"
          position="bottom"
          class="rounded-t-3xl h-[86vh] flex flex-col"
          :overlay-style="{ backgroundColor: 'rgba(0,0,0,0.25)' }"
        >
          <div class="flex-none px-4 pt-4 pb-3 border-b border-amber-100">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <button
                  class="tab-btn"
                  :class="{ active: activeTab === 'equipment' }"
                  @click="activeTab = 'equipment'"
                >
                  设备
                </button>
                <button
                  class="tab-btn"
                  :class="{ active: activeTab === 'ingredients' }"
                  @click="activeTab = 'ingredients'"
                >
                  食材
                </button>
              </div>
              <div class="flex items-center gap-2">
                <button class="pill-outline" @click="editMode = !editMode">
                  {{ editMode ? '完成' : '编辑' }}
                </button>
                <button class="pill-outline" @click="closeAssetsModal">关闭</button>
              </div>
            </div>
            <div class="mt-3 flex items-center gap-2">
              <input v-model="searchQuery" type="text" class="search-input" placeholder="搜索..." />
              <div class="flex gap-2 overflow-x-auto no-scrollbar">
                <button
                  v-for="f in filters"
                  :key="f"
                  class="pill-outline"
                  :class="{ 'active-filter': activeFilter === f }"
                  @click="activeFilter = activeFilter === f ? '' : f"
                >
                  {{ f }}
                </button>
              </div>
            </div>
          </div>

          <div class="flex-1 overflow-y-auto p-4">
            <div
              v-if="activeTab === 'equipment'"
              class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3"
            >
              <div
                v-for="item in visibleEquipment"
                :key="item.name"
                class="grid-item"
                :class="{ selected: editMode && selectedMap[item.name] }"
                @click="toggleSelect(item.name)"
              >
                <div
                  class="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-2xl"
                >
                  {{ item.icon }}
                </div>
                <div class="text-xs text-gray-700 mt-1">{{ item.name }}</div>
              </div>
            </div>
            <div v-else class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              <div
                v-for="ing in visibleIngredients"
                :key="ing.name"
                class="pill large"
                :class="{ selected: editMode && selectedMap[ing.name] }"
                @click="toggleSelect(ing.name)"
              >
                {{ ing.name }}
              </div>
            </div>
          </div>
        </var-popup>

        <var-card :elevation="0" class="rounded-2xl border border-amber-100 overflow-hidden">
          <div>
            <var-cell title="帮助与反馈" icon="message-text" clickable border />
            <var-cell title="关于应用" icon="information" clickable border />
            <var-cell
              title="退出登录"
              icon="logout"
              clickable
              :border="false"
              @click="handleLogout"
            />
          </div>
        </var-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { cloudService } from '@/utils/cloud'
import { Snackbar } from '@varlet/ui'

const store = useUserStore()
const avatar = computed(
  () => store?.currentUser?.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chef',
)

const isLoggedIn = ref(false)
const phone = ref('')
const password = ref('')

const moreAllergies = []
const familyEditModal = ref(false)
const familySize = ref(3)
const tastePref = ref('清淡, 少油')
const allergies = ref(['花生', '海鲜'])
const allAllergyOptions = ['花生', '海鲜', '芹菜', '牛奶', '麸质']
const familySizeText = computed(() => `${familySize.value}人餐`)

const assetsModal = ref(false)
const activeTab = ref('equipment')
const editMode = ref(false)
const searchQuery = ref('')
const activeFilter = ref('')
const filters = ['主食', '蔬菜', '肉类', '烘焙', '饮品', '调料']
const selectedMap = reactive({})

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

const equipmentPreviewLimit = 5
const ingredientsPreviewLimit = 9
const equipmentPreview = computed(() => equipmentAll.slice(0, equipmentPreviewLimit))
const ingredientsPreview = computed(() => ingredientsAll.slice(0, ingredientsPreviewLimit))
const equipmentOverflow = computed(() => Math.max(0, equipmentAll.length - equipmentPreviewLimit))
const ingredientsOverflow = computed(() =>
  Math.max(0, ingredientsAll.length - ingredientsPreviewLimit),
)

const visibleEquipment = computed(() => {
  const base = equipmentAll.filter(
    (i) =>
      (activeFilter.value
        ? i.category === activeFilter.value || i.name.includes(activeFilter.value)
        : true) && (searchQuery.value ? i.name.includes(searchQuery.value) : true),
  )
  return base
})

const visibleIngredients = computed(() => {
  const base = ingredientsAll.filter(
    (i) =>
      (activeFilter.value
        ? i.category === activeFilter.value || i.name.includes(activeFilter.value)
        : true) && (searchQuery.value ? i.name.includes(searchQuery.value) : true),
  )
  return base
})

const openAssetsModal = () => {
  assetsModal.value = true
}
const closeAssetsModal = () => {
  assetsModal.value = false
}
const toggleSelect = (key) => {
  selectedMap[key] = !selectedMap[key]
}

const openFamilyEditModal = () => {
  familyEditModal.value = true
}
const closeFamilyEditModal = () => {
  familyEditModal.value = false
}
const toggleAllergy = (tag) => {
  const idx = allergies.value.indexOf(tag)
  if (idx >= 0) allergies.value.splice(idx, 1)
  else allergies.value.push(tag)
}
const saveFamilyEdit = () => {
  familyEditModal.value = false
}

const handleLogin = async () => {
  try {
    const user = await cloudService.loginByPhone(phone.value, password.value)
    localStorage.setItem('user_token', user.id || 'user_token')
    localStorage.setItem('user_profile', JSON.stringify(user))
    isLoggedIn.value = true
    Snackbar.success('欢迎回来')
  } catch (e) {
    const msg = typeof e?.message === 'string' ? e.message : '登录失败'
    Snackbar.error(msg)
  }
}

const handleLogout = () => {
  localStorage.removeItem('user_token')
  isLoggedIn.value = false
}

onMounted(() => {
  const token = localStorage.getItem('user_token')
  isLoggedIn.value = !!token
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.flat-btn {
  padding: 4px 10px;
  border-radius: 9999px;
  background-color: #fff7ed !important;
  border: 1px solid #fed7aa !important;
  color: #ea580c !important;
  box-shadow: none !important;
}
.flat-btn:hover {
  background-color: #ffedd5 !important;
}
.flat-btn:active {
  background-color: #fed7aa !important;
}

.surface-elev-1 {
  background: #fff;
  box-shadow: 0 6px 20px rgba(251, 146, 60, 0.06);
  border: 1px solid #fde9c9;
}
.pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 9999px;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #374151;
  font-size: 12px;
}
.pill.large {
  justify-content: center;
  padding: 8px 12px;
}
.pill-outline {
  padding: 6px 10px;
  border-radius: 9999px;
  border: 1px solid #fed7aa;
  background: #fff7ed;
  color: #ea580c;
}
.active-filter {
  background: #ffedd5;
}
.tab-btn {
  padding: 6px 10px;
  border-radius: 9999px;
  background: #fff7ed;
  color: #ea580c;
  border: 1px solid #fed7aa;
}
.tab-btn.active {
  background: #ffedd5;
}
.search-input {
  flex: 1;
  border: 1px solid #fed7aa;
  background: #fff7ed;
  border-radius: 9999px;
  padding: 8px 12px;
  font-size: 12px;
  outline: none;
}
.grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border-radius: 12px;
  border: 1px solid #f4e6d4;
  background: #fff;
}
.grid-item.selected,
.pill.selected {
  border-color: #f97316;
  background: #fff7ed;
  color: #ea580c;
}
</style>
