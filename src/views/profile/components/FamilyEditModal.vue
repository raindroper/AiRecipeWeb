<template>
  <var-popup
    :show="show"
    @update:show="$emit('update:show', $event)"
    position="bottom"
    class="rounded-t-[32px] bg-white"
    :overlay-style="{ backgroundColor: 'rgba(0,0,0,0.4)' }"
  >
    <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
      <button @click="$emit('update:show', false)" class="text-gray-500 text-sm">取消</button>
      <span class="font-bold text-gray-800 text-lg">家庭档案</span>
      <button @click="handleSave" class="text-orange-500 font-bold text-sm">保存</button>
    </div>
    <div class="p-6 space-y-6 h-[60vh] overflow-y-auto">
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-700">家庭人数</label>
        <div class="flex items-center gap-4 bg-gray-50 rounded-xl p-2 border border-gray-200">
          <button
            class="w-10 h-10 rounded-lg  shadow-sm text-gray-600 flex items-center justify-center text-xl font-bold active:scale-95 transition-transform"
            @click="localSize > 1 && localSize--"
          >
            <var-icon name="minus" />
          </button>
          <div class="flex-1 text-center font-bold text-xl text-gray-800">{{ localSize }} 人</div>
          <button
            class="w-10 h-10 rounded-lg  text-gray-600 shadow-sm flex items-center justify-center text-xl font-bold active:scale-95 transition-transform"
            @click="localSize++"
          >
            <var-icon name="plus" />
          </button>
        </div>
      </div>
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-700">口味偏好</label>
        <input
          v-model="localTaste"
          placeholder="例如：清淡、少油、微辣"
          class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-orange-400 transition-colors"
        />
      </div>
      <div class="space-y-3">
        <label class="text-sm font-medium text-gray-700">忌口/过敏源</label>
        <div class="flex flex-wrap gap-3">
          <button
            v-for="tag in allAllergyOptions"
            :key="tag"
            class="px-4 py-2 rounded-full text-sm font-medium border transition-all"
            :class="
              localAllergies.includes(tag)
                ? 'bg-red-50 border-red-200 text-red-500'
                : 'bg-white border-gray-200 text-gray-500'
            "
            @click="toggleAllergy(tag)"
          >
            {{ tag }}
          </button>
        </div>
      </div>
    </div>
  </var-popup>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: Boolean,
  initialSize: Number,
  initialTaste: String,
  initialAllergies: Array,
})

const emit = defineEmits(['update:show', 'save'])

const localSize = ref(3)
const localTaste = ref('')
const localAllergies = ref([])
const allAllergyOptions = ['花生', '海鲜', '芹菜', '牛奶', '麸质']

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      localSize.value = props.initialSize || 3
      localTaste.value = props.initialTaste || ''
      localAllergies.value = [...(props.initialAllergies || [])]
    }
  },
)

const toggleAllergy = (tag) => {
  const idx = localAllergies.value.indexOf(tag)
  if (idx >= 0) localAllergies.value.splice(idx, 1)
  else localAllergies.value.push(tag)
}

const handleSave = () => {
  emit('save', {
    size: localSize.value,
    taste: localTaste.value,
    allergies: localAllergies.value,
  })
}
</script>
