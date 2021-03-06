const Sequelize = require('sequelize');
// Change sequelize promises from Bluebird to native promises
Sequelize.Promise = global.Promise;

require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  operatorsAliases: false,
  logging: false, // Disable logging in the console

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  // Transform from camelCase to snake_case
  define: {
    underscored: true,
    underscoredAll: true,
  },
});

sequelize.Promise = global.Promise;

// Import models
const models = {
  User: sequelize.import('./User'),
  Channel: sequelize.import('./Channel'),
};

Object.keys(models).forEach(modelName => {
  // If a model has an association, create an association
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
