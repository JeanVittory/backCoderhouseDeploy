import { app } from './app.config.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { ChatService } from '../services/chat.services.js';
import { ProductService } from '../services/product.services.js';
import mongoose from 'mongoose';
import env from './env.config.js';
import { denormalizeChatMessage } from '../tools/normalizr.tools.js';
import { percentageCalculator } from '../tools/functions.tools.js';

const serverHttp = createServer(app);
const io = new Server(serverHttp);

io.on('connection', async (socket) => {
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  try {
    const { dataToDenormalize, initialWeigth } = await ChatService.getAllMessages();
    const chatMessagesDenormalized = denormalizeChatMessage(dataToDenormalize);
    const percentageOfReduction = percentageCalculator(
      initialWeigth,
      JSON.stringify(chatMessagesDenormalized).length
    );
    socket.emit('initialMessageLoad', {
      messages: chatMessagesDenormalized,
      percentage: percentageOfReduction,
    });
  } catch (error) {
    socket.emit('initialMessageLoad', { error: error.message });
  }

  let globalProductsFetched = await ProductService.getAll();

  try {
    if (globalProductsFetched.message) throw Error('Error on server, please try it later');
    socket.emit('initialLoad', globalProductsFetched);
  } catch (error) {
    socket.emit('initialLoad', { error: error.message });
  }

  socket.on('sendOneProduct', async (dataToPost) => {
    try {
      if (!dataToPost) throw Error('Something went wrong, please try it later');
      const newProductFetched = await ProductService.getByName(dataToPost.product);
      if (newProductFetched?.message) throw Error('Error on server, please try it later');
      globalProductsFetched.push(newProductFetched);
      io.sockets.emit('prueba', globalProductsFetched);
    } catch (error) {
      io.sockets.emit('prueba', { error: error.message });
    }
  });

  socket.on('productDeleted', async (idOfProductDeleted) => {
    try {
      if (!idOfProductDeleted) throw Error('Something went wrong, please try it later');
      const listOfProductsFiltered = globalProductsFetched.filter((product) => {
        if (env.DATABASE_TO_USE === 'sql') {
          return product.id !== +idOfProductDeleted;
        } else {
          return product.id.valueOf() !== idOfProductDeleted;
        }
      });
      globalProductsFetched = [...listOfProductsFiltered];
      io.sockets.emit('newDataAfterDeletion', listOfProductsFiltered);
    } catch (error) {
      io.sockets.emit('newDataAfterDeletion', { error: error.message });
    }
  });

  socket.on('productUpdate', async (productToBeUpdated) => {
    try {
      if (
        productToBeUpdated.product === '' &&
        productToBeUpdated.price === '' &&
        productToBeUpdated.thumbnail === ''
      ) {
        throw Error('Something went wrong with the data, please try it later');
      }

      let isInDB = globalProductsFetched.find((product) => {
        if (env.DATABASE_TO_USE === 'sql') {
          productToBeUpdated.productId = +productToBeUpdated.productId;
          return product.id === productToBeUpdated.productId && product;
        } else {
          return product.id.valueOf() === productToBeUpdated.productId && product;
        }
      });
      if (!isInDB) {
        throw Error('Something went wrong, the product do not exist please try it again');
      }
      isInDB = {
        productName: productToBeUpdated.product || isInDB.productName,
        price: productToBeUpdated.price || isInDB.price,
        thumbnail: productToBeUpdated.thumbnail || isInDB.thumbnail,
        id:
          env.DATABASE_TO_USE === 'mongo'
            ? mongoose.Types.ObjectId(productToBeUpdated.productId)
            : productToBeUpdated.productId,
      };
      const newArrayUpdated = globalProductsFetched.map((product) => {
        if (env.DATABASE_TO_USE === 'mongo') {
          if (product.id?.valueOf() === isInDB.id?.valueOf()) {
            return isInDB;
          }
          return product;
        }
        if ((env.DATABASE_TO_USE === 'firestore') | (env.DATABASE_TO_USE === 'sql')) {
          if (product.id === isInDB.id) {
            return isInDB;
          }
          return product;
        }
      });
      globalProductsFetched = [...newArrayUpdated];
      io.sockets.emit('dataUpdated', newArrayUpdated);
    } catch (error) {
      io.sockets.emit('dataUpdated', { error: error.message });
    }
  });

  socket.on('newMessageFromChat', async (message) => {
    try {
      const optionsTime = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      };
      if (message.id === '' || message.message === '' || message.typeMessage === '')
        throw Error('Something went wrong white the message');

      const newMessageFormat = {
        author: {
          email: message.email,
          typeMessage: message.typeMessage,
          date: new Date().toLocaleDateString('es', optionsTime),
        },
        message: message.message,
      };

      const responseFromDBofChat = await ChatService.addMessage(newMessageFormat);

      const { dataToDenormalize, initialWeigth } = await ChatService.getAllMessages();
      const chatMessagesDenormalized = denormalizeChatMessage(dataToDenormalize);
      const newPercentage = percentageCalculator(
        initialWeigth,
        JSON.stringify(chatMessagesDenormalized).length
      );

      if (responseFromDBofChat?.message) throw Error('Something went wrong with the server');
      io.sockets.emit('newMessageToChat', { newMessageFormat, newPercentage });
    } catch (error) {
      socket.emit('errorChat', error);
    }
  });
});

export { serverHttp, io };
