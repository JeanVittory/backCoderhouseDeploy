import { normalize, denormalize, schema } from 'normalizr';
import { ErrorHandler } from './errorHandler.tools.js';

const normalizeChatMessage = (dataUnormalize) => {
  if (!dataUnormalize) {
    throw new ErrorHandler({
      status: 500,
      message: 'Imposible normalize data, please try again',
    });
  }
  const user = new schema.Entity('users');
  const messages = new schema.Entity('mensajesUsuarios', {
    author: user,
  });

  const globalMessage = new schema.Entity('messageContainer', {
    messagesUsers: [messages],
  });
  const normalizedData = normalize(dataUnormalize, globalMessage);
  return normalizedData;
};

const denormalizeChatMessage = (dataNormalized) => {
  if (!dataNormalized) {
    throw new ErrorHandler({
      status: 500,
      message: 'Imposible denormalize data, please try again',
    });
  }
  const user = new schema.Entity('users');
  const messages = new schema.Entity('mensajesUsuarios', {
    author: user,
  });

  const globalMessage = new schema.Entity('messageContainer', {
    messagesUsers: [messages],
  });

  const denormalizedData = denormalize(
    dataNormalized.result,
    globalMessage,
    dataNormalized.entities
  );

  return denormalizedData.messages;
};

export { normalizeChatMessage, denormalizeChatMessage };
