import { faker } from '@faker-js/faker';

const generateProducts = (quantity = 1) => {
  faker.locale = 'es';
  return {
    name: faker.commerce.product(),
    price: faker.commerce.price(100, 1000, 2, '$'),
    thumbnail: faker.image.business(640, 420, true),
  };
};

export { generateProducts };
