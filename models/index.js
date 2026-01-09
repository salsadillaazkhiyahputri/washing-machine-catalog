const { sequelize } = require('../config/database');
const Admin = require('./admin');
const Client = require('./client');
const ApiKey = require('./apiKey');
const WashingMachine = require('./washingMachine');
const ApiLog = require('./apiLog');

// ==================== RELASI ====================

// Client - ApiKey (1:N)
Client.hasMany(ApiKey, { foreignKey: 'clientId', as: 'apiKeys' });
ApiKey.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });

// Client - ApiLog (1:N)
Client.hasMany(ApiLog, { foreignKey: 'clientId', as: 'logs' });
ApiLog.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });

// ApiKey - ApiLog (1:N)
ApiKey.hasMany(ApiLog, { foreignKey: 'apiKeyId', as: 'logs' });
ApiLog.belongsTo(ApiKey, { foreignKey: 'apiKeyId', as: 'apiKey' });

module.exports = {
  sequelize,
  Admin,
  Client,
  ApiKey,
  WashingMachine,
  ApiLog
};