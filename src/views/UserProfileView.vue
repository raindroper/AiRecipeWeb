<template>
  <div class="user-profile min-h-screen bg-gray-50 pb-[80px]">
    <!-- 1. Immersive Header -->
    <div class="relative h-48 bg-gradient-to-br from-orange-400 to-amber-300 overflow-hidden">
      <!-- Decorative circles -->
      <div
        class="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-white opacity-10 rounded-full blur-2xl"
      ></div>

      <div class="absolute top-4 right-4 z-10">
        <var-button round text color="transparent" text-color="#fff">
          <var-icon name="cog-outline" size="24" />
        </var-button>
      </div>
    </div>

    <!-- 2. Profile Card (Negative Margin) -->
    <div class="px-4 -mt-16 relative z-10">
      <div class="bg-white rounded-2xl shadow-sm p-4 pt-0">
        <div class="flex justify-between items-end -mt-10 mb-3">
          <var-avatar :src="user.avatarUrl" size="80" bordered class="border-4 border-white" />
          <var-button type="primary" size="small" round class="mb-2 shadow-orange-200 shadow-lg">
            编辑资料
          </var-button>
        </div>

        <h2 class="text-2xl font-bold text-gray-800">{{ displayName }}</h2>
        <p class="text-gray-400 text-sm mt-1 mb-4 flex items-center">
          <var-icon name="map-marker-radius" size="14" class="mr-1" />
          幸福一家人
        </p>

        <!-- Stats Row -->
        <div class="flex justify-between py-4 border-t border-gray-50">
          <div class="text-center flex-1">
            <div class="font-bold text-lg text-gray-800">12</div>
            <div class="text-xs text-gray-400 mt-1">菜谱</div>
          </div>
          <div class="text-center flex-1 border-l border-r border-gray-100">
            <div class="font-bold text-lg text-gray-800">1.2k</div>
            <div class="text-xs text-gray-400 mt-1">获赞</div>
          </div>
          <div class="text-center flex-1">
            <div class="font-bold text-lg text-gray-800">85</div>
            <div class="text-xs text-gray-400 mt-1">收藏</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. Content Tabs -->
    <div class="mt-4">
      <var-tabs
        v-model:active="activeTab"
        sticky
        offset-top="0"
        color="transparent"
        active-color="#f97316"
        inactive-color="#999"
        indicator-size="20"
      >
        <var-tab>健康</var-tab>
        <var-tab>厨房</var-tab>
        <var-tab>成员</var-tab>
      </var-tabs>

      <div class="p-4 transition-all duration-300">
        <!-- Tab 0: Health Config -->
        <div v-show="activeTab === 0" class="space-y-3">
          <!-- Body Metrics Card -->
          <div class="bg-white rounded-xl p-4 shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-bold text-gray-800 flex items-center">
                <var-icon name="heart-pulse" class="mr-2 text-red-500" /> 家庭档案
              </h3>
              <span class="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full"
                >刚刚更新</span
              >
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-gray-50 rounded-lg p-3 text-center">
                <div class="text-xs text-gray-400 mb-1">口味偏好</div>
                <div class="text-xl font-bold text-gray-800">{{ tastePreference }}</div>
              </div>
              <div class="bg-gray-50 rounded-lg p-3 text-center">
                <div class="text-xs text-gray-400 mb-1">家庭人数</div>
                <div class="text-xl font-bold text-gray-800">{{ familyCountText }}</div>
              </div>
            </div>
          </div>

          <!-- Preferences List -->
          <div class="bg-white rounded-xl overflow-hidden shadow-sm">
            <var-cell title="饮食目标" icon="flag-checkered" border>
              <template #extra>
                <div class="flex gap-1">
                  <var-chip
                    v-for="g in translatedGoals"
                    :key="g"
                    size="mini"
                    type="primary"
                    plain
                    >{{ g }}</var-chip
                  >
                </div>
              </template>
            </var-cell>
            <var-cell title="忌口/过敏" icon="alert-circle-outline" border>
              <template #extra>
                <div class="flex gap-1">
                  <var-chip
                    v-for="a in translatedAllergies"
                    :key="a"
                    size="mini"
                    type="danger"
                    plain
                    >{{ a }}</var-chip
                  >
                </div>
              </template>
            </var-cell>
            <var-cell title="特别关注" icon="hospital-marker" :border="false">
              <template #extra>
                <span class="text-sm text-gray-500">{{ translatedChronicText }}</span>
              </template>
            </var-cell>
          </div>
        </div>

        <!-- Tab 1: Kitchen -->
        <div v-show="activeTab === 1" class="space-y-3">
          <div class="bg-white rounded-xl p-4 shadow-sm">
            <h3 class="font-bold text-gray-800 mb-3 flex items-center">
              <var-icon name="chef-hat" class="mr-2 text-orange-500" /> 厨房设备
            </h3>
            <div class="flex flex-wrap gap-2">
              <div
                v-for="app in user.kitchenProfile.appliances"
                :key="app"
                class="flex flex-col items-center justify-center w-[calc(33.33%-8px)] aspect-square bg-gray-50 rounded-lg border border-gray-100"
              >
                <var-icon name="fire" size="24" class="text-gray-400 mb-2" />
                <span class="text-xs text-gray-600 text-center">{{ app }}</span>
              </div>
              <!-- Add Button -->
              <div
                class="flex flex-col items-center justify-center w-[calc(33.33%-8px)] aspect-square bg-white border border-dashed border-gray-300 rounded-lg text-gray-400"
              >
                <var-icon name="plus" size="24" />
                <span class="text-xs mt-1">添加</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 2: Family -->
        <div v-show="activeTab === 2">
          <div class="bg-white rounded-xl p-8 text-center shadow-sm">
            <div
              class="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <var-icon name="account-group" size="40" class="text-orange-400" />
            </div>
            <h3 class="text-lg font-bold text-gray-800 mb-2">家庭成员</h3>
            <p class="text-gray-400 text-sm mb-6">添加家庭成员，让每个人都获得个性化的饮食计划</p>
            <var-button type="primary" block>添加家庭成员</var-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const activeTab = ref(0)

const user = computed(() => userStore.currentUser)

const displayName = computed(() => {
  const name = user.value?.nickname || ''
  return name === 'Healthy Eater' ? '爱做饭的妈妈' : name
})

const tastePreference = computed(() => {
  return '清淡'
})

const familyCountText = computed(() => {
  return '3 人'
})

const translatedGoals = computed(() => {
  const goals = user.value?.healthConfig?.dietaryGoals || []
  return goals.map((g) => (g === 'Muscle Gain' ? '营养均衡' : g))
})

const translatedAllergies = computed(() => {
  const allergies = user.value?.healthConfig?.allergies || []
  const mapped = allergies.map((a) => (a === 'Peanuts' ? '花生' : a))
  if (allergies.includes('Peanuts')) mapped.push('海鲜')
  return mapped
})

const translatedChronicText = computed(() => {
  const chronic = user.value?.healthConfig?.chronicDiseases || []
  if (!chronic.length) return '无'
  if (chronic.includes('Diabetes')) return '少糖, 低脂'
  return chronic.join(', ')
})
</script>

<style scoped>
/* Custom overrides if needed */
</style>
