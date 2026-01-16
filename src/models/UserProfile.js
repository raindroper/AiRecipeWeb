class UserProfile {
  constructor(data = {}) {
    this.id = data.id
    this.password = data.password
    this.nickname = data.nickname
    this.isPro = data.isPro
    this.avatarUrl = data.avatarUrl
    this.cookingLevel = data.cookingLevel
    this.bodyMetrics = data.bodyMetrics
    this.healthConfig = data.healthConfig
    this.kitchenProfile = data.kitchenProfile
    this.familyContext = data.familyContext
    this.extras = data.extras
  }
}

export { UserProfile }
