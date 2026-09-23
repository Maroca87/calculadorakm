/**
 * storage.js - Manejo de almacenamiento local (localStorage) para vehículos, viajes y preferencias.
 */

const KEYS = {
  VEHICLE: 'cgr_pwa_vehicle',
  FUEL_CONFIG: 'cgr_pwa_fuel_config',
  USER_PROFILE: 'cgr_pwa_user_profile',
  TRIPS: 'cgr_pwa_trips',
  CURRENT_DRAFT: 'cgr_pwa_current_draft'
};

export const DEFAULT_VEHICLE = {
  brand: 'Toyota',
  model: 'Corolla',
  plate: '',
  year: 2022,
  bodyType: 'sedan',      // 'sedan', 'rural_pickup', 'moto'
  fuel: 'gasolina',        // 'gasolina', 'diesel', 'hibrido', 'electrico'
  engineCc: 1800,          // cc
  is4x4: false,            // boolean
  currentOdometer: 65400,
  manualCategoryOverride: '' // Si el usuario desea forzar una categoría específica
};

export const DEFAULT_FUEL_CONFIG = {
  fuelType: 'Gasolina Súper',
  pricePerLiter: 690,      // Colones por litro
  kmPerLiter: 13.5          // km/L
};

export const DEFAULT_USER_PROFILE = {
  fullName: '',
  idNumber: '',
  department: '',
  position: '',
  institution: ''
};

export const Storage = {
  getVehicle() {
    try {
      const data = localStorage.getItem(KEYS.VEHICLE);
      return data ? { ...DEFAULT_VEHICLE, ...JSON.parse(data) } : { ...DEFAULT_VEHICLE };
    } catch (e) {
      console.error('Error reading vehicle from storage', e);
      return { ...DEFAULT_VEHICLE };
    }
  },

  saveVehicle(vehicle) {
    try {
      localStorage.setItem(KEYS.VEHICLE, JSON.stringify(vehicle));
    } catch (e) {
      console.error('Error saving vehicle to storage', e);
    }
  },

  getFuelConfig() {
    try {
      const data = localStorage.getItem(KEYS.FUEL_CONFIG);
      return data ? { ...DEFAULT_FUEL_CONFIG, ...JSON.parse(data) } : { ...DEFAULT_FUEL_CONFIG };
    } catch (e) {
      console.error('Error reading fuel config from storage', e);
      return { ...DEFAULT_FUEL_CONFIG };
    }
  },

  saveFuelConfig(config) {
    try {
      localStorage.setItem(KEYS.FUEL_CONFIG, JSON.stringify(config));
    } catch (e) {
      console.error('Error saving fuel config to storage', e);
    }
  },

  getUserProfile() {
    try {
      const data = localStorage.getItem(KEYS.USER_PROFILE);
      return data ? { ...DEFAULT_USER_PROFILE, ...JSON.parse(data) } : { ...DEFAULT_USER_PROFILE };
    } catch (e) {
      console.error('Error reading user profile from storage', e);
      return { ...DEFAULT_USER_PROFILE };
    }
  },

  saveUserProfile(profile) {
    try {
      localStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Error saving user profile to storage', e);
    }
  },

  getTrips() {
    try {
      const data = localStorage.getItem(KEYS.TRIPS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading trips from storage', e);
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
        trips.unshift(trip); // El más reciente primero
      }
      localStorage.setItem(KEYS.TRIPS, JSON.stringify(trips));
      return trips;
    } catch (e) {
      console.error('Error saving trip to storage', e);
      return [];
    }
  },

  deleteTrip(tripId) {
    try {
      const trips = this.getTrips().filter(t => t.id !== tripId);
      localStorage.setItem(KEYS.TRIPS, JSON.stringify(trips));
      return trips;
    } catch (e) {
      console.error('Error deleting trip from storage', e);
      return [];
    }
  },

  getCurrentDraft() {
    try {
      const data = localStorage.getItem(KEYS.CURRENT_DRAFT);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  saveCurrentDraft(draft) {
    try {
      localStorage.setItem(KEYS.CURRENT_DRAFT, JSON.stringify(draft));
    } catch (e) {
      console.error('Error saving draft', e);
    }
  },

  clearCurrentDraft() {
    try {
      localStorage.removeItem(KEYS.CURRENT_DRAFT);
    } catch (e) {
      console.error('Error clearing draft', e);
    }
  }
};
