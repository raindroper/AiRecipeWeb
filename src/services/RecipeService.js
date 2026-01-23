import { cloudService } from '@/utils/cloud'

export class RecipeService {
  /**
   * 获取用户的菜谱生成历史
   * @param {string} userId
   * @returns {Promise<Array>}
   */
  static async getRecipeList(userId) {
    try {
      const res = await cloudService.callObject('recipe-service', 'getRecipeList', [userId])
      return this._parseListResponse(res)
    } catch (e) {
      console.error('[RecipeService] getRecipeList error:', e)
      throw e
    }
  }

  /**
   * 收藏菜谱
   * @param {string} userId
   * @param {string} recipeId
   * @returns {Promise<Object>} { id: "collect_id" }
   */
  static async collectRecipe(userId, recipeId) {
    try {
      const res = await cloudService.callObject('recipe-service', 'collectRecipe', [
        userId,
        recipeId,
      ])
      const data = this._parseResponse(res)
      return data // returns { id: ... }
    } catch (e) {
      console.error('[RecipeService] collectRecipe error:', e)
      throw e
    }
  }

  /**
   * 取消收藏
   * @param {string} userId
   * @param {string} recipeId
   * @returns {Promise<void>}
   */
  static async uncollectRecipe(userId, recipeId) {
    try {
      const res = await cloudService.callObject('recipe-service', 'uncollectRecipe', [
        userId,
        recipeId,
      ])
      this._parseResponse(res)
    } catch (e) {
      console.error('[RecipeService] uncollectRecipe error:', e)
      throw e
    }
  }

  /**
   * 获取收藏列表
   * @param {string} userId
   * @param {number} page
   * @param {number} pageSize
   * @returns {Promise<Object>} { total, page, pageSize, list }
   */
  static async getCollectedRecipes(userId, page = 1, pageSize = 10) {
    try {
      const res = await cloudService.callObject('recipe-service', 'getCollectedRecipes', [
        userId,
        page,
        pageSize,
      ])
      return this._parseResponse(res)
    } catch (e) {
      console.error('[RecipeService] getCollectedRecipes error:', e)
      throw e
    }
  }

  /**
   * 检查菜谱收藏状态
   * @param {string} userId
   * @param {string} recipeId
   * @returns {Promise<Object>} { isCollected: boolean, collectId: string | null }
   */
  static async isRecipeCollected(userId, recipeId) {
    try {
      const res = await cloudService.callObject('recipe-service', 'isRecipeCollected', [
        userId,
        recipeId,
      ])
      return this._parseResponse(res)
    } catch (e) {
      console.error('[RecipeService] isRecipeCollected error:', e)
      throw e
    }
  }

  /**
   * 解析列表响应
   * @param {any} res
   * @returns {Array}
   */
  static _parseListResponse(res) {
    let list = []
    if (Array.isArray(res)) {
      list = res
    } else if (res && res.data && Array.isArray(res.data)) {
      list = res.data
    } else if (typeof res === 'string') {
      try {
        const parsed = JSON.parse(res)
        list = Array.isArray(parsed) ? parsed : []
      } catch {
        list = []
      }
    }
    return list
  }

  /**
   * 解析通用响应
   * @param {any} res
   * @returns {Object}
   */
  static _parseResponse(res) {
    let data
    if (typeof res === 'string') {
      try {
        data = JSON.parse(res)
      } catch {
        // [Refactor]: Use template literal for clearer error message
        throw new Error(`Failed to parse response: ${res}`)
      }
    } else {
      data = res
    }

    // [Refactor]: Use optional chaining to simplify code check
    if (data?.code && data.code !== 200) {
      // [Refactor]: Use nullish coalescing for default error message
      throw new Error(data.desc ?? 'Request failed')
    }

    // 兼容部分旧接口可能用 ret.code
    // [Refactor]: Use optional chaining
    if (data?.ret?.code !== 0 && data?.ret?.code !== undefined) {
      throw new Error(data.ret.desc ?? 'Request failed')
    }

    // [Refactor]: Use nullish coalescing to return data
    return data.data ?? data.result ?? data
  }
}
