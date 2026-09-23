/**
 * vehicle.js - Lógica y estado del vehículo y configuración de combustible
 */

import { classifyVehicle, getRate, calculateAge, CATEGORY_LABELS, CATEGORIES } from './rates.js';
import { Storage } from './storage.js';

export class VehicleManager {
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

  /**
   * Obtiene la clasificación y tarifa activa para el vehículo guardado
   */
  getActiveClassification() {
    const classification = classifyVehicle(this.vehicle);

    // Si el usuario configuró una categoría manual explícita
    if (this.vehicle.manualCategoryOverride && CATEGORIES[this.vehicle.manualCategoryOverride]) {
      const manualCat = this.vehicle.manualCategoryOverride;
      const age = calculateAge(this.vehicle.year);
      const manualRate = getRate(manualCat, age);
      return {
        category: manualCat,
        label: CATEGORY_LABELS[manualCat] + ' (Selección manual)',
        age,
        rate: manualRate,
        notes: `Tarifa asignada manualmente por el usuario. Antigüedad: ${age} años.`,
        isManual: true
      };
    }

    return {
      ...classification,
      isManual: false
    };
  }
}
