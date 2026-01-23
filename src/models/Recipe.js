
export class Recipe {
  constructor(data = {}) {
    this.id = data.id || ''
    this.userId = data.userId || ''
    this.name = data.name || '未命名菜谱'
    this.description = data.description || ''
    
    // Metadata
    this.calories = data.calories || ''
    this.duration = data.duration || ''
    this.tags = this.parseJson(data.tags, []) // Assuming tags is stored as JSON string of array
    this.status = Number(data.status) || 1
    this.createdAt = Number(data.createdAt) || Date.now()
    this.isCollected = Boolean(data.isCollected) || false

    // Content (JSON fields)
    this.ingredients = this.parseJson(data.ingredients, [])
    this.steps = this.parseJson(data.steps, [])
  }

  parseJson(value, defaultValue) {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value)
      } catch (e) {
        // If it's a simple string that's not JSON (like tags might be just comma separated?)
        // But for consistency with ingredients/steps, we assume JSON.
        // If it fails, check if it's meant to be a string. 
        // For tags, if it's not JSON, maybe split by comma?
        // Let's keep it safe: if parse fails, return the string itself if it's not empty, or defaultValue?
        // Actually, for ingredients/steps which are objects/arrays, we want objects.
        // For tags, if it's "Healthy, Quick", we might want ["Healthy", "Quick"].
        // Let's assume standard JSON behavior first.
        console.warn('Failed to parse JSON field', value, e)
        return defaultValue
      }
    }
    return value || defaultValue
  }

  toDbObject() {
    return {
      id: this.id,
      userId: this.userId,
      name: this.name,
      description: this.description,
      calories: this.calories,
      duration: this.duration,
      tags: JSON.stringify(this.tags),
      ingredients: JSON.stringify(this.ingredients),
      steps: JSON.stringify(this.steps),
      status: this.status,
      createdAt: this.createdAt,
      isCollected: this.isCollected
    }
  }
}
