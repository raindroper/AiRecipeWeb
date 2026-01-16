class UserProfile {
  constructor() {
    this.id = undefined
    this.password = undefined
    this.nickname = undefined
    this.avatarUrl = undefined
    this.isPro = undefined
    this.cookingLevel = undefined
    this.bodyMetrics = undefined
    this.healthConfig = undefined
    this.kitchenProfile = undefined
    this.familyContext = undefined
    this.extras = undefined
  }

  getFieldTypeMap() {
    const fieldTypeMap = new Map()
    fieldTypeMap.set('id', 'String')
    fieldTypeMap.set('password', 'String')
    fieldTypeMap.set('nickname', 'String')
    fieldTypeMap.set('avatarUrl', 'String')
    fieldTypeMap.set('isPro', 'Boolean')
    fieldTypeMap.set('cookingLevel', 'String')
    fieldTypeMap.set('bodyMetrics', 'String')
    fieldTypeMap.set('healthConfig', 'String')
    fieldTypeMap.set('kitchenProfile', 'String')
    fieldTypeMap.set('familyContext', 'String')
    fieldTypeMap.set('extras', 'String')
    return fieldTypeMap
  }

  getPrimaryKeyList() {
    return ['id']
  }
}

export { UserProfile }
