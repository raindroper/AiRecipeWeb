export class Category {
  constructor(data = {}) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.icon = data.icon || '';
  }
}
