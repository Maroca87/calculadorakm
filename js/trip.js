/**
 * trip.js - Lógica de cálculo de tramos, kilometraje, gasolina y viaje
 */

export class TripManager {
  constructor(vehicleManager, onChangeCallback) {
    this.vehicleManager = vehicleManager;
    this.onChange = onChangeCallback || (() => {});

    this.origin = 'Oficina Central / San José';
    this.destinations = [
      { id: 'dest-1', name: 'Sucursal Alajuela', distanceKm: 21.5, purpose: 'Reunión de coordinación' }
    ];
    this.returnToOrigin = true;
    this.customReturnKm = null; // null significa calcular automáticamente
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

  setNotes(notes) {
    this.notes = notes;
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
      // Dejar al menos uno vacío en lugar de 0 para conveniencia de UI
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

  /**
   * Calcula la distancia estimada de regreso al origen.
   * Si hay 1 destino, es igual al tramo hacia ese destino.
   * Si hay varios destinos, por defecto toma la suma o la distancia directa estimada.
   */
  getReturnDistanceKm() {
    if (!this.returnToOrigin) return 0;
    if (this.customReturnKm !== null) return this.customReturnKm;

    if (this.destinations.length === 1) {
      return this.destinations[0].distanceKm || 0;
    }

    // Si hay múltiples destinos y no se ha especificado un KM especial de regreso,
    // se toma la distancia desde el último destino de vuelta al origen
    // (o el promedio de los tramos o la suma si es ruta lineal)
    // Para conveniencia inicial, sumamos los tramos intermedios si regresan por la misma vía,
    // o el último tramo si es circular. Mostramos el campo editable en UI para mayor precisión.
    const outwardSum = this.destinations.reduce((acc, d) => acc + (d.distanceKm || 0), 0);
    return Math.round(outwardSum * 100) / 100;
  }

  /**
   * Genera la lista completa de tramos (legs) incluyendo el regreso si aplica
   */
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
        purpose: 'Retorno a punto de origen',
        isReturn: true
      });
    }

    return legs;
  }

  /**
   * Realiza todos los cálculos del viaje
   */
  calculate() {
    const legs = this.getLegs();
    const totalKm = legs.reduce((acc, leg) => acc + leg.distanceKm, 0);
    const roundedTotalKm = Math.round(totalKm * 100) / 100;

    const vehicleClassification = this.vehicleManager.getActiveClassification();
    const ratePerKm = vehicleClassification.rate || 0;

    // 1. Monto oficial por kilometraje
    const mileageAmount = Math.round(roundedTotalKm * ratePerKm * 100) / 100;

    // 2. Gasolina como cálculo complementario separado
    const fuelConfig = this.vehicleManager.getFuelConfig();
    const kmPerLiter = fuelConfig.kmPerLiter > 0 ? fuelConfig.kmPerLiter : 12;
    const pricePerLiter = fuelConfig.pricePerLiter >= 0 ? fuelConfig.pricePerLiter : 690;

    const estimatedLiters = kmPerLiter > 0 ? Math.round((roundedTotalKm / kmPerLiter) * 100) / 100 : 0;
    const fuelCost = Math.round(estimatedLiters * pricePerLiter * 100) / 100;

    // Odómetros
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

  /**
   * Crea un objeto de viaje completo para guardar en historial
   */
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

  /**
   * Carga los datos de un viaje previamente guardado
   */
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
    this.origin = 'Oficina Central';
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
