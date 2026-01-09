const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const { connectDB } = require('./config/database');
const { Admin } = require('./models');
const { seedWashingMachines } = require('./seeders/washingMachineSeeder');

const adminRoutes = require('./routes/adminRoutes');
const clientRoutes = require('./routes/clientRoutes');
const apiRoutes = require('./routes/apiRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/v1', apiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Washing Machine Open API Platform',
    version: '1.0.0'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Endpoint tidak ditemukan' 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Terjadi kesalahan server',
    error: err.message 
  });
});

// Start server
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    
    // Create default admin
    const adminExists = await Admin.findOne({ 
      where: { username: process.env.ADMIN_USERNAME || 'admin' } 
    });
    
    if (!adminExists) {
      await Admin.create({
        username: process.env.ADMIN_USERNAME || 'admin',
        password: process.env.ADMIN_PASSWORD || 'admin123',
        nama: 'Administrator'
      });
      console.log('✅ Default admin created');
    }

    // Seed data
    await seedWashingMachines();
    
    app.listen(PORT, () => {
      console.log('');
      console.log('╔═══════════════════════════════════════════════════════════╗');
      console.log('║     WASHING MACHINE OPEN API PLATFORM - B2B               ║');
      console.log('╠═══════════════════════════════════════════════════════════╣');
      console.log(`║  🚀 Server      : http://localhost:${PORT}                     ║`);
      console.log(`║  📖 API Docs    : http://localhost:${PORT}                     ║`);
      console.log(`║  🔑 Get API Key : http://localhost:${PORT}                     ║`); 
      console.log('╚═══════════════════════════════════════════════════════════╝');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();