const { WashingMachine } = require('../models');

const sampleData = [
  // FRONT LOADING
  {
    merk: 'Samsung',
    model: 'WW90T654DLH',
    tipe: 'FRONT_LOADING',
    kapasitas: 9.0,
    warna: 'White',
    harga: 8500000,
    tahunRilis: 2023,
    spesifikasi: JSON.stringify({
      dimensi: '60 x 55 x 85 cm',
      berat: '67 kg',
      daya_listrik: '480 Watt',
      tegangan: '220V/50Hz',
      kecepatan_putar: '1400 RPM',
      konsumsi_air: '48 Liter',
      tingkat_kebisingan: '52 dB'
    }),
    fitur: JSON.stringify(['AI Control', 'Steam Wash', 'Eco Bubble Technology', 'Digital Inverter Motor', 'Quick Wash 15 min', 'WiFi Connectivity']),
    deskripsi: 'Mesin cuci front loading Samsung dengan teknologi AI Control yang dapat mendeteksi berat dan jenis kain secara otomatis.'
  },
  {
    merk: 'Samsung',
    model: 'WW80T3040BW',
    tipe: 'FRONT_LOADING',
    kapasitas: 8.0,
    warna: 'White',
    harga: 5200000,
    tahunRilis: 2022,
    spesifikasi: JSON.stringify({
      dimensi: '60 x 55 x 85 cm',
      berat: '62 kg',
      daya_listrik: '430 Watt',
      tegangan: '220V/50Hz',
      kecepatan_putar: '1200 RPM',
      konsumsi_air: '48 Liter'
    }),
    fitur: JSON.stringify(['Digital Inverter Motor', 'Drum Clean', 'Quick Wash', 'Delay End', 'Child Lock']),
    deskripsi: 'Mesin cuci front loading Samsung entry level dengan fitur dasar yang memadai.'
  },
  {
    merk: 'LG',
    model: 'FV1409S4W',
    tipe: 'FRONT_LOADING',
    kapasitas: 9.0,
    warna: 'Silver',
    harga: 9200000,
    tahunRilis: 2023,
    spesifikasi: JSON.stringify({
      dimensi: '60 x 56 x 85 cm',
      berat: '70 kg',
      daya_listrik: '520 Watt',
      tegangan: '220V/50Hz',
      kecepatan_putar: '1400 RPM',
      konsumsi_air: '50 Liter'
    }),
    fitur: JSON.stringify(['AI DD Technology', 'TurboWash 360', 'Steam+', 'Smart ThinQ (WiFi)', 'Inverter Direct Drive Motor', '6 Motion DD']),
    deskripsi: 'Mesin cuci LG dengan AI DD yang mendeteksi berat dan kelembutan kain untuk gerakan pencucian optimal.'
  },
  {
    merk: 'LG',
    model: 'FV1208S5W',
    tipe: 'FRONT_LOADING',
    kapasitas: 8.0,
    warna: 'White',
    harga: 7500000,
    tahunRilis: 2023,
    spesifikasi: JSON.stringify({
      dimensi: '60 x 56 x 85 cm',
      berat: '65 kg',
      daya_listrik: '480 Watt',
      kecepatan_putar: '1200 RPM'
    }),
    fitur: JSON.stringify(['AI DD Technology', 'Steam', 'Inverter Direct Drive Motor', '6 Motion DD', 'Tub Clean']),
    deskripsi: 'Mesin cuci LG dengan teknologi AI DD dan Steam untuk pembersihan mendalam.'
  },
  {
    merk: 'Sharp',
    model: 'ES-FL1082G',
    tipe: 'FRONT_LOADING',
    kapasitas: 8.0,
    warna: 'Dark Grey',
    harga: 5800000,
    tahunRilis: 2022,
    spesifikasi: JSON.stringify({
      dimensi: '59.5 x 53 x 84.5 cm',
      berat: '62 kg',
      daya_listrik: '400 Watt',
      kecepatan_putar: '1200 RPM'
    }),
    fitur: JSON.stringify(['Plasmacluster Ion', 'Inverter Motor', 'Hygiene Steam', '15 Washing Programs', 'Drum Clean']),
    deskripsi: 'Mesin cuci Sharp dengan teknologi Plasmacluster untuk membunuh bakteri dan jamur.'
  },
  {
    merk: 'Electrolux',
    model: 'EWF9024P5WB',
    tipe: 'FRONT_LOADING',
    kapasitas: 9.0,
    warna: 'White',
    harga: 8900000,
    tahunRilis: 2023,
    spesifikasi: JSON.stringify({
      dimensi: '60 x 55.7 x 84.7 cm',
      berat: '68 kg',
      daya_listrik: '500 Watt',
      kecepatan_putar: '1200 RPM'
    }),
    fitur: JSON.stringify(['UltraMix Technology', 'Vapour Care', 'SensiCare System', 'Woolmark Blue Certified', 'Anti-Allergy Program']),
    deskripsi: 'Mesin cuci Electrolux dengan UltraMix Technology untuk hasil lebih bersih.'
  },
  {
    merk: 'Panasonic',
    model: 'NA-V10FX2',
    tipe: 'FRONT_LOADING',
    kapasitas: 10.0,
    warna: 'White',
    harga: 7500000,
    tahunRilis: 2023,
    spesifikasi: JSON.stringify({
      dimensi: '59.8 x 60.5 x 84.5 cm',
      berat: '73 kg',
      daya_listrik: '450 Watt',
      kecepatan_putar: '1200 RPM'
    }),
    fitur: JSON.stringify(['ActiveFoam System', 'StainMaster+', 'Econavi Sensor', 'Blue Ag+ Antibacterial', 'Hot Wash 60°C']),
    deskripsi: 'Mesin cuci Panasonic dengan ActiveFoam System untuk membersihkan noda membandel.'
  },

  // TOP LOADING
  {
    merk: 'Samsung',
    model: 'WA90T5260BY',
    tipe: 'TOP_LOADING',
    kapasitas: 9.0,
    warna: 'Black',
    harga: 4200000,
    tahunRilis: 2022,
    spesifikasi: JSON.stringify({
      dimensi: '54 x 56 x 98 cm',
      berat: '38 kg',
      daya_listrik: '380 Watt',
      kecepatan_putar: '700 RPM'
    }),
    fitur: JSON.stringify(['Wobble Technology', 'Magic Filter', 'Digital Inverter Motor', 'Air Turbo Drying', 'Child Lock']),
    deskripsi: 'Mesin cuci top loading Samsung dengan Wobble Technology untuk pencucian lembut.'
  },
  {
    merk: 'Samsung',
    model: 'WA11T5260BV',
    tipe: 'TOP_LOADING',
    kapasitas: 11.0,
    warna: 'Silver',
    harga: 5100000,
    tahunRilis: 2023,
    spesifikasi: JSON.stringify({
      dimensi: '58 x 60 x 102 cm',
      berat: '42 kg',
      daya_listrik: '420 Watt',
      kecepatan_putar: '700 RPM'
    }),
    fitur: JSON.stringify(['Wobble Technology', 'Magic Filter', 'Digital Inverter Motor', 'Air Turbo Drying']),
    deskripsi: 'Mesin cuci top loading Samsung kapasitas besar 11 kg.'
  },
  {
    merk: 'LG',
    model: 'T2109VS2M',
    tipe: 'TOP_LOADING',
    kapasitas: 9.0,
    warna: 'Silver',
    harga: 4800000,
    tahunRilis: 2023,
    spesifikasi: JSON.stringify({
      dimensi: '54 x 54 x 96 cm',
      berat: '35 kg',
      daya_listrik: '340 Watt',
      kecepatan_putar: '740 RPM'
    }),
    fitur: JSON.stringify(['Smart Inverter', 'TurboDrum', 'Punch+3 Pulsator', 'Smart Diagnosis', 'Wind Jet Dry']),
    deskripsi: 'Mesin cuci top loading LG dengan TurboDrum untuk hasil cuci maksimal.'
  },
  {
    merk: 'LG',
    model: 'T2311VS2B',
    tipe: 'TOP_LOADING',
    kapasitas: 11.0,
    warna: 'Black Steel',
    harga: 5600000,
    tahunRilis: 2023,
    spesifikasi: JSON.stringify({
      dimensi: '58 x 58 x 100 cm',
      berat: '40 kg',
      daya_listrik: '380 Watt',
      kecepatan_putar: '740 RPM'
    }),
    fitur: JSON.stringify(['Smart Inverter', 'TurboDrum', 'Steam', 'Smart ThinQ (WiFi)', 'Punch+3 Pulsator']),
    deskripsi: 'Mesin cuci top loading LG kapasitas besar dengan Steam dan WiFi.'
  },
  {
    merk: 'Polytron',
    model: 'PAW-9027B',
    tipe: 'TOP_LOADING',
    kapasitas: 9.0,
    warna: 'Blue',
    harga: 2100000,
    tahunRilis: 2022,
    spesifikasi: JSON.stringify({
      dimensi: '51 x 52 x 92 cm',
      berat: '28 kg',
      daya_listrik: '350 Watt',
      kecepatan_putar: '650 RPM'
    }),
    fitur: JSON.stringify(['Turbo Wash', 'Auto Balance', '8 Washing Programs', 'Magic Filter', 'Air Dry']),
    deskripsi: 'Mesin cuci top loading Polytron dengan harga terjangkau.'
  },
  {
    merk: 'Aqua Japan',
    model: 'AQW-810DD',
    tipe: 'TOP_LOADING',
    kapasitas: 8.0,
    warna: 'Grey',
    harga: 2800000,
    tahunRilis: 2023,
    spesifikasi: JSON.stringify({
      dimensi: '53 x 53 x 94 cm',
      berat: '30 kg',
      daya_listrik: '360 Watt',
      kecepatan_putar: '680 RPM'
    }),
    fitur: JSON.stringify(['Hijab Mode', 'Supersonic Wave', 'Magic Filter', '8 Washing Programs', 'Soft Close Lid']),
    deskripsi: 'Mesin cuci Aqua Japan dengan fitur Hijab Mode khusus.'
  },
  {
    merk: 'Sharp',
    model: 'ES-M805P-GB',
    tipe: 'TOP_LOADING',
    kapasitas: 8.0,
    warna: 'Grey Blue',
    harga: 2600000,
    tahunRilis: 2022,
    spesifikasi: JSON.stringify({
      dimensi: '52 x 52 x 92 cm',
      berat: '29 kg',
      daya_listrik: '340 Watt',
      kecepatan_putar: '660 RPM'
    }),
    fitur: JSON.stringify(['Mega Mouth', 'Dolphin Pulsator', 'Fuzzy Control', 'Magic Filter', 'Air Dry']),
    deskripsi: 'Mesin cuci Sharp dengan bukaan Mega Mouth untuk kemudahan.'
  },

  // TWIN TUB
  {
    merk: 'Sharp',
    model: 'ES-T95CR',
    tipe: 'TWIN_TUB',
    kapasitas: 9.0,
    warna: 'Blue',
    harga: 1800000,
    tahunRilis: 2022,
    spesifikasi: JSON.stringify({
      dimensi: '86 x 46 x 96 cm',
      berat: '22 kg',
      daya_listrik: '350 Watt',
      kecepatan_putar: '1350 RPM',
      kapasitas_spin: '6.5 kg'
    }),
    fitur: JSON.stringify(['Super Aquamagic', 'Separate Timer', 'Air Intake Spin', 'Rust Proof Body', 'High Speed Spin']),
    deskripsi: 'Mesin cuci 2 tabung Sharp dengan harga ekonomis.'
  },
  {
    merk: 'Sharp',
    model: 'ES-T1290',
    tipe: 'TWIN_TUB',
    kapasitas: 12.0,
    warna: 'Grey',
    harga: 2400000,
    tahunRilis: 2023,
    spesifikasi: JSON.stringify({
      dimensi: '96 x 50 x 100 cm',
      berat: '26 kg',
      daya_listrik: '400 Watt',
      kecepatan_putar: '1400 RPM',
      kapasitas_spin: '8.0 kg'
    }),
    fitur: JSON.stringify(['Super Aquamagic', 'Big Pulsator', 'Air Intake Spin', 'Rust Proof Body']),
    deskripsi: 'Mesin cuci 2 tabung Sharp kapasitas jumbo 12 kg.'
  },
  {
    merk: 'Sanken',
    model: 'TW-1123GBK',
    tipe: 'TWIN_TUB',
    kapasitas: 11.0,
    warna: 'Black',
    harga: 2200000,
    tahunRilis: 2023,
    spesifikasi: JSON.stringify({
      dimensi: '92 x 48 x 98 cm',
      berat: '25 kg',
      daya_listrik: '380 Watt',
      kecepatan_putar: '1400 RPM',
      kapasitas_spin: '7.5 kg'
    }),
    fitur: JSON.stringify(['Eco Wash', 'Powerful Pulsator', 'Rust Resistant Body', 'Dual Timer', 'High Speed Spinner']),
    deskripsi: 'Mesin cuci 2 tabung Sanken kapasitas jumbo 11 kg.'
  },
  {
    merk: 'Panasonic',
    model: 'NA-W96BBZ',
    tipe: 'TWIN_TUB',
    kapasitas: 9.0,
    warna: 'Blue',
    harga: 2100000,
    tahunRilis: 2023,
    spesifikasi: JSON.stringify({
      dimensi: '88 x 47 x 97 cm',
      berat: '23 kg',
      daya_listrik: '360 Watt',
      kecepatan_putar: '1380 RPM',
      kapasitas_spin: '6.5 kg'
    }),
    fitur: JSON.stringify(['Active Foam System', 'Powerful Spinner', 'Ergonomic Design', 'Aqua Filter']),
    deskripsi: 'Mesin cuci 2 tabung Panasonic dengan Active Foam System.'
  },

  // PORTABLE
  {
    merk: 'Midea',
    model: 'MAM120-S2001G',
    tipe: 'PORTABLE',
    kapasitas: 3.0,
    warna: 'White',
    harga: 1500000,
    tahunRilis: 2023,
    spesifikasi: JSON.stringify({
      dimensi: '44 x 42 x 73 cm',
      berat: '15 kg',
      daya_listrik: '260 Watt',
      kecepatan_putar: '800 RPM'
    }),
    fitur: JSON.stringify(['Compact Design', 'Transparent Lid', 'Multiple Wash Programs', 'Spin Dry', 'Portable Wheels']),
    deskripsi: 'Mesin cuci portable Midea untuk apartemen atau kos-kosan.'
  },
  {
    merk: 'Xiaomi',
    model: 'XHQB30MJ101',
    tipe: 'PORTABLE',
    kapasitas: 3.0,
    warna: 'White',
    harga: 1800000,
    tahunRilis: 2023,
    spesifikasi: JSON.stringify({
      dimensi: '42 x 42 x 75 cm',
      berat: '14 kg',
      daya_listrik: '240 Watt',
      kecepatan_putar: '850 RPM'
    }),
    fitur: JSON.stringify(['App Control (Mi Home)', 'Self Cleaning', 'Multiple Wash Modes', 'Compact Design', 'Low Noise']),
    deskripsi: 'Mesin cuci portable Xiaomi dengan kontrol via aplikasi Mi Home.'
  },
  {
    merk: 'Toshiba',
    model: 'AW-J800AN',
    tipe: 'PORTABLE',
    kapasitas: 4.5,
    warna: 'Grey',
    harga: 2200000,
    tahunRilis: 2022,
    spesifikasi: JSON.stringify({
      dimensi: '47 x 45 x 78 cm',
      berat: '18 kg',
      daya_listrik: '280 Watt',
      kecepatan_putar: '780 RPM'
    }),
    fitur: JSON.stringify(['Great Waves Technology', 'Self Cleaning', 'Compact Design', 'Multiple Wash Programs']),
    deskripsi: 'Mesin cuci portable Toshiba dengan kapasitas 4.5 kg.'
  }
];

const seedWashingMachines = async () => {
  try {
    console.log('🌱 Seeding washing machines data...');
    
    for (const data of sampleData) {
      const existing = await WashingMachine.findOne({ where: { model: data.model } });
      if (!existing) {
        await WashingMachine.create(data);
        console.log(`  ✅ Added: ${data.merk} ${data.model}`);
      } else {
        console.log(`  ⏭️  Skipped: ${data.merk} ${data.model}`);
      }
    }
    
    console.log(`✅ Seeding completed! Total: ${sampleData.length} products`);
  } catch (error) {
    console.error('❌ Error seeding:', error);
  }
};

module.exports = { seedWashingMachines };