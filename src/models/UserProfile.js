export class UserProfile {
  constructor(data = {}) {
    this.id = data.id || '';
    this.nickname = data.nickname || '';
    this.avatarUrl = data.avatarUrl || '';
    
    // JSON fields stored as strings in DB, but objects in app
    this.bodyMetrics = this.parseJson(data.bodyMetrics, {
      height: 0,
      weight: 0,
      age: 0,
      gender: 'unknown' // 'male', 'female', 'unknown'
    });
    
    this.healthConfig = this.parseJson(data.healthConfig, {
      chronicDiseases: [], // e.g., 'diabetes', 'hypertension'
      allergies: [],       // e.g., 'seafood', 'peanuts'
      dietaryGoals: []     // e.g., 'fat_loss', 'muscle_gain'
    });
    
    this.kitchenProfile = this.parseJson(data.kitchenProfile, {
      appliances: [], // e.g., 'oven', 'air_fryer', 'blender'
      spices: []
    });
    
    this.familyContext = this.parseJson(data.familyContext, {
      members: [] // { role: 'elder', preferences: [] }
    });
  }

  parseJson(value, defaultValue) {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (e) {
        console.warn('Failed to parse JSON field', e);
        return defaultValue;
      }
    }
    return value || defaultValue;
  }
  
  // Helper to serialize back to DB format if needed
  toDbObject() {
    return {
      id: this.id,
      nickname: this.nickname,
      avatarUrl: this.avatarUrl,
      bodyMetrics: JSON.stringify(this.bodyMetrics),
      healthConfig: JSON.stringify(this.healthConfig),
      kitchenProfile: JSON.stringify(this.kitchenProfile),
      familyContext: JSON.stringify(this.familyContext)
    };
  }
}
