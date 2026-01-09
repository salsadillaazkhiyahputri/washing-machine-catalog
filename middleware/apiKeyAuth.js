const { ApiKey, Client, ApiLog } = require('../models');

const apiKeyAuth = async (req, res, next) => {
  const startTime = Date.now();
  const key = req.headers['x-api-key'];

  if (!key) {
    return res.status(401).json({ 
      success: false, 
      message: 'API Key tidak ditemukan. Sertakan header x-api-key.' 
    });
  }

  try {
    const apiKeyRecord = await ApiKey.findOne({
      where: { apiKey: key, isActive: true },
      include: [{ model: Client, as: 'client' }]
    });

    if (!apiKeyRecord) {
      return res.status(403).json({ 
        success: false, 
        message: 'API Key tidak valid atau tidak aktif.' 
      });
    }

    // Cek expired
    if (new Date(apiKeyRecord.expiresAt) < new Date()) {
      return res.status(401).json({
        success: false,
        message: 'API Key sudah kadaluarsa. Silakan generate API Key baru.'
      });
    }

    // Update request count dan last used
    await apiKeyRecord.update({
      requestCount: apiKeyRecord.requestCount + 1,
      lastUsedAt: new Date()
    });

    // Attach ke request
    req.client = apiKeyRecord.client;
    req.apiKeyId = apiKeyRecord.id;
    req.apiStartTime = startTime;
    
    // Log API request setelah response
    res.on('finish', async () => {
      try {
        await ApiLog.create({
          clientId: apiKeyRecord.client.id,
          apiKeyId: apiKeyRecord.id,
          endpoint: req.originalUrl,
          method: req.method,
          statusCode: res.statusCode,
          ipAddress: req.ip || req.connection.remoteAddress,
          userAgent: req.headers['user-agent'],
          responseTime: Date.now() - startTime
        });
      } catch (e) {
        console.error('Error logging API request:', e);
      }
    });

    next();
  } catch (error) {
    console.error('API Key Auth Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Terjadi kesalahan saat validasi API Key.',
      error: error.message 
    });
  }
};

module.exports = apiKeyAuth;