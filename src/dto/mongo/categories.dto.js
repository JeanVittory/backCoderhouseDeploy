class CategoriesDTO {
  constructor({ _id, categoryName, createdAt, updatedAt }) {
    this.id = _id;
    this.categoryName = categoryName;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

const categoriesDTO = (categories) => {
  if (Array.isArray(categories)) {
    return categories.map((product) => {
      return { ...new CategoriesDTO(product) };
    });
  } else {
    return new CategoriesDTO(categories);
  }
};

export { categoriesDTO };
