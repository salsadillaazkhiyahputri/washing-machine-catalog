const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const WashingMachine = sequelize.define('WashingMachine', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  merk: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  model: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  tipe: {
    type: DataTypes.ENUM('TOP_LOADING', 'FRONT_LOADING', 'TWIN_TUB', 'PORTABLE'),
    allowNull: false
  },
  kapasitas: {
    type: DataTypes.DECIMAL(4, 1),
    allowNull: false,
    comment: 'Kapasitas dalam KG'
  },
  warna: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  harga: {
    type: DataTypes.BIGINT,
    allowNull: true,
    comment: 'Harga dalam Rupiah'
  },
  tahunRilis: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'tahun_rilis'
  },
  spesifikasi: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'JSON format'
  },
  fitur: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'JSON array format'
  },
  deskripsi: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  gambarUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'gambar_url'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'updated_at'
  }
}, {
  tableName: 'washing_machines',
  timestamps: true,
  getterMethods: {
    spesifikasiParsed() {
      const value = this.getDataValue('spesifikasi');
      try {
        return value ? JSON.parse(value) : null;
      } catch (e) {
        return value;
      }
    },
    fiturParsed() {
      const value = this.getDataValue('fitur');
      try {
        return value ? JSON.parse(value) : [];
      } catch (e) {
        return value;
      }
    }
  }
});

module.exports = WashingMachine;