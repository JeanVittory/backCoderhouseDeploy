import { testServer } from '../index.js';
import { expect } from 'chai';
import supertest from 'supertest';
import * as url from 'url';
import { ProductService } from '../../services/product.services.js';
import mongoose from 'mongoose';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

let request;
let server;

describe('Suite from product controller', () => {
  let productTestId;
  before(async () => {
    try {
      server = await testServer();
      request = supertest(`http://localhost:8082/api/v1/productos`);
      const productTest = {
        productName: 'Camiseta Test inicial',
        price: 12000,
        thumbnail: 'thumbnail test',
      };
      productTestId = await ProductService.save(productTest);
    } catch (error) {
      console.log(error);
    }
  });
  after(async () => {
    await ProductService.deleteAll();
    server.close();
  });

  describe('GET /', () => {
    it('should respond status code 200', async () => {
      const response = await request.get('/');
      expect(response.status).equal(200);
    });
    it('should contains an array', async () => {
      const response = await request.get('/');
      expect(response._body).to.be.an('array');
    });
    it('should contains objects within an array', async () => {
      const response = await request.get('/');
      response._body.forEach((product) => expect(typeof product).to.be.equal('object'));
    });
    it('within each object should exist an _id, productName, price, thumbnail as keys', async () => {
      const response = await request.get('/');
      response._body.forEach((product) => {
        expect(product).includes.keys(['_id', 'productName', 'price', 'thumbnail']);
      });
    });
    it('should respond with status code 400', async () => {
      const response = await request.get('/otra-ruta');
      expect(response.status).to.be.equal(400);
    });
  });

  describe('GET /:id', () => {
    it('should respond with status code 200', async () => {
      const response = await request.get(`/${productTestId}`);
      expect(response.status).to.eql(200);
    });
    it('should contains an object with _id, productName, price, thumbnail as keys', async () => {
      const response = await request.get(`/${productTestId}`);
      console.log(typeof response._body);
      expect(response._body).to.be.a('object');
      expect(response._body).includes.keys(['_id', 'productName', 'price', 'thumbnail']);
    });
    it('should respond with status code 400', async () => {
      const response = await request.get('/otra-ruta');
      expect(response._body.message).to.be.equal(
        'Invalid ID product, mongo only accept 12 bytes, a string of 24 hex characters or an integer id value'
      );
      expect(response.status).to.be.equal(400);
    });
    it("should repond with 404 as status code and 'Product doesn't exist' as message", async () => {
      const errorMessage = "Product doesn't exist";
      const response = await request.get('/6393d65adf9a00af4aaedd33');
      expect(response._body.status).to.equal(404);
      expect(response._body.message).to.equal(errorMessage);
    });
  });

  describe('POST /', () => {
    it('should respond with a status code 201, should add a product at testDB and return an ObjectId value', async () => {
      const response = await request
        .post('/')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .field('productName', 'Camiseta del test POST')
        .field('price', '10000')
        .attach('image', `${__dirname}images/imagenTest.jpg`);

      expect(response.status).to.be.equal(201);
      expect(mongoose.isObjectIdOrHexString(response._body)).to.be.equal(true);
    });

    it("should respond with a status code 400 and a message 'Enter a product image'", async () => {
      const errorMessage = 'Enter a product image';
      const response = await request
        .post('/')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .field('productName', 'Camiseta Test')
        .field('price', '10000');
      expect(response.status).to.be.equal(400);
      expect(response._body.error).to.be.equal(errorMessage);
    });

    it("should respond with a status code 400 and an error message 'You must enter the name of the product and its respective price'", async () => {
      const errorMessage = 'You must enter the name of the product and its respective price';
      const response = await request
        .post('/')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .attach('image', `${__dirname}images/imagenTest.jpg`);
      expect(response.status).to.be.equal(400);
      expect(response._body.error).to.be.equal(errorMessage);
    });
  });

  describe('PUT /', () => {
    it('should respond with status code 200 and the body should contain at least 1 product matched', async () => {
      const response = await request
        .put(`/${productTestId}`)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .field('productName', 'Camiseta Test actualizada');
      expect(response.status).to.be.equal(200);
      expect(response._body).to.be.greaterThanOrEqual(1);
    });

    it('should respond with status code 404 if an id is not provided', async () => {
      const response = await request
        .put('/')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .field('productName', 'Camiseta Test actualizada');
      expect(response.status).to.be.equal(404);
    });

    it("should respond with status code 400 if the id provided isn't a valid ObjectId with a error message 'please provide a product id'", async () => {
      const response = await request
        .put('/1234')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .field('productName', 'Camiseta Test actualizada');
      expect(response.status).to.be.equal(400);
      expect(response._body.error).to.be.equal('please provide a product id');
    });

    it("should respond with status code 400 nad a error message 'Please enter a value to be updated' if the user don't provide at least one of this values: product name, price or thumbnail", async () => {
      const response = await request
        .put(`/${productTestId}`)
        .set('Content-Type', 'application/x-www-form-urlencoded');
      expect(response.status).to.be.equal(400);
      expect(response._body.error).to.be.equal('Please enter a value to be updated');
    });
  });

  describe('DELETE /', () => {
    it('should respond with status code 200 and the ObjectId of the product deleted', async () => {
      const response = await request.delete(`/${productTestId}`);
      expect(response.status).to.be.equal(200);
      expect(mongoose.isObjectIdOrHexString(response._body)).to.be.equal(true);
    });

    it("should respond with status code 400 and an error message 'Error 400. please provide a product id' if the product id provided is invalid", async () => {
      const response = await request.delete('/1234');
      expect(response.status).to.be.equal(400);
      expect(response._body.error).to.be.equal('Please provide a valid product id');
    });

    it("should response with status code 404 and an error message 'Product doesn't exist' if the product doesn't exist", async () => {
      const response = await request.delete('/6376769567b14245293ac1f8');
      expect(response.status).to.be.equal(404);
      expect(response._body.error).to.be.equal("Product doesn't exist");
    });
  });
});
