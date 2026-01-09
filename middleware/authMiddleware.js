const jwt = require('jsonwebtoken');
const { Admin } = require('../models');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Akses ditolak. Token tidak ditemukan.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const admin = await Admin.findByPk(decoded.adminId);
    if (!admin) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token tidak valid.' 
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Token tidak valid atau sudah kadaluarsa.' 
    });
  }
};

module.exports = authMiddleware;