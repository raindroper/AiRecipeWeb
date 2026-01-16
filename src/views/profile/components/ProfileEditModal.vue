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
      <span class="font-bold text-gray-800 text-lg">编辑资料</span>
      <button @click="handleSave" class="text-orange-500 font-bold text-sm">保存</button>
    </div>
    <div class="p-6 space-y-6 h-[50vh] overflow-y-auto">
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-700">昵称</label>
        <input
          v-model="localNickname"
          class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-orange-400 transition-colors"
        />
      </div>
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-700">头像链接</label>
        <input
          v-model="localAvatar"
          class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-orange-400 transition-colors"
        />
        <p class="text-xs text-gray-400">支持输入网络图片 URL</p>
      </div>
    </div>
  </var-popup>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: Boolean,
  initialNickname: String,
  initialAvatar: String,
})

const emit = defineEmits(['update:show', 'save'])

const localNickname = ref('')
const localAvatar = ref('')

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      localNickname.value = props.initialNickname
      localAvatar.value = props.initialAvatar
    }
  },
)

const handleSave = () => {
  emit('save', { nickname: localNickname.value, avatarUrl: localAvatar.value })
}
</script>
