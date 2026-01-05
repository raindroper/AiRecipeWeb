export class Recipe {
  constructor(data = {}) {
    this.id = data.id || ''
    this.title = data.title || ''
    this.coverUrl = data.coverUrl || ''
    this.author = data.author || '' // User ID or Name
    this.authorAvatar = data.authorAvatar || ''

    // Metadata
    this.calories = data.calories || 0
    this.difficulty = data.difficulty || 'medium' // 'easy', 'medium', 'hard'
    this.timeRequired = data.timeRequired || 0 // in minutes

    // Stats
    this.likeCount = data.likeCount || 0
    this.views = data.views || 0

    // Content (JSON fields)
    this.ingredients = this.parseJson(data.ingredients, [])
    // Expected structure: { name: 'Tomato', amount: '2', unit: 'pcs' }

    this.steps = this.parseJson(data.steps, [])
    // Expected structure: { text: 'Chop tomatoes', imageUrl: '...' }

    this.tags = this.parseJson(data.tags, []) // General tags
    this.aiTags = this.parseJson(data.aiTags, []) // e.g., ["Low Carb", "Summer"]
    this.toolTags = this.parseJson(data.toolTags, []) // e.g., ["Oven", "Air Fryer"]

    this.category = data.category || 'General'
  }

  parseJson(value, defaultValue) {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value)
      } catch (e) {
        console.warn('Failed to parse JSON field', e)
        return defaultValue
      }
    }
    return value || defaultValue
  }

  toDbObject() {
    return {
      id: this.id,
      title: this.title,
      coverUrl: this.coverUrl,
      author: this.author,
      calories: this.calories,
      difficulty: this.difficulty,
      timeRequired: this.timeRequired,
      likeCount: this.likeCount,
      views: this.views,
      ingredients: JSON.stringify(this.ingredients),
      steps: JSON.stringify(this.steps),
      aiTags: JSON.stringify(this.aiTags),
      toolTags: JSON.stringify(this.toolTags),
      category: this.category,
    }
  }
}
