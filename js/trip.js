/**
 * trip.js - Lógica de cálculo de tramos, kilometraje oficial y estimación complementaria de gasolina.
 */

export class TripManager {
  constructor(vehicleManager, onChangeCallback) {
    this.vehicleManager = vehicleManager;
    this.onChange = onChangeCallback || (() => {});

    this.origin = {
      name: 'Calle Los Mota',
      lat: 9.9250,
      lon: -84.0950
    };

    this.destinations = [
      { id: 'dest-1', name: 'Tecnova Soluciones', distanceKm: 4.8, lat: 9.9405, lon: -84.0920 },
      { id: 'dest-2', name: 'Alajuela', distanceKm: 18.5, lat: 10.0163, lon: -84.2116 }
    ];

    this.returnToOrigin = false;
    this.date = new Date().toISOString().split('T')[0];
  }

  setOrigin(name, lat = null, lon = null) {
    this.origin = {
      name: (name || '').trim(),
      lat: lat !== null ? lat : (this.origin ? this.origin.lat : null),
      lon: lon !== null ? lon : (this.origin ? this.origin.lon : null)
    };
    this.notify();
  }

  addDestination(name = '', distanceKm = 0, lat = null, lon = null) {
    const newDest = {
      id: 'dest-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      name: name || `Destino ${this.destinations.length + 1}`,
      distanceKm: Math.max(0, parseFloat(distanceKm) || 0),
      lat,
      lon
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
        lat: null,
        lon: null
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

  setDate(date) {
    this.date = date;
    this.notify();
  }

  /**
   * Calcula la distancia estimada de regreso al origen
   */
  getReturnDistanceKm() {
    if (!this.returnToOrigin) return 0;
    if (this.destinations.length === 1) {
      return this.destinations[0].distanceKm || 0;
    }
    // Si hay múltiples destinos, suma de ida por default
    const outwardSum = this.destinations.reduce((acc, d) => acc + (d.distanceKm || 0), 0);
    return Math.round(outwardSum * 10) / 10;
  }

  /**
   * Desglose ordenado de tramos: Origen -> Destino 1 -> Destino 2 -> ... -> (Origen)
   */
  getLegs() {
    const legs = [];
    let previousPoint = this.origin.name || 'Origen';

    this.destinations.forEach((dest, index) => {
      legs.push({
        index: index + 1,
        from: previousPoint,
        to: dest.name || `Destino ${index + 1}`,
        distanceKm: Math.round((dest.distanceKm || 0) * 10) / 10,
        isReturn: false
      });
      previousPoint = dest.name || `Destino ${index + 1}`;
    });

    if (this.returnToOrigin && this.destinations.length > 0) {
      const returnKm = this.getReturnDistanceKm();
      legs.push({
        index: legs.length + 1,
        from: previousPoint,
        to: this.origin.name || 'Origen',
        distanceKm: Math.round(returnKm * 10) / 10,
        isReturn: true
      });
    }

    return legs;
  }

  /**
   * Cálculo general del recorrido:
   * KM TOTALES x TARIFA = TOTAL A COBRAR
   * Gasolina secundaria
   */
  calculate() {
    const legs = this.getLegs();
    const totalKm = legs.reduce((acc, leg) => acc + leg.distanceKm, 0);
    const roundedTotalKm = Math.round(totalKm * 10) / 10;

    const classification = this.vehicleManager.getActiveClassification();
    const ratePerKm = classification.rate || 0;

    // Fórmula principal: KM TOTALES x TARIFA = TOTAL A COBRAR
    const totalToCharge = Math.round(roundedTotalKm * ratePerKm);

    // Gasolina complementaria (secundaria)
    const fuelConfig = this.vehicleManager.getFuelConfig();
    const kmPerLiter = fuelConfig.kmPerLiter > 0 ? fuelConfig.kmPerLiter : 13.5;
    const pricePerLiter = fuelConfig.pricePerLiter >= 0 ? fuelConfig.pricePerLiter : 690;

    const estimatedLiters = kmPerLiter > 0 ? Math.round((roundedTotalKm / kmPerLiter) * 10) / 10 : 0;
    const fuelCost = Math.round(estimatedLiters * pricePerLiter);

    return {
      totalKm: roundedTotalKm,
      legs,
      ratePerKm,
      totalToCharge,
      estimatedLiters,
      fuelCost,
      kmPerLiter,
      pricePerLiter,
      vehicle: this.vehicleManager.getActiveVehicle(),
      classification
    };
  }

  createTripState() {
    return {
      date: this.date,
      origin: this.origin,
      destinations: JSON.parse(JSON.stringify(this.destinations)),
      returnToOrigin: this.returnToOrigin
    };
  }

  loadTripState(state) {
    if (!state) return;
    if (state.origin) this.origin = typeof state.origin === 'string' ? { name: state.origin } : state.origin;
    if (state.destinations && state.destinations.length > 0) {
      this.destinations = JSON.parse(JSON.stringify(state.destinations));
    }
    if (state.returnToOrigin !== undefined) this.returnToOrigin = Boolean(state.returnToOrigin);
    if (state.date) this.date = state.date;
    this.notify();
  }

  reset() {
    this.origin = { name: 'Calle Los Mota', lat: null, lon: null };
    this.destinations = [
      { id: 'dest-' + Date.now(), name: 'Tecnova Soluciones', distanceKm: 0, lat: null, lon: null }
    ];
    this.returnToOrigin = false;
    this.date = new Date().toISOString().split('T')[0];
    this.notify();
  }

  notify() {
    this.onChange();
  }
}
