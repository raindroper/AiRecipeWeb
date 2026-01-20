import { defineStore } from 'pinia'
import { UserProfile } from '@/models/UserProfile'
import { cloudService } from '@/utils/cloud'
import agconnect from '@agconnect/api'

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null,
  }),
  actions: {
    updateProfile(data) {
      if (!data) {
        this.currentUser = null
        return
      }
      if (!this.currentUser) {
        this.currentUser = new UserProfile(data)
      } else {
        Object.assign(this.currentUser, data)
      }
    },

    async initAuth() {
      // 1. 恢复本地状态
      const profileStr = localStorage.getItem('user_profile')
      if (profileStr) {
        try {
          const user = JSON.parse(profileStr)
          this.updateProfile(user)
        } catch (e) {
          console.error('Failed to restore user profile:', e)
          localStorage.removeItem('user_profile')
        }
      }

      // 2. 检查 SDK 登录状态
      cloudService.init()
      try {
        const sdkUser = await agconnect.auth().getCurrentUser()

        if (this.currentUser) {
          // Case A: 本地认为已登录
          if (!sdkUser) {
            console.warn(
              '⚠️ Session expired (SDK is null). Attempting to restore session from local token if possible, or logout.',
            )

            // 尝试补救：如果是开发环境或特殊情况，SDK 可能没初始化好。
            // 但如果 SDK 明确返回 null，说明 Session 确实没了。
            // 在华为 AGC 中，Session 存储在 IndexedDB/LocalStorage，刷新页面通常会自动恢复。
            // 如果这里取不到，可能是 init() 时序问题，或者 Session 真的丢了。

            // 为了避免误杀，我们这里先做一个更宽松的检查：
            // 如果本地有 profile，我们暂时信任本地，让用户保持登录态。
            // 只有当用户真正发起需要权限的网络请求失败时（例如 401），再踢出用户。
            console.log(
              '⚠️ SDK User is missing but Local Profile exists. Trusting Local Profile for now.',
            )

            // this.currentUser = null
            // localStorage.removeItem('user_profile')
            // localStorage.removeItem('user_token')
          } else {
            console.log('✅ Auth restored:', sdkUser.getUid())
          }
        } else {
          // Case B: 本地未登录 (访客)
          // 只有这种情况才尝试匿名登录
          await cloudService.loginAnonymously()
        }
      } catch (e) {
        console.error('Auth check failed:', e)
      }
    },
  },
})
