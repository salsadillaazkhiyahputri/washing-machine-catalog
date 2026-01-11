const jwt = require('jsonwebtoken');
const { Admin, Client, ApiKey, WashingMachine, ApiLog } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

// Admin Login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username dan password wajib diisi.'
      });
    }

    const admin = await Admin.findOne({ where: { username } });
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Username atau password salah.'
      });
    }

    const isPasswordValid = await admin.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Username atau password salah.'
      });
    }

    const token = jwt.sign(
      { adminId: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      message: 'Login berhasil.',
      data: {
        token,
        admin: {
          id: admin.id,
          username: admin.username,
          nama: admin.nama
        }
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat login.',
      error: error.message
    });
  }
};

// Get Dashboard Stats
exports.getStats = async (req, res) => {
  try {
    const totalClients = await Client.count();
    const activeApiKeys = await ApiKey.count({ where: { isActive: true } });
    const totalProducts = await WashingMachine.count({ where: { isActive: true } });
    
    // Total API requests
    const totalRequests = await ApiLog.count();

    // Request 7 hari terakhir
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentRequests = await ApiLog.count({
      where: { createdAt: { [Op.gte]: sevenDaysAgo } }
    });

    // Top clients by request
    const topClients = await ApiLog.findAll({
      attributes: [
        'clientId',
        [fn('COUNT', col('Apilog.id')), 'totalRequests']
      ],
      include: [{
        model: Client,
        as: 'client',
        attributes: ['nama', 'email']
      }],
      group: ['clientId', 'client.id'],
      order: [[literal('totalRequests'), 'DESC']],
      limit: 5
    });

    res.status(200).json({
      success: true,
      data: {
        totalClients,
        activeApiKeys,
        totalProducts,
        totalRequests,
        recentRequests,
        topClients
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Gagal mengambil statistik.',
      error: error.message 
    });
  }
};

// Get All Clients
exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.findAll({
      include: [{
        model: ApiKey,
        as: 'apiKeys',
        attributes: ['id', 'apiKey', 'isActive', 'expiresAt', 'requestCount', 'lastUsedAt', 'createdAt']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: clients.length,
      data: clients
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data client.',
      error: error.message
    });
  }
};

// Get All API Keys
exports.getAllApiKeys = async (req, res) => {
  try {
    const apiKeys = await ApiKey.findAll({
      include: [{
        model: Client,
        as: 'client',
        attributes: ['id', 'nama', 'email']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: apiKeys.length,
      data: apiKeys
    });
  } catch (error) {
    console.error('Error fetching API keys:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data API Key.',
      error: error.message
    });
  }
};

// Toggle API Key Status
exports.toggleApiKeyStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const apiKey = await ApiKey.findByPk(id);
    
    if (!apiKey) {
      return res.status(404).json({
        success: false,
        message: 'API Key tidak ditemukan.'
      });
    }

    await apiKey.update({ isActive: !apiKey.isActive });

    res.status(200).json({
      success: true,
      message: `API Key berhasil ${apiKey.isActive ? 'diaktifkan' : 'dinonaktifkan'}.`,
      data: apiKey
    });
  } catch (error) {
    console.error('Error toggling API key status:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengubah status API Key.',
      error: error.message
    });
  }
};

// Delete API Key
exports.deleteApiKey = async (req, res) => {
  try {
    const { id } = req.params;

    const apiKey = await ApiKey.findByPk(id);
    
    if (!apiKey) {
      return res.status(404).json({
        success: false,
        message: 'API Key tidak ditemukan.'
      });
    }

    await apiKey.destroy();

    res.status(200).json({
      success: true,
      message: 'API Key berhasil dihapus.'
    });
  } catch (error) {
    console.error('Error deleting API key:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus API Key.',
      error: error.message
    });
  }
};

// Get API Logs
exports.getApiLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, clientId } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (clientId) whereClause.clientId = clientId;

    const { count, rows: logs } = await ApiLog.findAndCountAll({
      where: whereClause,
      include: [{
        model: Client,
        as: 'client',
        attributes: ['nama']
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      success: true,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      },
      data: logs
    });
  } catch (error) {
    console.error('Error fetching API logs:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil log API.',
      error: error.message
    });
  }
};