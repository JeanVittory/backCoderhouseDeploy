import mongoose from 'mongoose';
import { logger } from '../../config/logger/index.js';
import { doMongoConnection } from '../../config/mongodb.config.js';
import { UsersDTO } from '../../dto/mongo/usersDto.dto.js';

let instance = null;

class RegisterUsers {
	#collection;
	constructor(collectionName, schema) {
		this.#collection = mongoose.model(collectionName, schema);
	}

	static getInstance(collectionName, schema) {
		if (!instance) {
			instance = new RegisterUsers(collectionName, schema);
		}
		return instance;
	}

	async addUser(newDataUser) {
		try {
			if (newDataUser) {
				const dbConnection = await doMongoConnection();
				const userAdd = new this.#collection(newDataUser);
				const userAddedResponse = await userAdd.save();
				const responseDTO = { ...new UsersDTO(userAddedResponse) };
				return responseDTO;
			}
		} catch (error) {
			return error;
		}
	}

	async userExist(usernameToFind, emailToFind = 1) {
		try {
			if (emailToFind && usernameToFind) {
				const dbConnection = await doMongoConnection();
				const responseFromExistUser = await this.#collection.findOne(
					{
						$or: [{ email: emailToFind }, { username: usernameToFind }],
					},
					{ email: 1, username: 1, _id: 1, role: 1 }
				);
				if (responseFromExistUser === null) return responseFromExistUser;
				const responseDTO = { ...new UsersDTO(responseFromExistUser) };
				return responseDTO;
			}
		} catch (error) {
			logger.error(error);
			return error;
		}
	}

	async getUserById(id) {
		try {
			if (id) {
				const dbConnection = await doMongoConnection();
				const user = await this.#collection.findById(id, { username: 1, email: 1, _id: 1 });
				const responseDTO = { ...new UsersDTO(user) };
				return responseDTO;
			}
		} catch (error) {
			logger.error(error);
			return error;
		}
	}

	async getUserByUsername(username) {
		try {
			if (username) {
				const dbConnection = await doMongoConnection();
				const user = await this.#collection.findOne({ username: username });
				const responseDTO = { ...new UsersDTO(user) };
				return responseDTO;
			}
		} catch (error) {
			logger.error(error);
			return error;
		}
	}

	async getPassword(usernameToFind) {
		try {
			if (usernameToFind) {
				const dbConnection = await doMongoConnection();
				const pwd = await this.#collection.findOne(
					{
						username: usernameToFind,
					},
					{ password: 1 }
				);
				return pwd;
			}
		} catch (error) {
			logger.error(error);
			return error;
		}
	}
}

export { RegisterUsers };
