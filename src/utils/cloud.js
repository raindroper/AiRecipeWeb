import agconnect from '@agconnect/api'
import '@agconnect/auth'
import '@agconnect/function'
import { agConnectConfig } from '../agconnect-config'

// ================== 🔧 配置区域 ==================

// 1. 本地调试开关
// true: 请求 DevEco Studio 本地启动的云函数 (http://127.0.0.1:3000/...)
// false: 请求华为云端部署的正式云函数
// 使用 import.meta.env.DEV 自动判断：开发环境为 true，生产环境(Build后)为 false
const USE_LOCAL_DEBUG = import.meta.env.DEV

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
      return user.getUser()
    } catch (e) {
      console.error('❌ Login Error:', e)
      throw e
    }
  }

  /**
   * 通用云函数调用方法
   * 自动根据环境切换本地/云端调用
   */
  async callFunction(name, params = {}) {
    if (USE_LOCAL_DEBUG) {
      return this._callLocal(name, params)
    }
    return this._callCloud(name, params)
  }

  /**
   * 私有方法：本地调试调用
   */
  async _callLocal(name, params) {
    console.log(`🔧 [Local Debug] Calling function: ${name}`, params)
    try {
      // 拼接本地地址
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
      console.log(`📥 [Local Debug Object] Result Raw:`, result)

      return this._unwrapLocalResponse(result)
    } catch (e) {
      console.error(`❌ [Local Debug] Error:`, e)
      throw e
    }
  }

  /**
   * 私有方法：解析本地调试器返回的响应
   * 本地调试器返回格式通常为: { body: "JSONString", headers: ..., statusCode: 200 }
   */
  _unwrapLocalResponse(result) {
    if (result && typeof result === 'object' && 'body' in result) {
      try {
        // 如果 body 是字符串，尝试解析
        if (typeof result.body === 'string') {
          const parsedBody = JSON.parse(result.body)
          console.log(`📥 [Local Debug Object] Result Parsed:`, parsedBody)
          return parsedBody
        }
        // 如果 body 已经是对象（虽然通常是字符串），直接返回
        return result.body
      } catch (e) {
        console.warn('Failed to parse local debug body:', e)
        // 解析失败则原样返回，由业务层处理
        return result.body
      }
    }
    return result
  }

  /**
   * 私有方法：云端 SDK 调用
   */
  async _callCloud(name, params) {
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
   * 调用云对象 (Cloud Object RPC)
   * @param {string} objectName 云对象名称 (如 'chat-service')
   * @param {string} methodName 方法名称 (如 'generateRecipe')
   * @param {Array} args 参数列表
   */
  async callObject(objectName, methodName, args = []) {
    console.log(`☁️ [CloudObject] Calling ${objectName}.${methodName}`, args)

    const payload = {
      method: methodName,
      params: args,
    }

    // 本地调试模式下，Wrapper 期望参数包裹在 body 字段中
    if (USE_LOCAL_DEBUG) {
      return this.callFunction(objectName, { body: payload })
    }

    return this.callFunction(objectName, payload)
  }

  /**
   * 业务方法：手机号登录
   */
  async loginByPhone(phone, pwd) {
    try {
      const res = await this.callFunction('user-login', {
        phone: phone,
        password: pwd,
        action: 'get',
        userId: phone,
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

      // 检查业务状态码
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
