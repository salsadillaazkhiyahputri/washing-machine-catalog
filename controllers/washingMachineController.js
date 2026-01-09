const { WashingMachine } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

// ==================== PUBLIC API ENDPOINTS (Via API Key) ====================

// GET semua mesin cuci dengan filter & pagination
exports.getAllWashingMachines = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      merk, 
      tipe, 
      minKapasitas, 
      maxKapasitas,
      minHarga,
      maxHarga,
      tahun,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = { isActive: true };

    if (merk) whereClause.merk = merk;
    if (tipe) whereClause.tipe = tipe;
    if (tahun) whereClause.tahunRilis = tahun;

    if (minKapasitas || maxKapasitas) {
      whereClause.kapasitas = {};
      if (minKapasitas) whereClause.kapasitas[Op.gte] = parseFloat(minKapasitas);
      if (maxKapasitas) whereClause.kapasitas[Op.lte] = parseFloat(maxKapasitas);
    }

    if (minHarga || maxHarga) {
      whereClause.harga = {};
      if (minHarga) whereClause.harga[Op.gte] = parseInt(minHarga);
      if (maxHarga) whereClause.harga[Op.lte] = parseInt(maxHarga);
    }

    if (search) {
      whereClause[Op.or] = [
        { merk: { [Op.like]: `%${search}%` } },
        { model: { [Op.like]: `%${search}%` } },
        { deskripsi: { [Op.like]: `%${search}%` } }
      ];
    }

    const validSortFields = ['createdAt', 'harga', 'kapasitas', 'merk', 'tahunRilis'];
    const orderField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const orderDirection = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const { count, rows } = await WashingMachine.findAndCountAll({
      where: whereClause,
      order: [[orderField, orderDirection]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const data = rows.map(machine => ({
      id: machine.id,
      merk: machine.merk,
      model: machine.model,
      tipe: machine.tipe,
      kapasitas: machine.kapasitas,
      warna: machine.warna,
      harga: machine.harga,
      tahun_rilis: machine.tahunRilis,
      spesifikasi: machine.spesifikasiParsed,
      fitur: machine.fiturParsed,
      deskripsi: machine.deskripsi,
      gambar_url: machine.gambarUrl
    }));

    res.status(200).json({
      success: true,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      },
      data
    });
  } catch (error) {
    console.error('Error fetching washing machines:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data mesin cuci.',
      error: error.message
    });
  }
};

// GET mesin cuci by ID
exports.getWashingMachineById = async (req, res) => {
  try {
    const { id } = req.params;

    const machine = await WashingMachine.findByPk(id);

    if (!machine || !machine.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Mesin cuci tidak ditemukan.'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: machine.id,
        merk: machine.merk,
        model: machine.model,
        tipe: machine.tipe,
        kapasitas: machine.kapasitas,
        warna: machine.warna,
        harga: machine.harga,
        tahun_rilis: machine.tahunRilis,
        spesifikasi: machine.spesifikasiParsed,
        fitur: machine.fiturParsed,
        deskripsi: machine.deskripsi,
        gambar_url: machine.gambarUrl
      }
    });
  } catch (error) {
    console.error('Error fetching washing machine:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data mesin cuci.',
      error: error.message
    });
  }
};

// GET mesin cuci by Model
exports.getWashingMachineByModel = async (req, res) => {
  try {
    const { model } = req.params;

    const machine = await WashingMachine.findOne({
      where: { model, isActive: true }
    });

    if (!machine) {
      return res.status(404).json({
        success: false,
        message: 'Mesin cuci dengan model tersebut tidak ditemukan.'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: machine.id,
        merk: machine.merk,
        model: machine.model,
        tipe: machine.tipe,
        kapasitas: machine.kapasitas,
        warna: machine.warna,
        harga: machine.harga,
        tahun_rilis: machine.tahunRilis,
        spesifikasi: machine.spesifikasiParsed,
        fitur: machine.fiturParsed,
        deskripsi: machine.deskripsi,
        gambar_url: machine.gambarUrl
      }
    });
  } catch (error) {
    console.error('Error fetching washing machine:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data mesin cuci.',
      error: error.message
    });
  }
};

// GET daftar merk
exports.getAvailableBrands = async (req, res) => {
  try {
    const brands = await WashingMachine.findAll({
      attributes: ['merk', [fn('COUNT', col('id')), 'count']],
      where: { isActive: true },
      group: ['merk'],
      order: [['merk', 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: brands.map(b => ({ merk: b.merk, count: parseInt(b.dataValues.count) }))
    });
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil daftar merk.',
      error: error.message
    });
  }
};

// GET daftar tipe
exports.getAvailableTypes = async (req, res) => {
  try {
    const types = await WashingMachine.findAll({
      attributes: ['tipe', [fn('COUNT', col('id')), 'count']],
      where: { isActive: true },
      group: ['tipe']
    });

    const typeLabels = {
      'TOP_LOADING': 'Top Loading',
      'FRONT_LOADING': 'Front Loading',
      'TWIN_TUB': 'Twin Tub (2 Tabung)',
      'PORTABLE': 'Portable'
    };

    res.status(200).json({
      success: true,
      data: types.map(t => ({
        tipe: t.tipe,
        label: typeLabels[t.tipe],
        count: parseInt(t.dataValues.count)
      }))
    });
  } catch (error) {
    console.error('Error fetching types:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil daftar tipe.',
      error: error.message
    });
  }
};

// GET statistik
exports.getStatistics = async (req, res) => {
  try {
    const totalProducts = await WashingMachine.count({ where: { isActive: true } });
    
    const byMerk = await WashingMachine.findAll({
      attributes: ['merk', [fn('COUNT', col('id')), 'count']],
      where: { isActive: true },
      group: ['merk'],
      order: [[literal('count'), 'DESC']]
    });

    const byTipe = await WashingMachine.findAll({
      attributes: ['tipe', [fn('COUNT', col('id')), 'count']],
      where: { isActive: true },
      group: ['tipe']
    });

    const priceRange = await WashingMachine.findOne({
      attributes: [
        [fn('MIN', col('harga')), 'min'],
        [fn('MAX', col('harga')), 'max'],
        [fn('AVG', col('harga')), 'avg']
      ],
      where: { isActive: true, harga: { [Op.not]: null } }
    });

    res.status(200).json({
      success: true,
      data: {
        total_products: totalProducts,
        by_merk: byMerk.map(b => ({ merk: b.merk, count: parseInt(b.dataValues.count) })),
        by_tipe: byTipe.map(t => ({ tipe: t.tipe, count: parseInt(t.dataValues.count) })),
        price_range: {
          min: priceRange?.dataValues?.min || 0,
          max: priceRange?.dataValues?.max || 0,
          avg: Math.round(priceRange?.dataValues?.avg || 0)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil statistik.',
      error: error.message
    });
  }
};


// ==================== ADMIN ENDPOINTS ====================

// POST - Tambah mesin cuci baru (Admin Only)
exports.createWashingMachine = async (req, res) => {
  try {
    const { merk, model, tipe, kapasitas, warna, harga, tahun_rilis, spesifikasi, fitur, deskripsi, gambar_url } = req.body;

    if (!merk || !model || !tipe || !kapasitas) {
      return res.status(400).json({
        success: false,
        message: 'Merk, Model, Tipe, dan Kapasitas wajib diisi.'
      });
    }

    const validTipes = ['TOP_LOADING', 'FRONT_LOADING', 'TWIN_TUB', 'PORTABLE'];
    if (!validTipes.includes(tipe)) {
      return res.status(400).json({
        success: false,
        message: `Tipe harus salah satu dari: ${validTipes.join(', ')}`
      });
    }

    const existingMachine = await WashingMachine.findOne({ where: { model } });
    if (existingMachine) {
      return res.status(400).json({
        success: false,
        message: 'Model mesin cuci sudah terdaftar.'
      });
    }

    const machine = await WashingMachine.create({
      merk,
      model,
      tipe,
      kapasitas,
      warna,
      harga,
      tahunRilis: tahun_rilis,
      spesifikasi: spesifikasi ? JSON.stringify(spesifikasi) : null,
      fitur: fitur ? JSON.stringify(fitur) : null,
      deskripsi,
      gambarUrl: gambar_url
    });

    res.status(201).json({
      success: true,
      message: 'Mesin cuci berhasil ditambahkan.',
      data: machine
    });
  } catch (error) {
    console.error('Error creating washing machine:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menambah mesin cuci.',
      error: error.message
    });
  }
};

// PUT - Update mesin cuci (Admin Only)
exports.updateWashingMachine = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const machine = await WashingMachine.findByPk(id);

    if (!machine) {
      return res.status(404).json({
        success: false,
        message: 'Mesin cuci tidak ditemukan.'
      });
    }

    const mappedData = {};
    if (updateData.merk !== undefined) mappedData.merk = updateData.merk;
    if (updateData.model !== undefined) mappedData.model = updateData.model;
    if (updateData.tipe !== undefined) mappedData.tipe = updateData.tipe;
    if (updateData.kapasitas !== undefined) mappedData.kapasitas = updateData.kapasitas;
    if (updateData.warna !== undefined) mappedData.warna = updateData.warna;
    if (updateData.harga !== undefined) mappedData.harga = updateData.harga;
    if (updateData.tahun_rilis !== undefined) mappedData.tahunRilis = updateData.tahun_rilis;
    if (updateData.spesifikasi !== undefined) {
      mappedData.spesifikasi = updateData.spesifikasi ? JSON.stringify(updateData.spesifikasi) : null;
    }
    if (updateData.fitur !== undefined) {
      mappedData.fitur = updateData.fitur ? JSON.stringify(updateData.fitur) : null;
    }
    if (updateData.deskripsi !== undefined) mappedData.deskripsi = updateData.deskripsi;
    if (updateData.gambar_url !== undefined) mappedData.gambarUrl = updateData.gambar_url;

    await machine.update(mappedData);

    res.status(200).json({
      success: true,
      message: 'Mesin cuci berhasil diperbarui.',
      data: machine
    });
  } catch (error) {
    console.error('Error updating washing machine:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui mesin cuci.',
      error: error.message
    });
  }
};

// DELETE - Soft delete mesin cuci (Admin Only)
exports.deleteWashingMachine = async (req, res) => {
  try {
    const { id } = req.params;

    const machine = await WashingMachine.findByPk(id);

    if (!machine) {
      return res.status(404).json({
        success: false,
        message: 'Mesin cuci tidak ditemukan.'
      });
    }

    await machine.update({ isActive: false });

    res.status(200).json({
      success: true,
      message: 'Mesin cuci berhasil dihapus.'
    });
  } catch (error) {
    console.error('Error deleting washing machine:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus mesin cuci.',
      error: error.message
    });
  }
};

// GET semua mesin cuci untuk admin (termasuk non-aktif)
exports.getAllWashingMachinesAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await WashingMachine.findAndCountAll({
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
      data: rows
    });
  } catch (error) {
    console.error('Error fetching washing machines:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data mesin cuci.',
      error: error.message
    });
  }
};