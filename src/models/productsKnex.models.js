import knex from 'knex';
import { databaseOpt } from '../config/databases.config.js';

const schemaProducts = async (db) => {
  try {
    const knexConnection = knex(databaseOpt);
    await knexConnection.schema.createTable(db, (table) => {
      table.increments('_id').notNullable();
      table.string('productName').unique().notNullable();
      table.integer('price').notNullable();
      table.string('thumbnail').notNullable();
    });
    await knexConnection.destroy();
    return 'table created';
  } catch (error) {
    console.log(error);
  }
};

export { schemaProducts };
