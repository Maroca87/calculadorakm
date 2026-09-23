/**
 * storage.js - Manejo de almacenamiento local (localStorage) para vehículos, configuración y viajes.
 * Simplificado para requerir únicamente los datos que alimentan la tabla CGR y el cálculo.
 */

const KEYS = {
  VEHICLES: 'cgr_pwa_vehicles_list',
  ACTIVE_VEHICLE_ID: 'cgr_pwa_active_vehicle_id',
  FUEL_CONFIG: 'cgr_pwa_fuel_config',
  CURRENT_TRIP: 'cgr_pwa_current_trip'
};

export const DEFAULT_VEHICLES = [
  {
    id: 'veh-1',
    brand: 'Toyota',
    model: 'Corolla',
    year: 2022,
    engineCc: 1800,
    fuel: 'gasolina',        // 'gasolina', 'diesel', 'hibrido', 'electrico'
    bodyType: 'sedan',      // 'sedan', 'rural_pickup', 'moto'
    is4x4: false
  },
  {
    id: 'veh-2',
    brand: 'Toyota',
    model: 'Hilux 4x4',
    year: 2021,
    engineCc: 2800,
    fuel: 'diesel',
    bodyType: 'rural_pickup',
    is4x4: true
  },
  {
    id: 'veh-3',
    brand: 'BYD',
    model: 'Yuan Plus',
    year: 2024,
    engineCc: 0,
    fuel: 'electrico',
    bodyType: 'sedan',
    is4x4: false
  }
];

export const DEFAULT_FUEL_CONFIG = {
  kmPerLiter: 13.5,        // km/L
  pricePerLiter: 690       // ₡/L
};

export const Storage = {
  getVehicles() {
    try {
      const data = localStorage.getItem(KEYS.VEHICLES);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      this.saveVehicles(DEFAULT_VEHICLES);
      return DEFAULT_VEHICLES;
    } catch (e) {
      return DEFAULT_VEHICLES;
    }
  },

  saveVehicles(vehicles) {
    try {
      localStorage.setItem(KEYS.VEHICLES, JSON.stringify(vehicles));
    } catch (e) {
      console.error('Error saving vehicles list', e);
    }
  },

  getActiveVehicleId() {
    try {
      return localStorage.getItem(KEYS.ACTIVE_VEHICLE_ID) || 'veh-1';
    } catch (e) {
      return 'veh-1';
    }
  },

  setActiveVehicleId(id) {
    try {
      localStorage.setItem(KEYS.ACTIVE_VEHICLE_ID, id);
    } catch (e) {}
  },

  getActiveVehicle() {
    const list = this.getVehicles();
    const activeId = this.getActiveVehicleId();
    return list.find(v => v.id === activeId) || list[0] || DEFAULT_VEHICLES[0];
  },

  saveOrUpdateVehicle(vehicle) {
    const list = this.getVehicles();
    const idx = list.findIndex(v => v.id === vehicle.id);
    if (idx >= 0) {
      list[idx] = vehicle;
    } else {
      list.push(vehicle);
    }
    this.saveVehicles(list);
    this.setActiveVehicleId(vehicle.id);
  },

  deleteVehicle(id) {
    const list = this.getVehicles().filter(v => v.id !== id);
    if (list.length === 0) {
      list.push({ ...DEFAULT_VEHICLES[0], id: 'veh-' + Date.now() });
    }
    this.saveVehicles(list);
    if (this.getActiveVehicleId() === id) {
      this.setActiveVehicleId(list[0].id);
    }
    return list;
  },

  getFuelConfig() {
    try {
      const data = localStorage.getItem(KEYS.FUEL_CONFIG);
      return data ? { ...DEFAULT_FUEL_CONFIG, ...JSON.parse(data) } : { ...DEFAULT_FUEL_CONFIG };
    } catch (e) {
      return { ...DEFAULT_FUEL_CONFIG };
    }
  },

  saveFuelConfig(config) {
    try {
      localStorage.setItem(KEYS.FUEL_CONFIG, JSON.stringify(config));
    } catch (e) {}
  },

  getCurrentTrip() {
    try {
      const data = localStorage.getItem(KEYS.CURRENT_TRIP);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  saveCurrentTrip(trip) {
    try {
      localStorage.setItem(KEYS.CURRENT_TRIP, JSON.stringify(trip));
    } catch (e) {}
  }
};
