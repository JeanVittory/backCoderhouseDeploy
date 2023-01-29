import { createClient } from 'redis';

const initRedis = async () => {
  try {
    const client = createClient({
      host: '127.0.0.1',
      port: 6379,
    });
    client.on('error', (error) => console.log('Redis error: ', error));
    await client.connect();
    return client;
  } catch (error) {
    return error;
  }
};

const getRedis = async (key) => {
  try {
    const client = await initRedis();
    const result = await client.get(key);
    if (!result) return null;
    return JSON.parse(result);
  } catch (error) {
    return error;
  }
};

const setRedis = async (key, value) => {
  try {
    const client = await initRedis();
    await client.set(key, JSON.stringify(value));
    client.expire(key, 60);
    return 1;
  } catch (error) {
    return error;
  }
};

export { getRedis, setRedis };
