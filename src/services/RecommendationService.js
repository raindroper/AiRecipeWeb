export class RecommendationService {
  /**
   * Filter and Rank recipes based on user profile
   * @param {Array} recipes
   * @param {Object} userProfile
   */
  static recommend(recipes, userProfile) {
    let result = this.filterRecipes(recipes, userProfile)
    result = this.rankRecipes(result, userProfile)
    return result
  }

  static filterRecipes(recipes, userProfile) {
    if (!userProfile || !userProfile.healthConfig) return recipes

    const { chronicDiseases, allergies } = userProfile.healthConfig

    return recipes.filter((recipe) => {
      // 1. Allergy Filter
      // If recipe has ingredients that match allergies (simplified string match)
      if (allergies && allergies.length > 0) {
        // Check ingredients list
        // Assuming recipe.ingredients is an array of objects {name: '...'}
        // If it's still string, parse it, but model should have parsed it.
        const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : []
        const ingredientsStr = JSON.stringify(ingredients).toLowerCase()

        for (const allergy of allergies) {
          if (ingredientsStr.includes(allergy.toLowerCase())) {
            return false // Exclude
          }
        }
      }

      // 2. Health Condition Filter
      // e.g. Diabetes -> avoid High Sugar (simplified check on tags)
      if (chronicDiseases && chronicDiseases.includes('Diabetes')) {
        const tags = [...(recipe.aiTags || []), ...(recipe.tags || [])]
        if (
          tags.some(
            (t) =>
              t.toLowerCase().includes('sugar') ||
              t.toLowerCase() === 'sweet' ||
              t.toLowerCase() === 'dessert',
          )
        ) {
          return false
        }
      }

      return true
    })
  }

  static rankRecipes(recipes, userProfile) {
    // Basic ranking: Kitchen Tool Match
    if (!userProfile || !userProfile.kitchenProfile) return recipes

    const appliances = userProfile.kitchenProfile.appliances || []

    return [...recipes].sort((a, b) => {
      const aScore = this.calculateMatchScore(a, appliances)
      const bScore = this.calculateMatchScore(b, appliances)
      return bScore - aScore // Descending
    })
  }

  static calculateMatchScore(recipe, appliances) {
    let score = 0
    const toolTags = recipe.toolTags || []

    // If recipe needs a tool we have, +10
    for (const tool of toolTags) {
      if (appliances.some((app) => app.toLowerCase() === tool.toLowerCase())) {
        score += 10
      }
    }

    // Also check generic tags or aiTags
    const allTags = [...(recipe.aiTags || []), ...(recipe.tags || [])]
    for (const tag of allTags) {
      if (appliances.some((app) => app.toLowerCase() === tag.toLowerCase())) {
        score += 5
      }
    }

    return score
  }
}
