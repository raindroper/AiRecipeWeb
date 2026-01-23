import { cloudService } from '@/utils/cloud'

export class ChatService {
  /**
   * 生成菜谱
   * @param {string} userId 用户ID
   * @param {string} message 用户需求
   * @returns {Promise<Object>}
   */
  static async generateRecipe(userId, message) {
    try {
      const res = await cloudService.callObject('chat-service', 'generateRecipe', [userId, message])
      return this._parseResponse(res)
    } catch (e) {
      console.error('[ChatService] generateRecipe error:', e)
      throw e
    }
  }

  /**
   * 解析云对象响应
   * @param {any} res
   * @returns {Object}
   */
  static _parseResponse(res) {
    let data
    if (typeof res === 'string') {
      try {
        data = JSON.parse(res)
      } catch {
        throw new Error(res)
      }
    } else {
      data = res
    }

    // [Refactor]: Use optional chaining
    if (data?.ret?.code !== 0 && data?.ret?.code !== undefined) {
      // [Refactor]: Use nullish coalescing
      throw new Error(data.ret.desc ?? 'Request failed')
    }

    // [Refactor]: Use nullish coalescing
    return data.result ?? data
  }
}
