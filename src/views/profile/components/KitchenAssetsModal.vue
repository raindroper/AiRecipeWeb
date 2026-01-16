<template>
  <var-popup
    :show="show"
    @update:show="$emit('update:show', $event)"
    position="bottom"
    class="rounded-t-[32px] h-[90vh] flex flex-col bg-[#f8f9fa]"
    :overlay-style="{ backgroundColor: 'rgba(0,0,0,0.4)' }"
  >
    <!-- Sticky Header Section -->
    <div class="bg-white shadow-sm z-10 sticky top-0">
      <!-- Top Bar -->
      <div class="flex items-center justify-between px-6 py-4">
        <div class="text-xl font-bold text-gray-800 tracking-tight">厨房管理</div>
        <div class="flex items-center gap-5">
          <button
            @click="onConfirm"
            class="text-sm font-bold transition-colors text-orange-500 hover:text-orange-600"
          >
            完成
          </button>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 transition-colors bg-gray-100 rounded-full p-1"
          >
            <var-icon name="close" size="20" />
          </button>
        </div>
      </div>

      <!-- Search -->
      <div class="px-6 pb-2">
        <div
          class="group flex items-center w-full bg-gray-100/80 h-11 rounded-2xl px-4 transition-all border border-transparent focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-100 focus-within:border-orange-200"
        >
          <var-icon
            name="magnify"
            class="text-gray-400 group-focus-within:text-orange-400 transition-colors flex-shrink-0 mr-2"
            size="20"
          />
          <input
            v-model="searchQuery"
            class="flex-1 bg-transparent text-sm outline-none placeholder-gray-400 text-gray-700 h-full w-full"
            placeholder="搜索设备或食材..."
          />
        </div>
      </div>

      <!-- Tabs & Filters Row -->
      <div class="px-6 pb-4 pt-3 flex flex-col gap-3">
        <!-- Tabs -->
        <div class="flex bg-gray-100 rounded-xl p-1 w-full">
          <button
            @click="activeTab = 'equipment'"
            class="flex-1 py-2 rounded-lg text-sm font-bold transition-all relative overflow-hidden"
            :class="
              activeTab === 'equipment'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            "
          >
            厨房设备
          </button>
          <button
            @click="activeTab = 'ingredients'"
            class="flex-1 py-2 rounded-lg text-sm font-bold transition-all relative overflow-hidden"
            :class="
              activeTab === 'ingredients'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            "
          >
            已有食材
          </button>
        </div>

        <!-- Filter Chips (Horizontal Scroll) -->
        <div class="w-full overflow-x-auto no-scrollbar flex gap-2.5 pb-1">
          <button
            v-for="f in filters"
            :key="f"
            class="whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all"
            :class="
              activeFilter === f
                ? 'bg-orange-50 border-orange-200 text-orange-600'
                : 'bg-white border-gray-200 text-gray-500'
            "
            @click="activeFilter = activeFilter === f ? '' : f"
          >
            {{ f }}
          </button>
        </div>
      </div>
    </div>

    <!-- Content Grid -->
    <div class="flex-1 overflow-y-auto p-6 bg-[#f8f9fa]">
      <!-- Equipment Grid -->
      <div v-if="activeTab === 'equipment'">
        <div class="grid grid-cols-3 sm:grid-cols-4 gap-4">
          <div
            v-for="item in visibleEquipment"
            :key="item.name"
            class="aspect-square rounded-2xl bg-white border-2 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200 relative overflow-hidden group"
            :class="[
              localSelectedMap[item.name]
                ? 'border-orange-500 bg-orange-50'
                : 'border-transparent shadow-sm hover:border-orange-100',
              'active:scale-95',
            ]"
            @click="toggleSelect(item.name)"
          >
            <div
              class="w-12 h-12 rounded-full bg-orange-50/50 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300"
            >
              {{ item.icon }}
            </div>
            <span
              class="text-xs font-medium text-gray-600"
              :class="{ 'text-orange-600 font-bold': localSelectedMap[item.name] }"
            >
              {{ item.name }}
            </span>

            <!-- Selection Indicator -->
            <div
              v-if="localSelectedMap[item.name]"
              class="absolute top-2 right-2 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center"
            >
              <var-icon name="check" class="text-white" size="12" />
            </div>
          </div>
        </div>
        <!-- Empty State -->
        <div
          v-if="visibleEquipment.length === 0"
          class="flex flex-col items-center justify-center py-20 text-gray-400"
        >
          <var-icon name="magnify" size="48" class="mb-2 opacity-50" />
          <p class="text-sm">没有找到相关设备</p>
        </div>
      </div>

      <!-- Ingredients Grid -->
      <div v-else>
        <div class="grid grid-cols-3 sm:grid-cols-4 gap-4">
          <!-- Add Custom Card -->
          <div
            class="aspect-square rounded-2xl border-2 border-dashed border-orange-300 flex flex-col items-center justify-center gap-2 cursor-pointer bg-orange-50/30 hover:bg-orange-50 transition-colors group"
            @click="showAddDialog = true"
          >
            <div
              class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform"
            >
              <var-icon name="plus" size="24" />
            </div>
            <span class="text-xs font-bold text-orange-500">添加自选</span>
          </div>

          <div
            v-for="ing in visibleIngredients"
            :key="ing.name"
            class="aspect-square rounded-2xl bg-white border-2 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 relative"
            :class="[
              localSelectedMap[ing.name]
                ? 'border-orange-500 bg-orange-50'
                : 'border-transparent shadow-sm hover:border-orange-100',
              'active:scale-95',
            ]"
            @click="toggleSelect(ing.name)"
          >
            <span
              class="text-sm font-medium text-gray-700"
              :class="{ 'text-orange-600 font-bold': localSelectedMap[ing.name] }"
            >
              {{ ing.name }}
            </span>
            <span class="text-[10px] text-gray-400 mt-1">{{ ing.category }}</span>

            <!-- Selection Indicator -->
            <div
              v-if="localSelectedMap[ing.name]"
              class="absolute top-2 right-2 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center"
            >
              <var-icon name="check" class="text-white" size="10" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Ingredient Dialog -->
    <var-dialog
      v-model:show="showAddDialog"
      title="添加自定义食材"
      confirm-button-text="添加"
      cancel-button-text="取消"
      confirm-button-color="#f97316"
      @confirm="handleAddCustom"
    >
      <div class="py-4">
        <var-input
          v-model="newIngredientName"
          placeholder="请输入食材名称 (如: 藜麦)"
          variant="outlined"
          focus-color="#f97316"
        />
      </div>
    </var-dialog>
  </var-popup>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { Snackbar } from '@varlet/ui'

const props = defineProps({
  show: Boolean,
  selectedMap: {
    type: Object,
    default: () => ({}),
  },
  customIngredients: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:show', 'save', 'add-custom'])

const activeTab = ref('equipment')
const editMode = ref(true)
const searchQuery = ref('')
const activeFilter = ref('')
const filters = ['自选', '主食', '蔬菜', '肉类', '烘焙', '饮品', '调料']

// Local copy of selected map for editing
const localSelectedMap = reactive({})

// Dialog State
const showAddDialog = ref(false)
const newIngredientName = ref('')

// Static Data
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

// Computed
const allIngredientsList = computed(() => [...props.customIngredients, ...ingredientsAll])

const visibleEquipment = computed(() => {
  return equipmentAll.filter(
    (i) =>
      (activeFilter.value
        ? i.category === activeFilter.value || i.name.includes(activeFilter.value)
        : true) && (searchQuery.value ? i.name.includes(searchQuery.value) : true),
  )
})

const visibleIngredients = computed(() => {
  return allIngredientsList.value.filter(
    (i) =>
      (activeFilter.value
        ? i.category === activeFilter.value || i.name.includes(activeFilter.value)
        : true) && (searchQuery.value ? i.name.includes(searchQuery.value) : true),
  )
})

// Watch props to sync local state
watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      // Reset local state when opening
      Object.assign(localSelectedMap, props.selectedMap)
      editMode.value = true
      activeTab.value = 'equipment'
    }
  },
)

// Methods
const closeModal = () => {
  emit('update:show', false)
}

const toggleSelect = (key) => {
  localSelectedMap[key] = !localSelectedMap[key]
}

const onConfirm = () => {
  // Save
  const equipment = equipmentAll.filter((e) => localSelectedMap[e.name]).map((e) => e.name)
  const ingredients = allIngredientsList.value
    .filter((i) => localSelectedMap[i.name])
    .map((i) => i.name)

  // Sync back to local map to clean up any false entries if needed, or just emit
  emit('save', { equipment, ingredients })
  emit('update:show', false)
}

const handleAddCustom = () => {
  const name = newIngredientName.value.trim()
  if (!name) return

  if (allIngredientsList.value.some((i) => i.name === name)) {
    Snackbar.warning('该食材已存在')
    return
  }

  // Emit to parent to add custom ingredient
  emit('add-custom', name)

  // Optimistically select it
  localSelectedMap[name] = true

  showAddDialog.value = false
  newIngredientName.value = ''
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
