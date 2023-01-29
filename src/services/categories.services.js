import { serviceCategoriesDB } from '../factory/factoryDaos.js';

class CategoriesService {
  static async createCategory(categoryName) {
    try {
      const response = await serviceCategoriesDB.createCategory(categoryName);
      return response;
    } catch (error) {
      return error;
    }
  }

  static async getCategories() {
    try {
      const response = await serviceCategoriesDB.getCategories();
      return response;
    } catch (error) {
      return error;
    }
  }
}

export { CategoriesService };
