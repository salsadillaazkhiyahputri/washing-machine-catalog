const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ApiLog = sequelize.define('ApiLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'client_id'
  },
  apiKeyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'api_key_id'
  },
  endpoint: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  method: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  statusCode: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'status_code'
  },
  ipAddress: {
    type: DataTypes.STRING(45),
    allowNull: true,
    field: 'ip_address'
  },
  userAgent: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'user_agent'
  },
  responseTime: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'response_time',
    comment: 'Response time in ms'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  }
}, {
  tableName: 'api_logs',
  timestamps: false
});

module.exports = ApiLog;