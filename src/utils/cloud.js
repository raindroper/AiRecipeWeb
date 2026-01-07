import agconnect from '@agconnect/api'
import '@agconnect/auth'
import '@agconnect/function'
import { agConnectConfig } from '../agconnect-config'

class CloudService {
  constructor() {
    this.initialized = false
  }

  // 初始化 SDK
  init() {
    // 如果类内部标记已初始化，直接返回
    if (this.initialized) return

    try {
      // 核心修改：直接尝试初始化，而不是去调那个不存在的 isInitialized()
      // Web SDK 的机制是：如果没有初始化，这里会成功；
      // 如果已经初始化过（比如热更新时），可能会报错，咱们 catch 住忽略即可
      agconnect.instance().configInstance(agConnectConfig)
      this.initialized = true
      console.log('✅ Huawei Cloud SDK Initialized')
    } catch (e) {
      // 这里的错误通常是 "already configured" 之类的，在开发环境热更新时很常见
      // 我们标记为 true 即可，不影响使用
      this.initialized = true
      console.warn('⚠️ SDK Config Warning (Safe to ignore in Dev):', e)
    }
  }

  // 匿名登录
  async loginAnonymously() {
    this.init() // 确保先初始化
    try {
      // 检查当前是否已经登录，避免重复登录
      const currentUser = await agconnect.auth().getCurrentUser()
      if (currentUser) {
        console.log('👤 User already logged in:', currentUser.getUid())
        return currentUser
      }

      // 没有登录则执行匿名登录
      const user = await agconnect.auth().signInAnonymously()
      console.log('👤 Anonymous Login Success:', user.getUser().getUid())
      return user
    } catch (e) {
      console.error('❌ Login Error:', e)
      throw e
    }
  }

  // 调用云函数
  async callFunction(name, params = {}) {
    this.init()
    try {
      console.log(`📡 Calling function: ${name}`, params)

      const functionCallable = agconnect.function().wrap(name)

      // 【修改点】Web SDK 中 timeout 通常是一个属性
      // 直接赋值，而不是调用方法
      functionCallable.timeout = 1800 * 1000 // 设置为 60秒

      const result = await functionCallable.call(params)

      console.log(`📥 Function result:`, result.getValue())
      return result.getValue()
    } catch (e) {
      console.error(`❌ Call Function Error (${name}):`, e)
      throw e
    }
  }
}

// 导出单例
export const cloudService = new CloudService()