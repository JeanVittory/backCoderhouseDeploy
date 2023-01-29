const dataToSocket = (image, product, price) => {
  const fileSubstring = image.lastIndexOf('\\');
  const pictureName = image.substring(fileSubstring + 1);
  return {
    product: product,
    price: +price,
    thumbnail: pictureName,
  };
};

const dataToDataBase = (image, product, price) => {
  const dataToPost = new FormData();
  dataToPost.append('image', image[0]);
  dataToPost.append('productName', product);
  dataToPost.append('price', price);
  return dataToPost;
};

const renderProductsOnTable = async (data, origin) => {
  const response = await fetch(`${origin}/mainApp/hbs/products.handlebars`);
  const template = await response.text();
  const dataCompile = Handlebars.compile(template);
  const dataWithThumbnailFixed = data.map((param) => {
    if (param.thumbnail) {
      const lettersArray = param.thumbnail.split('');
      const newThumbnail = extractor(lettersArray).join('');
      return {
        ...param,
        thumbnail: newThumbnail,
      };
    }
  });
  const result = dataCompile({
    dataWithThumbnailFixed,
    isEmpty: dataWithThumbnailFixed.length === 0 ? true : false,
  });
  return result;
};

const extractor = (arr) => {
  for (let i = arr.length - 1; i >= 0; --i) {
    if (arr[i] === '/') return arr.slice(i + 1, arr.length);
  }
};

export { dataToSocket, dataToDataBase, renderProductsOnTable };
