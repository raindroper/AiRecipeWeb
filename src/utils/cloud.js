import agconnect from '@agconnect/api'
import '@agconnect/auth'
import '@agconnect/function'
import { agConnectConfig } from '../agconnect-config'

// ================== 🔧 配置区域 ==================

// 1. 本地调试开关
// true: 请求 DevEco Studio 本地启动的云函数 (http://127.0.0.1:3000/...)
// false: 请求华为云端部署的正式云函数
const USE_LOCAL_DEBUG = true

// 2. 本地云函数地址
// 请根据 DevEco Studio 控制台 "Run" 窗口输出的端口修改
// 如果是真机调试，请将 127.0.0.1 改为电脑的局域网 IP (如 192.168.1.x)
const LOCAL_BASE_URL = '/local-func'
// 3. 云函数后缀 (通常为 -$latest)
const CLOUD_FUNCTION_SUFFIX = '-$latest'

// ================================================

class CloudService {
  constructor() {
    this.initialized = false
  }

  // 初始化 SDK
  init() {
    if (this.initialized) return

    try {
      // 尝试初始化配置
      agconnect.instance().configInstance(agConnectConfig)
      this.initialized = true
      console.log('✅ Huawei Cloud SDK Initialized')
    } catch (e) {
      // 在热更新或重复调用时可能会报错，标记为已初始化即可，忽略错误
      this.initialized = true
      console.warn('⚠️ SDK Config Warning (Safe to ignore):', e)
    }
  }

  // 匿名登录 (获取云数据库操作权限通常需要登录状态)
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

  /**
   * 通用云函数调用方法
   * 根据 USE_LOCAL_DEBUG 自动切换本地 HTTP 请求或云端 SDK 调用
   * @param {string} name 云函数名称 (如 'user-login')
   * @param {object} params 传递给云函数的参数
   */
  async callFunction(name, params = {}) {
    // -------------------------------------------------
    // 分支 A: 本地调试模式 (DevEco Studio Local Run)
    // -------------------------------------------------
    if (USE_LOCAL_DEBUG) {
      console.log(`🔧 [Local Debug] Calling function: ${name}`, params)
      try {
        // 拼接本地地址，通常格式为: http://IP:PORT/函数名
        // 注意：DevEco 控制台显示的可能是 /invoke/函数名，请根据实际日志调整
        const url = `${LOCAL_BASE_URL}/${name}/invoke`

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // 将参数序列化为 JSON 字符串，模拟 event.body
          body: JSON.stringify(params),
        })

        if (!response.ok) {
          throw new Error(`Local function error: ${response.status} ${response.statusText}`)
        }

        const result = await response.json()
        console.log(`📥 [Local Debug] Result:`, result)

        // 本地调试直接返回 fetch 的 json 结果
        return result
      } catch (e) {
        console.error(`❌ [Local Debug] Error:`, e)
        throw e
      }
    }

    // -------------------------------------------------
    // 分支 B: 云端 SDK 模式 (Production / Cloud)
    // -------------------------------------------------
    this.init()
    try {
      let functionName = name
      if (CLOUD_FUNCTION_SUFFIX && !functionName.endsWith(CLOUD_FUNCTION_SUFFIX)) {
        functionName += CLOUD_FUNCTION_SUFFIX
      }
      console.log(`☁️ [Cloud] Calling function: ${functionName}`, params)

      const functionCallable = agconnect.function().wrap(functionName)

      // 设置超时时间 (单位毫秒)
      functionCallable.timeout = 30 * 1000

      const result = await functionCallable.call(params)

      console.log(`📥 [Cloud] Result:`, result.getValue())
      // SDK 返回的对象需要通过 .getValue() 获取实际数据
      return result.getValue()
    } catch (e) {
      console.error(`❌ [Cloud] Error:`, e)
      throw e
    }
  }

  /**
   * 业务方法：手机号登录
   */
  async loginByPhone(phone, pwd) {
    try {
      // 调用 user-login 云函数
      // 注意：这里调用的名称必须与你创建的云函数名称一致
      const res = await this.callFunction('user-login', {
        // 这里的参数结构会对应 handler.ts 中的 event.body
        phone: phone,
        password: pwd,
        // 如果你的 handler 需要 operation/action 字段，可以在这里补充
        action: 'get', // 对应 handler 中的 action === 'get'
        userId: phone, // 对应 handler 中的 userId
      })

      // 数据解析与容错处理
      let data = res
      if (typeof res === 'string') {
        try {
          data = JSON.parse(res)
        } catch {
          data = { ret: { code: 500, desc: '返回格式错误' } }
        }
      }

      // 检查业务状态码 (假设 handler 返回结构为 { ret: { code: 0 }, result: ... })
      if (data && data.ret && data.ret.code === 0) {
        return data.result
      }

      // 抛出业务错误
      throw new Error(data?.ret?.desc || data?.message || '登录失败')
    } catch (e) {
      console.error('❌ Login by phone error:', e)
      throw e
    }
  }
}

// 导出单例对象
export const cloudService = new CloudService()
