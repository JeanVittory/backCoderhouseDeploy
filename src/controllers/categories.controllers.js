import { CategoriesService } from '../services/categories.services.js';

const getCategories = async (req, res) => {
  try {
    const response = await CategoriesService.getCategories();
    res.status(200).json(response);
  } catch (error) {
    return error;
  }
};

const postCategories = async (req, res) => {
  try {
    const { categoryName } = req.body;
    const response = await CategoriesService.createCategory(categoryName);
    if (response instanceof Error) {
      return res.status(response.status).json({ error: response.message });
    }
    return res.status(200).json(response);
  } catch (error) {
    return error;
  }
};

export { getCategories, postCategories };
