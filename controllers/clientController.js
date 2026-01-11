const crypto = require('crypto');
const { Client, ApiKey } = require('../models');

// Generate random API Key 64 characters
const generateRandomApiKey = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Register Client & Generate API Key
exports.generateApiKey = async (req, res) => {
  try {
    const { nama, email, noTelepon, alamat} = req.body;

    // Validasi input
    if (!nama || !email) {
      return res.status(400).json({
        success: false,
        message: 'Namadan Email wajib diisi.'
      });
    }

    // Validasi email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Format email tidak valid.'
      });
    }

    // Cari atau buat data client
    let [client, created] = await Client.findOrCreate({
      where: { email },
      defaults: { nama, noTelepon, alamat}
    });

    // Update data jika client sudah ada
    if (!created) {
      await client.update({ nama, noTelepon, alamat});
    }

    // Generate API Key
    const keyString = generateRandomApiKey();
    const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 tahun

    const savedKey = await ApiKey.create({
      clientId: client.id,
      apiKey: keyString,
      expiresAt,
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'API Key berhasil dibuat.',
      data: {
        apiKey: keyString,
        clientId: client.id,
        nama: client.nama,
        email: client.email,
        expiresAt: expiresAt,
        isNewClient: created
      }
    });
  } catch (error) {
    console.error('Error generating API key:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal membuat API Key.',
      error: error.message
    });
  }
};

// Verify API Key
exports.verifyApiKey = async (req, res) => {
  try {
    const { apiKey } = req.body;

    if (!apiKey) {
      return res.status(400).json({
        success: false,
        message: 'API Key wajib diisi.'
      });
    }

    const keyRecord = await ApiKey.findOne({
      where: { apiKey, isActive: true },
      include: [{
        model: Client,
        as: 'client',
        attributes: ['id', 'nama', 'email']
      }]
    });

    if (!keyRecord) {
      return res.status(404).json({
        success: false,
        message: 'API Key tidak valid atau tidak aktif.'
      });
    }

    // Cek expired
    if (new Date(keyRecord.expiresAt) < new Date()) {
      return res.status(401).json({
        success: false,
        message: 'API Key sudah kadaluarsa.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'API Key valid.',
      data: {
        client: keyRecord.client,
        expiresAt: keyRecord.expiresAt,
        requestCount: keyRecord.requestCount,
        lastUsedAt: keyRecord.lastUsedAt
      }
    });
  } catch (error) {
    console.error('Error verifying API key:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal verifikasi API Key.',
      error: error.message
    });
  }
};