/**
 * app.js - Aplicación completa PWA Mobile First: Kilometraje CGR Costa Rica
 * 100% autónoma, sin dependencias externas, compatible con file:// y GitHub Pages.
 */

/* ==========================================================================
   1. MÓDULO DE TARIFAS OFICIALES CGR (rates.js)
   Fuente: https://www.cgr.go.cr/02-consultas/consulta_zon-kilo-via.html
   ========================================================================== */
const BASE_YEAR = 2025;

const CATEGORIES = {
  RURAL_GASOLINA: 'RURAL_GASOLINA',
  RURAL_DIESEL: 'RURAL_DIESEL',
  LIVIANO_GASOLINA_A: 'LIVIANO_GASOLINA_A', // <= 1600cc
  LIVIANO_GASOLINA_B: 'LIVIANO_GASOLINA_B', // > 1600cc
  LIVIANO_DIESEL: 'LIVIANO_DIESEL',
  MOTO_GASOLINA: 'MOTO_GASOLINA',
  MOTO_ELECTRICA: 'MOTO_ELECTRICA',
  HIBRIDO: 'HIBRIDO',
  ELECTRICO: 'ELECTRICO'
};

const CATEGORY_LABELS = {
  [CATEGORIES.RURAL_GASOLINA]: 'Vehículo Rural Gasolina',
  [CATEGORIES.RURAL_DIESEL]: 'Vehículo Rural Diesel',
  [CATEGORIES.LIVIANO_GASOLINA_A]: 'Vehículo Liviano Gasolina A (≤ 1.600 cc)',
  [CATEGORIES.LIVIANO_GASOLINA_B]: 'Vehículo Liviano Gasolina B (> 1.600 cc)',
  [CATEGORIES.LIVIANO_DIESEL]: 'Vehículo Liviano Diesel',
  [CATEGORIES.MOTO_GASOLINA]: 'Motocicleta Gasolina',
  [CATEGORIES.MOTO_ELECTRICA]: 'Motocicleta Eléctrica',
  [CATEGORIES.HIBRIDO]: 'Vehículo Híbrido',
  [CATEGORIES.ELECTRICO]: 'Vehículo Eléctrico'
};

const RATES_MATRIX = [
  // 0 años (Modelo 2025)
  {
    age: 0,
    modelYear: 2025,
    [CATEGORIES.RURAL_GASOLINA]: 293.90,
    [CATEGORIES.RURAL_DIESEL]: 266.91,
    [CATEGORIES.LIVIANO_GASOLINA_A]: 199.65,
    [CATEGORIES.LIVIANO_GASOLINA_B]: 254.10,
    [CATEGORIES.LIVIANO_DIESEL]: 231.28,
    [CATEGORIES.MOTO_GASOLINA]: 71.56,
    [CATEGORIES.MOTO_ELECTRICA]: 60.24,
    [CATEGORIES.HIBRIDO]: 249.30,
    [CATEGORIES.ELECTRICO]: 190.97
  },
  // 1 año (Modelo 2024)
  {
    age: 1,
    modelYear: 2024,
    [CATEGORIES.RURAL_GASOLINA]: 273.00,
    [CATEGORIES.RURAL_DIESEL]: 246.46,
    [CATEGORIES.LIVIANO_GASOLINA_A]: 187.53,
    [CATEGORIES.LIVIANO_GASOLINA_B]: 236.41,
    [CATEGORIES.LIVIANO_DIESEL]: 215.98,
    [CATEGORIES.MOTO_GASOLINA]: 69.75,
    [CATEGORIES.MOTO_ELECTRICA]: 53.08,
    [CATEGORIES.HIBRIDO]: 231.02,
    [CATEGORIES.ELECTRICO]: 167.38
  },
  // 2 años (Modelo 2023)
  {
    age: 2,
    modelYear: 2023,
    [CATEGORIES.RURAL_GASOLINA]: 261.55,
    [CATEGORIES.RURAL_DIESEL]: 235.12,
    [CATEGORIES.LIVIANO_GASOLINA_A]: 180.97,
    [CATEGORIES.LIVIANO_GASOLINA_B]: 226.70,
    [CATEGORIES.LIVIANO_DIESEL]: 207.65,
    [CATEGORIES.MOTO_GASOLINA]: 69.05,
    [CATEGORIES.MOTO_ELECTRICA]: 48.84,
    [CATEGORIES.HIBRIDO]: 220.98,
    [CATEGORIES.ELECTRICO]: 153.77
  },
  // 3 años (Modelo 2022)
  {
    age: 3,
    modelYear: 2022,
    [CATEGORIES.RURAL_GASOLINA]: 255.78,
    [CATEGORIES.RURAL_DIESEL]: 229.25,
    [CATEGORIES.LIVIANO_GASOLINA_A]: 177.76,
    [CATEGORIES.LIVIANO_GASOLINA_B]: 221.77,
    [CATEGORIES.LIVIANO_DIESEL]: 203.50,
    [CATEGORIES.MOTO_GASOLINA]: 69.01,
    [CATEGORIES.MOTO_ELECTRICA]: 46.35,
    [CATEGORIES.HIBRIDO]: 215.90,
    [CATEGORIES.ELECTRICO]: 146.17
  },
  // 4 años (Modelo 2021)
  {
    age: 4,
    modelYear: 2021,
    [CATEGORIES.RURAL_GASOLINA]: 253.39,
    [CATEGORIES.RURAL_DIESEL]: 226.66,
    [CATEGORIES.LIVIANO_GASOLINA_A]: 176.54,
    [CATEGORIES.LIVIANO_GASOLINA_B]: 219.71,
    [CATEGORIES.LIVIANO_DIESEL]: 201.86,
    [CATEGORIES.MOTO_GASOLINA]: 69.01,
    [CATEGORIES.MOTO_ELECTRICA]: 46.35,
    [CATEGORIES.HIBRIDO]: 213.79,
    [CATEGORIES.ELECTRICO]: 143.19
  },
  // 5 años (Modelo 2020)
  {
    age: 5,
    modelYear: 2020,
    [CATEGORIES.RURAL_GASOLINA]: 253.05,
    [CATEGORIES.RURAL_DIESEL]: 226.02,
    [CATEGORIES.LIVIANO_GASOLINA_A]: 176.52,
    [CATEGORIES.LIVIANO_GASOLINA_B]: 219.37,
    [CATEGORIES.LIVIANO_DIESEL]: 201.72,
    [CATEGORIES.MOTO_GASOLINA]: 69.01,
    [CATEGORIES.MOTO_ELECTRICA]: 46.35,
    [CATEGORIES.HIBRIDO]: 213.48,
    [CATEGORIES.ELECTRICO]: 140.43
  },
  // 6 años (Modelo 2019)
  {
    age: 6,
    modelYear: 2019,
    [CATEGORIES.RURAL_GASOLINA]: 253.05,
    [CATEGORIES.RURAL_DIESEL]: 226.02,
    [CATEGORIES.LIVIANO_GASOLINA_A]: 176.52,
    [CATEGORIES.LIVIANO_GASOLINA_B]: 219.37,
    [CATEGORIES.LIVIANO_DIESEL]: 201.72,
    [CATEGORIES.MOTO_GASOLINA]: 69.01,
    [CATEGORIES.MOTO_ELECTRICA]: 46.35,
    [CATEGORIES.HIBRIDO]: 213.48,
    [CATEGORIES.ELECTRICO]: 140.01
  },
  // 7 años (Modelo 2018)
  {
    age: 7,
    modelYear: 2018,
    [CATEGORIES.RURAL_GASOLINA]: 250.28,
    [CATEGORIES.RURAL_DIESEL]: 222.75,
    [CATEGORIES.LIVIANO_GASOLINA_A]: 175.25,
    [CATEGORIES.LIVIANO_GASOLINA_B]: 216.92,
    [CATEGORIES.LIVIANO_DIESEL]: 199.89,
    [CATEGORIES.MOTO_GASOLINA]: 69.01,
    [CATEGORIES.MOTO_ELECTRICA]: 46.35,
    [CATEGORIES.HIBRIDO]: 211.10,
    [CATEGORIES.ELECTRICO]: 134.94
  },
  // 8 años (Modelo 2017)
  {
    age: 8,
    modelYear: 2017,
    [CATEGORIES.RURAL_GASOLINA]: 247.27,
    [CATEGORIES.RURAL_DIESEL]: 219.56,
    [CATEGORIES.LIVIANO_GASOLINA_A]: 173.66,
    [CATEGORIES.LIVIANO_GASOLINA_B]: 214.32,
    [CATEGORIES.LIVIANO_DIESEL]: 197.79,
    [CATEGORIES.MOTO_GASOLINA]: 69.01,
    [CATEGORIES.MOTO_ELECTRICA]: 46.35,
    [CATEGORIES.HIBRIDO]: 208.54,
    [CATEGORIES.ELECTRICO]: 130.63
  },
  // 9 años (Modelo 2016)
  {
    age: 9,
    modelYear: 2016,
    [CATEGORIES.RURAL_GASOLINA]: 244.84,
    [CATEGORIES.RURAL_DIESEL]: 216.92,
    [CATEGORIES.LIVIANO_GASOLINA_A]: 172.41,
    [CATEGORIES.LIVIANO_GASOLINA_B]: 212.21,
    [CATEGORIES.LIVIANO_DIESEL]: 196.10,
    [CATEGORIES.MOTO_GASOLINA]: 69.01,
    [CATEGORIES.MOTO_ELECTRICA]: 46.35,
    [CATEGORIES.HIBRIDO]: 206.51,
    [CATEGORIES.ELECTRICO]: 126.99
  },
  // 10 y más años (Modelo 2015 o anterior)
  {
    age: 10,
    modelYear: 2015,
    [CATEGORIES.RURAL_GASOLINA]: 242.92,
    [CATEGORIES.RURAL_DIESEL]: 214.78,
    [CATEGORIES.LIVIANO_GASOLINA_A]: 171.46,
    [CATEGORIES.LIVIANO_GASOLINA_B]: 210.52,
    [CATEGORIES.LIVIANO_DIESEL]: 194.78,
    [CATEGORIES.MOTO_GASOLINA]: 69.01,
    [CATEGORIES.MOTO_ELECTRICA]: 46.35,
    [CATEGORIES.HIBRIDO]: 204.94,
    [CATEGORIES.ELECTRICO]: 123.98
  }
];

function calculateAge(year) {
  const y = parseInt(year, 10);
  if (isNaN(y) || y >= BASE_YEAR) return 0;
  const age = BASE_YEAR - y;
  return age >= 10 ? 10 : age;
}

function classifyVehicle(vehicle) {
  const {
    bodyType = 'sedan',
    fuel = 'gasolina',
    engineCc = 1600,
    is4x4 = false,
    year = BASE_YEAR
  } = vehicle || {};

  const cc = parseFloat(engineCc) || 0;
  const age = calculateAge(year);
  let category = CATEGORIES.LIVIANO_GASOLINA_A;
  let notes = [];

  if (bodyType === 'moto') {
    if (fuel === 'electrico') {
      category = CATEGORIES.MOTO_ELECTRICA;
      notes.push('Motocicleta con motor 100% eléctrico.');
    } else {
      category = CATEGORIES.MOTO_GASOLINA;
      notes.push('Motocicleta con motor a combustión (gasolina).');
    }
  } else if (fuel === 'electrico') {
    category = CATEGORIES.ELECTRICO;
    notes.push('Vehículo 100% eléctrico.');
  } else if (fuel === 'hibrido') {
    category = CATEGORIES.HIBRIDO;
    notes.push('Vehículo con propulsión híbrida.');
  } else {
    const isRuralBody = bodyType === 'rural_pickup';
    const isLargeEngine = cc > 2200;
    const has4x4 = Boolean(is4x4);

    if (isRuralBody && isLargeEngine && has4x4) {
      if (fuel === 'diesel') {
        category = CATEGORIES.RURAL_DIESEL;
        notes.push('Nota 1: Carrocería rural/familiar/pick up, motor > 2.200 cc y doble tracción (Diesel).');
      } else {
        category = CATEGORIES.RURAL_GASOLINA;
        notes.push('Nota 1: Carrocería rural/familiar/pick up, motor > 2.200 cc y doble tracción (Gasolina).');
      }
    } else {
      if (fuel === 'diesel') {
        category = CATEGORIES.LIVIANO_DIESEL;
        notes.push('Nota 2: Vehículo liviano con motor diesel.');
      } else {
        if (cc <= 1600) {
          category = CATEGORIES.LIVIANO_GASOLINA_A;
          notes.push('Nota 2 y 3: Vehículo liviano gasolina con motor hasta 1.600 cc.');
        } else {
          category = CATEGORIES.LIVIANO_GASOLINA_B;
          notes.push('Nota 2 y 4: Vehículo liviano gasolina con motor de más de 1.600 cc.');
        }
      }
    }
  }

  const rateRow = RATES_MATRIX[age] || RATES_MATRIX[RATES_MATRIX.length - 1];
  const rate = rateRow[category] || 0;

  return {
    category,
    label: CATEGORY_LABELS[category],
    age,
    rate,
    notes: notes.join(' ')
  };
}

function getRate(category, age) {
  const clampedAge = Math.max(0, Math.min(10, parseInt(age, 10) || 0));
  const row = RATES_MATRIX[clampedAge];
  return row ? (row[category] || 0) : 0;
}

/* ==========================================================================
   2. MÓDULO DE PERSISTENCIA LOCAL (storage.js)
   ========================================================================== */
const STORAGE_KEYS = {
  VEHICLE: 'cgr_pwa_vehicle',
  FUEL_CONFIG: 'cgr_pwa_fuel_config',
  USER_PROFILE: 'cgr_pwa_user_profile',
  TRIPS: 'cgr_pwa_trips',
  CURRENT_DRAFT: 'cgr_pwa_current_draft'
};

const DEFAULT_VEHICLE = {
  brand: 'Toyota',
  model: 'Corolla',
  plate: '',
  year: 2022,
  bodyType: 'sedan',
  fuel: 'gasolina',
  engineCc: 1800,
  is4x4: false,
  currentOdometer: 65400,
  manualCategoryOverride: ''
};

const DEFAULT_FUEL_CONFIG = {
  fuelType: 'Gasolina Súper',
  pricePerLiter: 690,
  kmPerLiter: 13.5
};

const DEFAULT_USER_PROFILE = {
  fullName: '',
  idNumber: '',
  department: '',
  position: '',
  institution: ''
};

const Storage = {
  getVehicle() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VEHICLE);
      return data ? { ...DEFAULT_VEHICLE, ...JSON.parse(data) } : { ...DEFAULT_VEHICLE };
    } catch (e) {
      return { ...DEFAULT_VEHICLE };
    }
  },

  saveVehicle(vehicle) {
    try {
      localStorage.setItem(STORAGE_KEYS.VEHICLE, JSON.stringify(vehicle));
    } catch (e) {}
  },

  getFuelConfig() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FUEL_CONFIG);
      return data ? { ...DEFAULT_FUEL_CONFIG, ...JSON.parse(data) } : { ...DEFAULT_FUEL_CONFIG };
    } catch (e) {
      return { ...DEFAULT_FUEL_CONFIG };
    }
  },

  saveFuelConfig(config) {
    try {
      localStorage.setItem(STORAGE_KEYS.FUEL_CONFIG, JSON.stringify(config));
    } catch (e) {}
  },

  getUserProfile() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return data ? { ...DEFAULT_USER_PROFILE, ...JSON.parse(data) } : { ...DEFAULT_USER_PROFILE };
    } catch (e) {
      return { ...DEFAULT_USER_PROFILE };
    }
  },

  saveUserProfile(profile) {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (e) {}
  },

  getTrips() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRIPS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  saveTrip(trip) {
    try {
      const trips = this.getTrips();
      const existingIndex = trips.findIndex(t => t.id === trip.id);
      if (existingIndex >= 0) {
        trips[existingIndex] = trip;
      } else {
        trips.unshift(trip);
      }
      localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));
      return trips;
    } catch (e) {
      return [];
    }
  },

  deleteTrip(tripId) {
    try {
      const trips = this.getTrips().filter(t => t.id !== tripId);
      localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));
      return trips;
    } catch (e) {
      return [];
    }
  },

  getCurrentDraft() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_DRAFT);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  saveCurrentDraft(draft) {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_DRAFT, JSON.stringify(draft));
    } catch (e) {}
  },

  clearCurrentDraft() {
    try {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_DRAFT);
    } catch (e) {}
  }
};

/* ==========================================================================
   3. GESTIÓN DEL VEHÍCULO (VehicleManager)
   ========================================================================== */
class VehicleManager {
  constructor(onChangeCallback) {
    this.vehicle = Storage.getVehicle();
    this.fuelConfig = Storage.getFuelConfig();
    this.userProfile = Storage.getUserProfile();
    this.onChange = onChangeCallback || (() => {});
  }

  getVehicle() {
    return this.vehicle;
  }

  getFuelConfig() {
    return this.fuelConfig;
  }

  getUserProfile() {
    return this.userProfile;
  }

  updateVehicle(partial) {
    this.vehicle = { ...this.vehicle, ...partial };
    Storage.saveVehicle(this.vehicle);
    this.onChange();
  }

  updateFuelConfig(partial) {
    this.fuelConfig = { ...this.fuelConfig, ...partial };
    Storage.saveFuelConfig(this.fuelConfig);
    this.onChange();
  }

  updateUserProfile(partial) {
    this.userProfile = { ...this.userProfile, ...partial };
    Storage.saveUserProfile(this.userProfile);
    this.onChange();
  }

  getActiveClassification() {
    const classification = classifyVehicle(this.vehicle);
    if (this.vehicle.manualCategoryOverride && CATEGORIES[this.vehicle.manualCategoryOverride]) {
      const manualCat = this.vehicle.manualCategoryOverride;
      const age = calculateAge(this.vehicle.year);
      const manualRate = getRate(manualCat, age);
      return {
        category: manualCat,
        label: CATEGORY_LABELS[manualCat] + ' (Manual)',
        age,
        rate: manualRate,
        notes: `Tarifa asignada manualmente. Antigüedad: ${age} años.`,
        isManual: true
      };
    }
    return {
      ...classification,
      isManual: false
    };
  }
}

/* ==========================================================================
   4. GESTIÓN DEL VIAJE Y CÁLCULOS (TripManager)
   ========================================================================== */
class TripManager {
  constructor(vehicleManager, onChangeCallback) {
    this.vehicleManager = vehicleManager;
    this.onChange = onChangeCallback || (() => {});

    this.origin = 'Oficina Central / San José';
    this.destinations = [
      { id: 'dest-1', name: 'Sucursal Alajuela', distanceKm: 21.5, purpose: 'Reunión de coordinación' }
    ];
    this.returnToOrigin = true;
    this.customReturnKm = null;
    this.purpose = 'Gira de trabajo y supervisión técnica';
    this.date = new Date().toISOString().split('T')[0];
    this.notes = '';
    this.startOdometer = null;
  }

  setOrigin(origin) {
    this.origin = origin;
    this.notify();
  }

  setPurpose(purpose) {
    this.purpose = purpose;
    this.notify();
  }

  setDate(date) {
    this.date = date;
    this.notify();
  }

  setStartOdometer(val) {
    this.startOdometer = val ? parseFloat(val) : null;
    this.notify();
  }

  addDestination(name = '', distanceKm = 0, purpose = '') {
    const newDest = {
      id: 'dest-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      name: name || `Destino ${this.destinations.length + 1}`,
      distanceKm: parseFloat(distanceKm) || 0,
      purpose: purpose || ''
    };
    this.destinations.push(newDest);
    this.notify();
    return newDest;
  }

  updateDestination(id, partial) {
    const dest = this.destinations.find(d => d.id === id);
    if (dest) {
      if (partial.distanceKm !== undefined) {
        partial.distanceKm = Math.max(0, parseFloat(partial.distanceKm) || 0);
      }
      Object.assign(dest, partial);
      this.notify();
    }
  }

  removeDestination(id) {
    if (this.destinations.length <= 1) {
      this.destinations = [{
        id: 'dest-' + Date.now(),
        name: '',
        distanceKm: 0,
        purpose: ''
      }];
    } else {
      this.destinations = this.destinations.filter(d => d.id !== id);
    }
    this.notify();
  }

  moveDestination(id, direction) {
    const index = this.destinations.findIndex(d => d.id === id);
    if (index < 0) return;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < this.destinations.length) {
      const temp = this.destinations[index];
      this.destinations[index] = this.destinations[newIndex];
      this.destinations[newIndex] = temp;
      this.notify();
    }
  }

  setReturnToOrigin(enabled) {
    this.returnToOrigin = Boolean(enabled);
    this.notify();
  }

  setCustomReturnKm(km) {
    this.customReturnKm = km === null || km === '' ? null : Math.max(0, parseFloat(km) || 0);
    this.notify();
  }

  getReturnDistanceKm() {
    if (!this.returnToOrigin) return 0;
    if (this.customReturnKm !== null) return this.customReturnKm;

    if (this.destinations.length === 1) {
      return this.destinations[0].distanceKm || 0;
    }

    const outwardSum = this.destinations.reduce((acc, d) => acc + (d.distanceKm || 0), 0);
    return Math.round(outwardSum * 100) / 100;
  }

  getLegs() {
    const legs = [];
    let previousPoint = this.origin || 'Origen';

    this.destinations.forEach((dest, index) => {
      legs.push({
        index: index + 1,
        from: previousPoint,
        to: dest.name || `Destino ${index + 1}`,
        distanceKm: Math.round((dest.distanceKm || 0) * 100) / 100,
        purpose: dest.purpose || '',
        isReturn: false
      });
      previousPoint = dest.name || `Destino ${index + 1}`;
    });

    if (this.returnToOrigin && this.destinations.length > 0) {
      const returnKm = this.getReturnDistanceKm();
      legs.push({
        index: legs.length + 1,
        from: previousPoint,
        to: this.origin || 'Origen',
        distanceKm: Math.round(returnKm * 100) / 100,
        purpose: 'Retorno a punto de partida',
        isReturn: true
      });
    }

    return legs;
  }

  calculate() {
    const legs = this.getLegs();
    const totalKm = legs.reduce((acc, leg) => acc + leg.distanceKm, 0);
    const roundedTotalKm = Math.round(totalKm * 100) / 100;

    const vehicleClassification = this.vehicleManager.getActiveClassification();
    const ratePerKm = vehicleClassification.rate || 0;

    const mileageAmount = Math.round(roundedTotalKm * ratePerKm * 100) / 100;

    const fuelConfig = this.vehicleManager.getFuelConfig();
    const kmPerLiter = fuelConfig.kmPerLiter > 0 ? fuelConfig.kmPerLiter : 13.5;
    const pricePerLiter = fuelConfig.pricePerLiter >= 0 ? fuelConfig.pricePerLiter : 690;

    const estimatedLiters = kmPerLiter > 0 ? Math.round((roundedTotalKm / kmPerLiter) * 100) / 100 : 0;
    const fuelCost = Math.round(estimatedLiters * pricePerLiter * 100) / 100;

    const vehicle = this.vehicleManager.getVehicle();
    const startOdo = this.startOdometer !== null ? this.startOdometer : (vehicle.currentOdometer || 0);
    const endOdo = startOdo + roundedTotalKm;

    return {
      totalKm: roundedTotalKm,
      legs,
      ratePerKm,
      mileageAmount,
      estimatedLiters,
      fuelCost,
      kmPerLiter,
      pricePerLiter,
      fuelType: fuelConfig.fuelType,
      vehicleClassification,
      startOdometer: startOdo,
      endOdometer: endOdo
    };
  }

  createTripRecord() {
    const calc = this.calculate();
    const vehicle = this.vehicleManager.getVehicle();
    const userProfile = this.vehicleManager.getUserProfile();

    return {
      id: 'trip-' + Date.now(),
      createdAt: new Date().toISOString(),
      date: this.date,
      purpose: this.purpose,
      notes: this.notes,
      origin: this.origin,
      destinations: JSON.parse(JSON.stringify(this.destinations)),
      returnToOrigin: this.returnToOrigin,
      customReturnKm: this.customReturnKm,
      legs: calc.legs,
      totalKm: calc.totalKm,
      ratePerKm: calc.ratePerKm,
      mileageAmount: calc.mileageAmount,
      estimatedLiters: calc.estimatedLiters,
      fuelCost: calc.fuelCost,
      startOdometer: calc.startOdometer,
      endOdometer: calc.endOdometer,
      vehicleSnapshot: {
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        plate: vehicle.plate,
        fuel: vehicle.fuel,
        engineCc: vehicle.engineCc,
        is4x4: vehicle.is4x4,
        bodyType: vehicle.bodyType,
        category: calc.vehicleClassification.category,
        categoryLabel: calc.vehicleClassification.label,
        categoryNotes: calc.vehicleClassification.notes
      },
      userSnapshot: { ...userProfile }
    };
  }

  loadFromRecord(record) {
    this.origin = record.origin || 'Oficina Central';
    this.destinations = record.destinations && record.destinations.length > 0 
      ? JSON.parse(JSON.stringify(record.destinations))
      : [{ id: 'dest-1', name: 'Destino', distanceKm: 10, purpose: '' }];
    this.returnToOrigin = Boolean(record.returnToOrigin);
    this.customReturnKm = record.customReturnKm !== undefined ? record.customReturnKm : null;
    this.purpose = record.purpose || '';
    this.date = record.date || new Date().toISOString().split('T')[0];
    this.notes = record.notes || '';
    this.startOdometer = record.startOdometer || null;
    this.notify();
  }

  reset() {
    this.origin = 'Oficina Central / San José';
    this.destinations = [
      { id: 'dest-' + Date.now(), name: '', distanceKm: 0, purpose: '' }
    ];
    this.returnToOrigin = true;
    this.customReturnKm = null;
    this.purpose = '';
    this.date = new Date().toISOString().split('T')[0];
    this.notes = '';
    this.startOdometer = null;
    this.notify();
  }

  notify() {
    this.onChange();
  }
}

/* ==========================================================================
   5. FORMATEADORES Y COMPROBANTE OFICIAL (report.js)
   ========================================================================== */
function formatCurrency(amount) {
  const num = Number(amount) || 0;
  return '₡ ' + num.toLocaleString('es-CR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function formatNumber(num, decimals = 2) {
  const val = Number(num) || 0;
  return val.toLocaleString('es-CR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

function generateVoucherHtml(tripRecord) {
  const r = tripRecord;
  const user = r.userSnapshot || {};
  const v = r.vehicleSnapshot || {};
  const dateFormatted = r.date ? new Date(r.date + 'T12:00:00').toLocaleDateString('es-CR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'Sin fecha';

  const rowsHtml = (r.legs || []).map(leg => `
    <tr>
      <td class="text-center font-bold">${leg.index}</td>
      <td><strong>${escapeHtml(leg.from)}</strong> → <strong>${escapeHtml(leg.to)}</strong>${leg.isReturn ? ' <span class="badge-return">(Retorno)</span>' : ''}</td>
      <td>${escapeHtml(leg.purpose || 'Traslado laboral')}</td>
      <td class="text-right font-mono">${formatNumber(leg.distanceKm)} km</td>
    </tr>
  `).join('');

  return `
    <div class="voucher-paper" id="voucher-content">
      <div class="voucher-header">
        <div class="voucher-logo-area">
          <div class="voucher-emblem">₡</div>
          <div>
            <h1 class="voucher-title">LIQUIDACIÓN Y JUSTIFICACIÓN DE KILOMETRAJE</h1>
            <p class="voucher-subtitle">Arrendamiento de Vehículo a Funcionarios • Tarifas Oficiales CGR</p>
          </div>
        </div>
        <div class="voucher-meta">
          <div><strong>Comprobante N°:</strong> ${escapeHtml(r.id.replace('trip-', 'V-'))}</div>
          <div><strong>Fecha de Liquidación:</strong> ${dateFormatted}</div>
          <div><strong>Estado:</strong> <span class="status-tag">Liquidado / Aprobación</span></div>
        </div>
      </div>

      <hr class="voucher-divider" />

      <div class="voucher-grid-2">
        <div class="voucher-box">
          <h2 class="voucher-box-title">1. DATOS DEL FUNCIONARIO SOLICITANTE</h2>
          <table class="voucher-mini-table">
            <tr>
              <th>Nombre Completo:</th>
              <td>${escapeHtml(user.fullName || 'No especificado')}</td>
            </tr>
            <tr>
              <th>Cédula / Identificación:</th>
              <td>${escapeHtml(user.idNumber || 'No especificada')}</td>
            </tr>
            <tr>
              <th>Departamento / Unidad:</th>
              <td>${escapeHtml(user.department || 'Operaciones / Giras')}</td>
            </tr>
            <tr>
              <th>Motivo / Asunto Gira:</th>
              <td><strong>${escapeHtml(r.purpose || 'Gira de trabajo oficial')}</strong></td>
            </tr>
          </table>
        </div>

        <div class="voucher-box">
          <h2 class="voucher-box-title">2. DATOS DEL VEHÍCULO Y CATEGORÍA CGR</h2>
          <table class="voucher-mini-table">
            <tr>
              <th>Vehículo:</th>
              <td><strong>${escapeHtml(v.brand || '')} ${escapeHtml(v.model || '')} (${v.year || ''})</strong></td>
            </tr>
            <tr>
              <th>Placa / Odómetro:</th>
              <td>Placa: <strong>${escapeHtml(v.plate || 'N/A')}</strong> | Odo: ${formatNumber(r.startOdometer, 0)} - ${formatNumber(r.endOdometer, 0)} km</td>
            </tr>
            <tr>
              <th>Categoría Oficial:</th>
              <td><strong class="highlight-cat">${escapeHtml(v.categoryLabel || 'Vehículo')}</strong></td>
            </tr>
            <tr>
              <th>Fundamento CGR:</th>
              <td class="text-xs text-muted">${escapeHtml(v.categoryNotes || 'Tabla oficial CGR')}</td>
            </tr>
          </table>
        </div>
      </div>

      <div class="voucher-section">
        <h2 class="voucher-box-title">3. ITINERARIO Y TRAMOS RECORRIDOS</h2>
        <table class="voucher-legs-table">
          <thead>
            <tr>
              <th style="width: 40px;" class="text-center">#</th>
              <th>Tramo (Origen → Destino)</th>
              <th>Propósito de la Visita</th>
              <th style="width: 120px;" class="text-right">Distancia</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
          <tfoot>
            <tr class="tfoot-total">
              <td colspan="3" class="text-right font-bold">TOTAL DE KILÓMETROS RECORRIDOS:</td>
              <td class="text-right font-mono font-bold">${formatNumber(r.totalKm)} km</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div class="voucher-grid-2 voucher-summary-row">
        <div class="voucher-box fuel-box">
          <h2 class="voucher-box-title">4. CÁLCULO COMPLEMENTARIO DE GASOLINA</h2>
          <p class="voucher-caption">Información referencial estimada de consumo no deducible de la tarifa por km.</p>
          <div class="voucher-stat-row">
            <span>Litros estimados de combustible:</span>
            <strong class="font-mono">${formatNumber(r.estimatedLiters)} L</strong>
          </div>
          <div class="voucher-stat-row">
            <span>Costo aproximado de combustible:</span>
            <strong class="font-mono">${formatCurrency(r.fuelCost)}</strong>
          </div>
        </div>

        <div class="voucher-box settlement-box">
          <h2 class="voucher-box-title">5. RESUMEN DE LIQUIDACIÓN POR KILOMETRAJE</h2>
          <div class="voucher-stat-row">
            <span>Tarifa oficial autorizada (CGR):</span>
            <strong class="font-mono">${formatCurrency(r.ratePerKm)} / km</strong>
          </div>
          <div class="voucher-stat-row">
            <span>Total de kilómetros computados:</span>
            <strong class="font-mono">${formatNumber(r.totalKm)} km</strong>
          </div>
          <div class="voucher-total-banner">
            <span>MONTO TOTAL A LIQUIDAR / REEMBOLSAR:</span>
            <div class="total-big-amount">${formatCurrency(r.mileageAmount)}</div>
          </div>
        </div>
      </div>

      ${r.notes ? `
        <div class="voucher-box" style="margin-top: 12px;">
          <h2 class="voucher-box-title">OBSERVACIONES O JUSTIFICACIÓN ADICIONAL</h2>
          <p style="font-size: 13px; color: #475569; margin: 0;">${escapeHtml(r.notes)}</p>
        </div>
      ` : ''}

      <div class="voucher-signatures">
        <div class="signature-line">
          <div class="sign-space"></div>
          <div class="sign-label">Firma del Funcionario Solicitante</div>
          <div class="sign-sub">${escapeHtml(user.fullName || 'Funcionario')}</div>
          <div class="sign-sub">Cédula: ${escapeHtml(user.idNumber || '_________________')}</div>
        </div>

        <div class="signature-line">
          <div class="sign-space"></div>
          <div class="sign-label">Firma y Sello de Jefatura Inmediata</div>
          <div class="sign-sub">Aprobador Autorizado</div>
          <div class="sign-sub">Fecha de Aprobación: _____ / _____ / 202___</div>
        </div>
      </div>

      <div class="voucher-footer-note">
        Documento generado automáticamente para justificación laboral de acuerdo a la tabla de tarifas de arrendamiento de vehículos a funcionarios publicada por la Contraloría General de la República de Costa Rica.
      </div>
    </div>
  `;
}

function exportTripsToCsv(trips) {
  if (!trips || trips.length === 0) {
    alert('No hay viajes en el historial para exportar.');
    return;
  }

  const headers = [
    'ID', 'Fecha', 'Propósito', 'Origen', 'Destinos', 'Total KM',
    'Vehículo', 'Categoría CGR', 'Tarifa por KM (CRC)', 'Total Kilometraje (CRC)',
    'Litros Gasolina', 'Costo Gasolina (CRC)'
  ];

  const rows = trips.map(t => {
    const destStr = (t.destinations || []).map(d => d.name).join(' | ');
    const vStr = t.vehicleSnapshot ? `${t.vehicleSnapshot.brand} ${t.vehicleSnapshot.model} ${t.vehicleSnapshot.year}` : '';
    const catStr = t.vehicleSnapshot ? t.vehicleSnapshot.categoryLabel : '';
    return [
      t.id,
      t.date,
      `"${(t.purpose || '').replace(/"/g, '""')}"`,
      `"${(t.origin || '').replace(/"/g, '""')}"`,
      `"${destStr.replace(/"/g, '""')}"`,
      t.totalKm,
      `"${vStr.replace(/"/g, '""')}"`,
      `"${catStr.replace(/"/g, '""')}"`,
      t.ratePerKm,
      t.mileageAmount,
      t.estimatedLiters,
      t.fuelCost
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `viajes-kilometraje-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function exportTripsToJson(trips) {
  const blob = new Blob([JSON.stringify(trips, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `viajes-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ==========================================================================
   6. CONTROLADOR DE LA APLICACIÓN (App)
   ========================================================================== */
class App {
  constructor() {
    this.vehicleManager = new VehicleManager(() => this.onVehicleChanged());
    this.tripManager = new TripManager(this.vehicleManager, () => this.onTripChanged());
    this.activeTab = 'calculator';
    this.deferredInstallPrompt = null;
    this.currentViewingTrip = null;

    this.initTheme();
    this.initDomElements();
    this.bindEvents();
    this.loadVehicleForm();
    this.loadDraftOrInitialTrip();
    this.renderCgrTable();
    this.renderHistory();
    this.updateAllUi();
    this.initPwaInstall();
  }

  initTheme() {
    const savedTheme = localStorage.getItem('cgr_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('cgr_theme', next);
    this.dom.themeIcon.textContent = next === 'dark' ? '☀️' : '🌙';
    this.showToast(`Modo ${next === 'dark' ? 'oscuro' : 'claro'} activado`);
  }

  initDomElements() {
    this.dom = {
      themeToggleBtn: document.getElementById('theme-toggle-btn'),
      themeIcon: document.getElementById('theme-icon'),
      installBtn: document.getElementById('install-btn'),
      bannerInstallBtn: document.getElementById('banner-install-btn'),
      pwaBanner: document.getElementById('pwa-install-banner'),
      quickVehiclePill: document.getElementById('quick-vehicle-pill'),

      barVehicleName: document.getElementById('bar-vehicle-name'),
      barVehicleCat: document.getElementById('bar-vehicle-cat'),
      barVehicleRate: document.getElementById('bar-vehicle-rate'),

      kpiMileageAmount: document.getElementById('kpi-mileage-amount'),
      kpiTotalKm: document.getElementById('kpi-total-km'),
      kpiRateKm: document.getElementById('kpi-rate-km'),
      kpiRateAge: document.getElementById('kpi-rate-age'),
      kpiFuelLiters: document.getElementById('kpi-fuel-liters'),
      kpiFuelEfficiency: document.getElementById('kpi-fuel-efficiency'),
      kpiFuelCost: document.getElementById('kpi-fuel-cost'),
      kpiLegsCount: document.getElementById('kpi-legs-count'),

      tripDate: document.getElementById('trip-date'),
      tripPurpose: document.getElementById('trip-purpose'),
      tripOrigin: document.getElementById('trip-origin'),
      tripStartOdo: document.getElementById('trip-start-odo'),
      destinationsContainer: document.getElementById('destinations-container'),
      addDestinationBtn: document.getElementById('add-destination-btn'),
      returnToggle: document.getElementById('return-toggle'),
      returnToggleWrapper: document.getElementById('return-toggle-wrapper'),
      customReturnKm: document.getElementById('custom-return-km'),
      itineraryBreakdown: document.getElementById('itinerary-breakdown'),
      itineraryTotalBadge: document.getElementById('itinerary-total-badge'),

      saveTripBtn: document.getElementById('save-trip-btn'),
      viewVoucherBtn: document.getElementById('view-voucher-btn'),
      clearTripBtn: document.getElementById('clear-trip-btn'),

      vBrand: document.getElementById('v-brand'),
      vModel: document.getElementById('v-model'),
      vPlate: document.getElementById('v-plate'),
      vYear: document.getElementById('v-year'),
      vBody: document.getElementById('v-body'),
      vFuel: document.getElementById('v-fuel'),
      vCc: document.getElementById('v-cc'),
      vOdo: document.getElementById('v-odo'),
      v4x4: document.getElementById('v-4x4'),
      vManualOverride: document.getElementById('v-manual-override'),
      vAlertCategory: document.getElementById('v-alert-category'),
      vAlertRate: document.getElementById('v-alert-rate'),
      vAlertNotes: document.getElementById('v-alert-notes'),
      saveVehicleBtn: document.getElementById('save-vehicle-btn'),

      fuelType: document.getElementById('fuel-type'),
      fuelPrice: document.getElementById('fuel-price'),
      fuelEfficiency: document.getElementById('fuel-efficiency'),

      userName: document.getElementById('user-name'),
      userId: document.getElementById('user-id'),
      userDept: document.getElementById('user-dept'),
      userPosition: document.getElementById('user-position'),

      historySearch: document.getElementById('history-search'),
      historyTotalCount: document.getElementById('history-total-count'),
      histSumKm: document.getElementById('hist-sum-km'),
      histSumAmount: document.getElementById('hist-sum-amount'),
      historyListContainer: document.getElementById('history-list-container'),
      exportCsvBtn: document.getElementById('export-csv-btn'),
      exportJsonBtn: document.getElementById('export-json-btn'),

      cgrTableBody: document.getElementById('cgr-table-body'),

      voucherModal: document.getElementById('voucher-modal'),
      closeVoucherModal: document.getElementById('close-voucher-modal'),
      modalCloseBtn: document.getElementById('modal-close-btn'),
      modalPrintBtn: document.getElementById('modal-print-btn'),
      printArea: document.getElementById('print-area'),

      toastContainer: document.getElementById('toast-container'),

      navButtons: document.querySelectorAll('[data-tab]'),
      views: {
        calculator: document.getElementById('view-calculator'),
        vehicle: document.getElementById('view-vehicle'),
        history: document.getElementById('view-history'),
        rates: document.getElementById('view-rates')
      }
    };

    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    this.dom.themeIcon.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
  }

  bindEvents() {
    this.dom.themeToggleBtn.addEventListener('click', () => this.toggleTheme());

    this.dom.navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        if (tab) this.switchTab(tab);
      });
    });

    this.dom.quickVehiclePill.addEventListener('click', () => {
      this.switchTab('vehicle');
    });

    this.dom.tripDate.addEventListener('change', (e) => this.tripManager.setDate(e.target.value));
    this.dom.tripPurpose.addEventListener('input', (e) => this.tripManager.setPurpose(e.target.value));
    this.dom.tripOrigin.addEventListener('input', (e) => this.tripManager.setOrigin(e.target.value));
    this.dom.tripStartOdo.addEventListener('input', (e) => this.tripManager.setStartOdometer(e.target.value));

    this.dom.addDestinationBtn.addEventListener('click', () => {
      this.tripManager.addDestination('', 0, '');
      this.renderDestinations();
      this.showToast('Nuevo destino agregado');
    });

    this.dom.returnToggle.addEventListener('change', (e) => {
      this.tripManager.setReturnToOrigin(e.target.checked);
    });

    this.dom.customReturnKm.addEventListener('input', (e) => {
      this.tripManager.setCustomReturnKm(e.target.value);
    });

    this.dom.saveTripBtn.addEventListener('click', () => this.saveCurrentTrip());
    this.dom.viewVoucherBtn.addEventListener('click', () => this.openVoucherModalForCurrentTrip());
    this.dom.clearTripBtn.addEventListener('click', () => {
      if (confirm('¿Deseas restablecer los destinos y comenzar un nuevo viaje?')) {
        this.tripManager.reset();
        this.loadTripIntoForm();
        this.showToast('Formulario restablecido para nuevo viaje');
      }
    });

    const vehicleInputs = [
      this.dom.vBrand, this.dom.vModel, this.dom.vPlate, this.dom.vYear,
      this.dom.vBody, this.dom.vFuel, this.dom.vCc, this.dom.vOdo,
      this.dom.v4x4, this.dom.vManualOverride
    ];
    vehicleInputs.forEach(input => {
      input.addEventListener('input', () => this.onVehicleFormInput());
      input.addEventListener('change', () => this.onVehicleFormInput());
    });

    this.dom.saveVehicleBtn.addEventListener('click', () => {
      this.saveVehicleFromForm();
      this.showToast('Configuración del vehículo guardada exitosamente');
    });

    const fuelInputs = [this.dom.fuelType, this.dom.fuelPrice, this.dom.fuelEfficiency];
    fuelInputs.forEach(input => {
      input.addEventListener('change', () => this.saveFuelFromForm());
      input.addEventListener('input', () => this.saveFuelFromForm());
    });

    const userInputs = [this.dom.userName, this.dom.userId, this.dom.userDept, this.dom.userPosition];
    userInputs.forEach(input => {
      input.addEventListener('input', () => this.saveUserProfileFromForm());
    });

    this.dom.historySearch.addEventListener('input', () => this.renderHistory());
    this.dom.exportCsvBtn.addEventListener('click', () => exportTripsToCsv(Storage.getTrips()));
    this.dom.exportJsonBtn.addEventListener('click', () => exportTripsToJson(Storage.getTrips()));

    this.dom.closeVoucherModal.addEventListener('click', () => this.closeVoucherModal());
    this.dom.modalCloseBtn.addEventListener('click', () => this.closeVoucherModal());
    this.dom.modalPrintBtn.addEventListener('click', () => window.print());
    this.dom.voucherModal.addEventListener('click', (e) => {
      if (e.target === this.dom.voucherModal) this.closeVoucherModal();
    });
  }

  switchTab(tabId) {
    this.activeTab = tabId;

    Object.keys(this.dom.views).forEach(key => {
      if (this.dom.views[key]) {
        this.dom.views[key].classList.toggle('active', key === tabId);
      }
    });

    this.dom.navButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });

    if (tabId === 'history') {
      this.renderHistory();
    } else if (tabId === 'rates') {
      this.renderCgrTable();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  loadVehicleForm() {
    const v = this.vehicleManager.getVehicle();
    this.dom.vBrand.value = v.brand || '';
    this.dom.vModel.value = v.model || '';
    this.dom.vPlate.value = v.plate || '';
    this.dom.vYear.value = v.year || BASE_YEAR;
    this.dom.vBody.value = v.bodyType || 'sedan';
    this.dom.vFuel.value = v.fuel || 'gasolina';
    this.dom.vCc.value = v.engineCc || 1600;
    this.dom.vOdo.value = v.currentOdometer || '';
    this.dom.v4x4.checked = Boolean(v.is4x4);
    this.dom.vManualOverride.value = v.manualCategoryOverride || '';

    const fuel = this.vehicleManager.getFuelConfig();
    this.dom.fuelType.value = fuel.fuelType || 'Gasolina Súper';
    this.dom.fuelPrice.value = fuel.pricePerLiter || 690;
    this.dom.fuelEfficiency.value = fuel.kmPerLiter || 13.5;

    const user = this.vehicleManager.getUserProfile();
    this.dom.userName.value = user.fullName || '';
    this.dom.userId.value = user.idNumber || '';
    this.dom.userDept.value = user.department || '';
    this.dom.userPosition.value = user.position || '';

    this.updateVehiclePreviewCard();
  }

  onVehicleFormInput() {
    this.saveVehicleFromForm();
    this.updateVehiclePreviewCard();
    this.updateAllUi();
  }

  saveVehicleFromForm() {
    const updated = {
      brand: this.dom.vBrand.value.trim(),
      model: this.dom.vModel.value.trim(),
      plate: this.dom.vPlate.value.trim().toUpperCase(),
      year: parseInt(this.dom.vYear.value, 10) || BASE_YEAR,
      bodyType: this.dom.vBody.value,
      fuel: this.dom.vFuel.value,
      engineCc: parseFloat(this.dom.vCc.value) || 0,
      currentOdometer: parseFloat(this.dom.vOdo.value) || 0,
      is4x4: this.dom.v4x4.checked,
      manualCategoryOverride: this.dom.vManualOverride.value
    };
    this.vehicleManager.updateVehicle(updated);
  }

  saveFuelFromForm() {
    const updated = {
      fuelType: this.dom.fuelType.value,
      pricePerLiter: parseFloat(this.dom.fuelPrice.value) || 0,
      kmPerLiter: parseFloat(this.dom.fuelEfficiency.value) || 12
    };
    this.vehicleManager.updateFuelConfig(updated);
  }

  saveUserProfileFromForm() {
    const updated = {
      fullName: this.dom.userName.value.trim(),
      idNumber: this.dom.userId.value.trim(),
      department: this.dom.userDept.value.trim(),
      position: this.dom.userPosition.value.trim()
    };
    this.vehicleManager.updateUserProfile(updated);
  }

  updateVehiclePreviewCard() {
    const classification = this.vehicleManager.getActiveClassification();
    this.dom.vAlertCategory.textContent = classification.label;
    this.dom.vAlertRate.textContent = formatCurrency(classification.rate) + ' / km';
    this.dom.vAlertNotes.textContent = classification.notes;
  }

  loadDraftOrInitialTrip() {
    const draft = Storage.getCurrentDraft();
    if (draft && draft.destinations && draft.destinations.length > 0) {
      this.tripManager.loadFromRecord(draft);
    }
    this.loadTripIntoForm();
  }

  loadTripIntoForm() {
    this.dom.tripDate.value = this.tripManager.date;
    this.dom.tripPurpose.value = this.tripManager.purpose;
    this.dom.tripOrigin.value = this.tripManager.origin;
    this.dom.tripStartOdo.value = this.tripManager.startOdometer !== null 
      ? this.tripManager.startOdometer 
      : (this.vehicleManager.getVehicle().currentOdometer || '');
    this.dom.returnToggle.checked = this.tripManager.returnToOrigin;
    this.dom.customReturnKm.value = this.tripManager.customReturnKm !== null ? this.tripManager.customReturnKm : '';

    this.renderDestinations();
    this.updateAllUi();
  }

  renderDestinations() {
    const container = this.dom.destinationsContainer;
    container.innerHTML = '';

    const list = this.tripManager.destinations;

    list.forEach((dest, index) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'dest-item';
      itemEl.innerHTML = `
        <div class="dest-item-header">
          <span class="dest-badge">Destino ${index + 1}</span>
          <div class="dest-actions">
            <button type="button" class="dest-action-btn" title="Subir orden" data-action="up" data-id="${dest.id}" ${index === 0 ? 'disabled style="opacity:0.3"' : ''}>
              ▲
            </button>
            <button type="button" class="dest-action-btn" title="Bajar orden" data-action="down" data-id="${dest.id}" ${index === list.length - 1 ? 'disabled style="opacity:0.3"' : ''}>
              ▼
            </button>
            <button type="button" class="dest-action-btn delete-btn" title="Eliminar destino" data-action="delete" data-id="${dest.id}">
              ✕
            </button>
          </div>
        </div>
        <div class="dest-inputs">
          <div>
            <input type="text" class="form-input dest-name-input" data-id="${dest.id}" placeholder="Nombre del destino o sucursal" value="${escapeHtml(dest.name)}">
          </div>
          <div>
            <div class="form-input-addon">
              <input type="number" class="form-input dest-km-input" data-id="${dest.id}" placeholder="KM" value="${dest.distanceKm || ''}" step="0.1" min="0">
              <span class="input-addon-text">km</span>
            </div>
          </div>
        </div>
        <div>
          <input type="text" class="form-input dest-purpose-input" data-id="${dest.id}" placeholder="Motivo específico en este destino (opcional)" value="${escapeHtml(dest.purpose || '')}">
        </div>
      `;

      const nameInput = itemEl.querySelector('.dest-name-input');
      const kmInput = itemEl.querySelector('.dest-km-input');
      const purposeInput = itemEl.querySelector('.dest-purpose-input');

      nameInput.addEventListener('input', (e) => {
        this.tripManager.updateDestination(dest.id, { name: e.target.value });
      });

      kmInput.addEventListener('input', (e) => {
        this.tripManager.updateDestination(dest.id, { distanceKm: parseFloat(e.target.value) || 0 });
      });

      purposeInput.addEventListener('input', (e) => {
        this.tripManager.updateDestination(dest.id, { purpose: e.target.value });
      });

      const btnUp = itemEl.querySelector('[data-action="up"]');
      const btnDown = itemEl.querySelector('[data-action="down"]');
      const btnDelete = itemEl.querySelector('[data-action="delete"]');

      if (btnUp) btnUp.addEventListener('click', () => {
        this.tripManager.moveDestination(dest.id, 'up');
        this.renderDestinations();
      });

      if (btnDown) btnDown.addEventListener('click', () => {
        this.tripManager.moveDestination(dest.id, 'down');
        this.renderDestinations();
      });

      if (btnDelete) btnDelete.addEventListener('click', () => {
        this.tripManager.removeDestination(dest.id);
        this.renderDestinations();
      });

      container.appendChild(itemEl);
    });
  }

  updateAllUi() {
    const calc = this.tripManager.calculate();
    const v = this.vehicleManager.getVehicle();
    const classification = calc.vehicleClassification;

    this.dom.barVehicleName.textContent = `${v.brand || 'Vehículo'} ${v.model || ''} (${v.year || BASE_YEAR})`;
    this.dom.barVehicleCat.textContent = classification.label;
    this.dom.barVehicleRate.textContent = formatCurrency(classification.rate) + ' / km';

    this.dom.kpiMileageAmount.textContent = formatCurrency(calc.mileageAmount);
    this.dom.kpiTotalKm.textContent = formatNumber(calc.totalKm) + ' km';
    this.dom.kpiRateKm.textContent = formatCurrency(calc.ratePerKm);
    this.dom.kpiRateAge.textContent = `Antigüedad: ${classification.age} años`;
    this.dom.kpiFuelLiters.textContent = formatNumber(calc.estimatedLiters) + ' L';
    this.dom.kpiFuelEfficiency.textContent = `Rend: ${calc.kmPerLiter} km/L (${calc.fuelType})`;
    this.dom.kpiFuelCost.textContent = formatCurrency(calc.fuelCost);
    this.dom.kpiLegsCount.textContent = `${calc.legs.length} tramo(s) computados`;

    this.renderItineraryBreakdown(calc.legs, calc.totalKm);

    Storage.saveCurrentDraft(this.tripManager.createTripRecord());
  }

  renderItineraryBreakdown(legs, totalKm) {
    const container = this.dom.itineraryBreakdown;
    container.innerHTML = '';
    this.dom.itineraryTotalBadge.textContent = `${formatNumber(totalKm)} km totales`;

    if (!legs || legs.length === 0) {
      container.innerHTML = `<div style="text-align: center; color: var(--text-muted); font-size: 13px; padding: 12px;">No se han agregado tramos aún.</div>`;
      return;
    }

    legs.forEach(leg => {
      const row = document.createElement('div');
      row.className = 'itinerary-row';
      row.innerHTML = `
        <div class="itinerary-leg-name">
          <span style="font-weight: 700; color: var(--text-secondary);">#${leg.index}</span>
          <span><strong>${escapeHtml(leg.from)}</strong> → <strong>${escapeHtml(leg.to)}</strong>${leg.isReturn ? ' <span class="badge-return">(Retorno)</span>' : ''}</span>
        </div>
        <div class="itinerary-leg-km">${formatNumber(leg.distanceKm)} km</div>
      `;
      container.appendChild(row);
    });
  }

  onVehicleChanged() {
    this.updateVehiclePreviewCard();
    this.updateAllUi();
  }

  onTripChanged() {
    this.updateAllUi();
  }

  saveCurrentTrip() {
    const calc = this.tripManager.calculate();
    if (calc.totalKm <= 0) {
      alert('Por favor especifica al menos un tramo con distancia en kilómetros para guardar el viaje.');
      return;
    }

    const record = this.tripManager.createTripRecord();
    Storage.saveTrip(record);
    Storage.clearCurrentDraft();

    this.showToast('✅ Viaje guardado correctamente en el historial');
    this.renderHistory();

    if (record.endOdometer) {
      this.vehicleManager.updateVehicle({ currentOdometer: Math.round(record.endOdometer) });
      this.dom.vOdo.value = Math.round(record.endOdometer);
    }
  }

  renderHistory() {
    const container = this.dom.historyListContainer;
    container.innerHTML = '';

    const trips = Storage.getTrips();
    const query = (this.dom.historySearch.value || '').toLowerCase().trim();

    const filtered = trips.filter(t => {
      if (!query) return true;
      const haystack = [
        t.date, t.purpose, t.origin,
        ...(t.destinations || []).map(d => d.name),
        t.vehicleSnapshot?.brand, t.vehicleSnapshot?.model
      ].join(' ').toLowerCase();
      return haystack.includes(query);
    });

    this.dom.historyTotalCount.textContent = `${trips.length} viaje(s)`;

    const totalKm = trips.reduce((sum, t) => sum + (t.totalKm || 0), 0);
    const totalAmount = trips.reduce((sum, t) => sum + (t.mileageAmount || 0), 0);
    this.dom.histSumKm.textContent = formatNumber(totalKm) + ' km';
    this.dom.histSumAmount.textContent = formatCurrency(totalAmount);

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); padding: 30px 10px; font-size: 14px;">
          ${query ? 'No se encontraron viajes con ese criterio.' : 'Aún no tienes viajes guardados. Completa un viaje en la calculadora y presiona "Guardar Viaje en Historial".'}
        </div>
      `;
      return;
    }

    filtered.forEach(trip => {
      const itemEl = document.createElement('div');
      itemEl.className = 'history-item';

      const destSummary = (trip.destinations || []).map(d => d.name || 'Destino').join(' → ');
      const v = trip.vehicleSnapshot || {};

      itemEl.innerHTML = `
        <div class="history-item-top">
          <div>
            <div class="history-date">📅 ${trip.date || 'Sin fecha'} • ${v.brand || ''} ${v.model || ''}</div>
            <div class="history-purpose">${escapeHtml(trip.purpose || 'Gira de trabajo')}</div>
          </div>
          <div class="rate-badge" style="font-size: 12px;">${formatCurrency(trip.ratePerKm)}/km</div>
        </div>
        <div class="history-route">
          📍 <strong>${escapeHtml(trip.origin || 'Origen')}</strong> → ${escapeHtml(destSummary)}${trip.returnToOrigin ? ' 🔄' : ''}
        </div>
        <div class="history-metrics">
          <div>
            <span>Distancia: <strong>${formatNumber(trip.totalKm)} km</strong></span>
            <span style="margin-left: 10px; color: var(--text-muted); font-size: 11px;">(Gasolina: ${formatCurrency(trip.fuelCost)})</span>
          </div>
          <div class="history-amount">${formatCurrency(trip.mileageAmount)}</div>
        </div>
        <div class="history-actions">
          <button class="btn btn-outline history-btn" data-action="view" data-id="${trip.id}">
            📄 Justificación
          </button>
          <button class="btn btn-secondary history-btn" data-action="load" data-id="${trip.id}">
            ✏️ Cargar
          </button>
          <button class="btn btn-ghost history-btn" style="color: var(--accent-danger);" data-action="delete" data-id="${trip.id}">
            🗑️ Eliminar
          </button>
        </div>
      `;

      itemEl.querySelector('[data-action="view"]').addEventListener('click', () => {
        this.openVoucherModal(trip);
      });

      itemEl.querySelector('[data-action="load"]').addEventListener('click', () => {
        if (confirm('¿Cargar este viaje en la calculadora para editar o reutilizar?')) {
          this.tripManager.loadFromRecord(trip);
          this.loadTripIntoForm();
          this.switchTab('calculator');
          this.showToast('Viaje cargado en la calculadora');
        }
      });

      itemEl.querySelector('[data-action="delete"]').addEventListener('click', () => {
        if (confirm('¿Seguro que deseas eliminar este viaje del historial?')) {
          Storage.deleteTrip(trip.id);
          this.renderHistory();
          this.showToast('Viaje eliminado');
        }
      });

      container.appendChild(itemEl);
    });
  }

  renderCgrTable() {
    const tbody = this.dom.cgrTableBody;
    tbody.innerHTML = '';

    const currentClassification = this.vehicleManager.getActiveClassification();
    const currentAge = currentClassification.age;
    const currentCat = currentClassification.category;

    RATES_MATRIX.forEach(row => {
      const tr = document.createElement('tr');
      if (row.age === currentAge) {
        tr.className = 'highlight-row';
      }

      const isCurrentCat = (cat) => (row.age === currentAge && currentCat === cat);

      tr.innerHTML = `
        <td style="text-align: center; font-weight: 700;">${row.age === 10 ? '10 y más' : row.age + ' año' + (row.age === 1 ? '' : 's')}</td>
        <td style="text-align: center; color: var(--text-muted);">${row.modelYear}${row.age === 10 ? ' o ant.' : ''}</td>
        <td class="${isCurrentCat(CATEGORIES.RURAL_GASOLINA) ? 'highlight-cell' : ''}">${formatNumber(row[CATEGORIES.RURAL_GASOLINA])}</td>
        <td class="${isCurrentCat(CATEGORIES.RURAL_DIESEL) ? 'highlight-cell' : ''}">${formatNumber(row[CATEGORIES.RURAL_DIESEL])}</td>
        <td class="${isCurrentCat(CATEGORIES.LIVIANO_GASOLINA_A) ? 'highlight-cell' : ''}">${formatNumber(row[CATEGORIES.LIVIANO_GASOLINA_A])}</td>
        <td class="${isCurrentCat(CATEGORIES.LIVIANO_GASOLINA_B) ? 'highlight-cell' : ''}">${formatNumber(row[CATEGORIES.LIVIANO_GASOLINA_B])}</td>
        <td class="${isCurrentCat(CATEGORIES.LIVIANO_DIESEL) ? 'highlight-cell' : ''}">${formatNumber(row[CATEGORIES.LIVIANO_DIESEL])}</td>
        <td class="${isCurrentCat(CATEGORIES.MOTO_GASOLINA) ? 'highlight-cell' : ''}">${formatNumber(row[CATEGORIES.MOTO_GASOLINA])}</td>
        <td class="${isCurrentCat(CATEGORIES.MOTO_ELECTRICA) ? 'highlight-cell' : ''}">${formatNumber(row[CATEGORIES.MOTO_ELECTRICA])}</td>
        <td class="${isCurrentCat(CATEGORIES.HIBRIDO) ? 'highlight-cell' : ''}">${formatNumber(row[CATEGORIES.HIBRIDO])}</td>
        <td class="${isCurrentCat(CATEGORIES.ELECTRICO) ? 'highlight-cell' : ''}">${formatNumber(row[CATEGORIES.ELECTRICO])}</td>
      `;

      tbody.appendChild(tr);
    });
  }

  openVoucherModalForCurrentTrip() {
    const record = this.tripManager.createTripRecord();
    this.openVoucherModal(record);
  }

  openVoucherModal(record) {
    this.currentViewingTrip = record;
    this.dom.printArea.innerHTML = generateVoucherHtml(record);
    this.dom.voucherModal.classList.add('active');
  }

  closeVoucherModal() {
    this.dom.voucherModal.classList.remove('active');
  }

  initPwaInstall() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredInstallPrompt = e;
      this.dom.installBtn.style.display = 'inline-flex';
      this.dom.pwaBanner.style.display = 'flex';
    });

    const triggerInstall = async () => {
      if (!this.deferredInstallPrompt) return;
      this.deferredInstallPrompt.prompt();
      const choice = await this.deferredInstallPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        this.showToast('¡Gracias por instalar Kilometraje CGR!');
      }
      this.deferredInstallPrompt = null;
      this.dom.installBtn.style.display = 'none';
      this.dom.pwaBanner.style.display = 'none';
    };

    this.dom.installBtn.addEventListener('click', triggerInstall);
    this.dom.bannerInstallBtn.addEventListener('click', triggerInstall);

    window.addEventListener('appinstalled', () => {
      this.showToast('Aplicación instalada en tu dispositivo');
      this.dom.installBtn.style.display = 'none';
      this.dom.pwaBanner.style.display = 'none';
    });
  }

  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>🔔</span> <span>${escapeHtml(message)}</span>`;
    this.dom.toastContainer.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 3000);
  }
}

// Inicializar al cargar el DOM
window.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
