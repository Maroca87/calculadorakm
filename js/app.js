/**
 * app.js - Controlador principal de la PWA de Kilometraje y Cobro
 * Flujo: Origen -> Destinos -> Regreso -> KM Totales x Tarifa = Total a Cobrar
 */

import { VehicleManager } from './vehicle.js';
import { TripManager } from './trip.js';
import { Storage } from './storage.js';
import { formatCurrency, formatKm, generateJustificationHtml, generateJustificationText } from './report.js';
import { searchPlaces, calculateRouteDistance, reverseGeocode } from './places.js';
import { BASE_YEAR } from './rates.js';

class App {
  constructor() {
    this.vehicleManager = new VehicleManager(() => this.onVehicleChanged());
    this.tripManager = new TripManager(this.vehicleManager, () => this.onTripChanged());
    this.deferredPrompt = null;
    this.searchDebounceTimer = null;

    this.initDom();
    this.initTheme();
    this.bindEvents();
    this.loadSavedTripOrDefaults();
    this.updateAllUi();
    this.initPwa();
  }

  initDom() {
    this.dom = {
      // Header
      headerVehicleName: document.getElementById('header-vehicle-name'),
      openVehicleModalBtn: document.getElementById('open-vehicle-modal-btn'),
      themeToggleBtn: document.getElementById('theme-toggle-btn'),
      themeIcon: document.getElementById('theme-icon'),
      installBtn: document.getElementById('install-btn'),
      pwaBanner: document.getElementById('pwa-install-banner'),
      bannerInstallBtn: document.getElementById('banner-install-btn'),

      // Route
      originInput: document.getElementById('origin-input'),
      originSuggestions: document.getElementById('origin-suggestions'),
      geoOriginBtn: document.getElementById('geo-origin-btn'),
      destinationsContainer: document.getElementById('destinations-container'),
      addDestinationBtn: document.getElementById('add-destination-btn'),
      autoCalcDistancesBtn: document.getElementById('auto-calc-distances-btn'),
      returnToggle: document.getElementById('return-toggle'),
      returnInfoText: document.getElementById('return-info-text'),

      // Legs Breakdown
      legsSection: document.getElementById('legs-section'),
      legsCountBadge: document.getElementById('legs-count-badge'),
      legsList: document.getElementById('legs-list'),

      // Results
      kpiTotalKm: document.getElementById('kpi-total-km'),
      kpiRateKm: document.getElementById('kpi-rate-km'),
      kpiRateCat: document.getElementById('kpi-rate-cat'),
      kpiTotalCharge: document.getElementById('kpi-total-charge'),
      kpiFormulaPreview: document.getElementById('kpi-formula-preview'),
      openJustificationBtn: document.getElementById('open-justification-btn'),
      clearRouteBtn: document.getElementById('clear-route-btn'),

      // Fuel (Secondary)
      fuelEfficiency: document.getElementById('fuel-efficiency'),
      fuelPrice: document.getElementById('fuel-price'),
      kpiFuelLiters: document.getElementById('kpi-fuel-liters'),
      kpiFuelCost: document.getElementById('kpi-fuel-cost'),
      fuelQuickCost: document.getElementById('fuel-quick-cost'),

      // Vehicle Modal
      vehicleModal: document.getElementById('vehicle-modal'),
      closeVehicleModal: document.getElementById('close-vehicle-modal'),
      cancelVehicleBtn: document.getElementById('cancel-vehicle-btn'),
      saveVehicleBtn: document.getElementById('save-vehicle-btn'),
      quickVehiclesList: document.getElementById('quick-vehicles-list'),
      modalRateCat: document.getElementById('modal-rate-cat'),
      modalRateVal: document.getElementById('modal-rate-val'),
      modalRateNote: document.getElementById('modal-rate-note'),
      vBrand: document.getElementById('v-brand'),
      vModel: document.getElementById('v-model'),
      vYear: document.getElementById('v-year'),
      vFuel: document.getElementById('v-fuel'),
      vCc: document.getElementById('v-cc'),
      vBody: document.getElementById('v-body'),
      v4x4: document.getElementById('v-4x4'),

      // Justification Modal
      justificationModal: document.getElementById('justification-modal'),
      closeJustificationModal: document.getElementById('close-justification-modal'),
      closeJustBtn: document.getElementById('close-just-btn'),
      justificationContainer: document.getElementById('justification-container'),
      copyShareBtn: document.getElementById('copy-share-btn'),
      printBtn: document.getElementById('print-btn'),

      // Toast
      toastPopup: document.getElementById('toast-popup')
    };
  }

  initTheme() {
    const savedTheme = localStorage.getItem('cgr_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.dom.themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
  }

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('cgr_theme', next);
    this.dom.themeIcon.textContent = next === 'dark' ? '☀️' : '🌙';
    this.showToast(`Modo ${next === 'dark' ? 'oscuro' : 'claro'} activado`);
  }

  showToast(message) {
    this.dom.toastPopup.textContent = message;
    this.dom.toastPopup.classList.add('show');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.dom.toastPopup.classList.remove('show');
    }, 2400);
  }

  bindEvents() {
    // Tema
    this.dom.themeToggleBtn.addEventListener('click', () => this.toggleTheme());

    // Origen
    this.dom.originInput.addEventListener('input', (e) => {
      this.tripManager.setOrigin(e.target.value);
      this.handleAutocomplete(e.target.value, this.dom.originSuggestions, (selected) => {
        this.dom.originInput.value = selected.name;
        this.tripManager.setOrigin(selected.name, selected.lat, selected.lon);
        this.dom.originSuggestions.classList.remove('show');
      });
    });

    document.addEventListener('click', (e) => {
      if (!this.dom.originInput.contains(e.target) && !this.dom.originSuggestions.contains(e.target)) {
        this.dom.originSuggestions.classList.remove('show');
      }
    });

    // Geolocalización
    this.dom.geoOriginBtn.addEventListener('click', () => this.useCurrentLocationAsOrigin());

    // Destinos
    this.dom.addDestinationBtn.addEventListener('click', () => {
      this.tripManager.addDestination('', 0);
      this.renderDestinations();
      // Enfocar nuevo destino
      const inputs = this.dom.destinationsContainer.querySelectorAll('.dest-name-field');
      if (inputs.length > 0) {
        inputs[inputs.length - 1].focus();
      }
    });

    // Auto-cálculo de distancias de ruta
    this.dom.autoCalcDistancesBtn.addEventListener('click', () => this.autoCalculateAllDistances());

    // Regresar al origen
    this.dom.returnToggle.addEventListener('change', (e) => {
      this.tripManager.setReturnToOrigin(e.target.checked);
    });

    // Gasolina secundario
    this.dom.fuelEfficiency.addEventListener('input', (e) => {
      this.vehicleManager.updateFuelConfig({ kmPerLiter: parseFloat(e.target.value) || 12 });
    });
    this.dom.fuelPrice.addEventListener('input', (e) => {
      this.vehicleManager.updateFuelConfig({ pricePerLiter: parseFloat(e.target.value) || 0 });
    });

    // Acciones de viaje
    this.dom.clearRouteBtn.addEventListener('click', () => {
      if (confirm('¿Restablecer el recorrido actual a valores iniciales?')) {
        this.tripManager.reset();
        this.dom.originInput.value = this.tripManager.origin.name;
        this.dom.returnToggle.checked = false;
        this.renderDestinations();
        this.showToast('Recorrido restablecido');
      }
    });

    // Modal Vehículo
    this.dom.openVehicleModalBtn.addEventListener('click', () => this.openVehicleModal());
    this.dom.closeVehicleModal.addEventListener('click', () => this.closeVehicleModal());
    this.dom.cancelVehicleBtn.addEventListener('click', () => this.closeVehicleModal());
    this.dom.saveVehicleBtn.addEventListener('click', () => this.saveVehicleFromModal());

    const modalInputs = [
      this.dom.vBrand, this.dom.vModel, this.dom.vYear,
      this.dom.vFuel, this.dom.vCc, this.dom.vBody, this.dom.v4x4
    ];
    modalInputs.forEach(input => {
      input.addEventListener('input', () => this.updateModalRatePreview());
      input.addEventListener('change', () => this.updateModalRatePreview());
    });

    // Modal Justificación
    this.dom.openJustificationBtn.addEventListener('click', () => this.openJustificationModal());
    this.dom.closeJustificationModal.addEventListener('click', () => this.closeJustificationModal());
    this.dom.closeJustBtn.addEventListener('click', () => this.closeJustificationModal());
    this.dom.printBtn.addEventListener('click', () => window.print());
    this.dom.copyShareBtn.addEventListener('click', () => this.shareOrCopyJustification());

    // Cierre al hacer click en backdrop
    this.dom.vehicleModal.addEventListener('click', (e) => {
      if (e.target === this.dom.vehicleModal) this.closeVehicleModal();
    });
    this.dom.justificationModal.addEventListener('click', (e) => {
      if (e.target === this.dom.justificationModal) this.closeJustificationModal();
    });
  }

  handleAutocomplete(query, dropdownEl, onSelect) {
    clearTimeout(this.searchDebounceTimer);
    if (!query || query.trim().length < 2) {
      dropdownEl.classList.remove('show');
      return;
    }

    this.searchDebounceTimer = setTimeout(async () => {
      const places = await searchPlaces(query);
      if (!places || places.length === 0) {
        dropdownEl.classList.remove('show');
        return;
      }

      dropdownEl.innerHTML = '';
      places.forEach(item => {
        const div = document.createElement('div');
        div.className = 'autocomplete-item';
        div.innerHTML = `<span>📍</span> <span>${item.name}</span>`;
        div.addEventListener('click', () => onSelect(item));
        dropdownEl.appendChild(div);
      });
      dropdownEl.classList.add('show');
    }, 280);
  }

  async useCurrentLocationAsOrigin() {
    if (!navigator.geolocation) {
      this.showToast('Geolocalización no soportada por el navegador');
      return;
    }

    this.showToast('Obteniendo ubicación actual...');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const placeName = await reverseGeocode(lat, lon);
        this.dom.originInput.value = placeName;
        this.tripManager.setOrigin(placeName, lat, lon);
        this.showToast('📍 Origen actualizado con tu ubicación');
      },
      (err) => {
        console.warn('Geo error', err);
        this.showToast('No se pudo acceder a tu ubicación GPS');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  async autoCalculateAllDistances() {
    const list = this.tripManager.destinations;
    if (!list || list.length === 0) return;

    this.showToast('Calculando distancias de ruta...');
    this.dom.autoCalcDistancesBtn.disabled = true;

    try {
      let prevPoint = this.tripManager.origin;
      for (const dest of list) {
        if (dest.name) {
          const dist = await calculateRouteDistance(prevPoint, dest);
          if (dist !== null && dist > 0) {
            this.tripManager.updateDestination(dest.id, { distanceKm: dist });
          }
        }
        prevPoint = dest;
      }
      this.renderDestinations();
      this.showToast('✓ Distancias calculadas con éxito');
    } catch (e) {
      this.showToast('No se pudo calcular la ruta en línea');
    } finally {
      this.dom.autoCalcDistancesBtn.disabled = false;
    }
  }

  renderDestinations() {
    const container = this.dom.destinationsContainer;
    container.innerHTML = '';
    const list = this.tripManager.destinations;

    list.forEach((dest, index) => {
      const row = document.createElement('div');
      row.className = 'dest-row';
      row.innerHTML = `
        <div class="dest-row-header">
          <span class="dest-index-badge">Destino ${index + 1}</span>
          <div class="dest-actions">
            <button type="button" class="dest-action-btn" title="Subir orden" data-action="up" data-id="${dest.id}" ${index === 0 ? 'disabled style="opacity:0.3"' : ''}>▲</button>
            <button type="button" class="dest-action-btn" title="Bajar orden" data-action="down" data-id="${dest.id}" ${index === list.length - 1 ? 'disabled style="opacity:0.3"' : ''}>▼</button>
            <button type="button" class="dest-action-btn delete" title="Eliminar destino" data-action="delete" data-id="${dest.id}">✕</button>
          </div>
        </div>
        <div class="dest-fields-grid">
          <div class="input-autocomplete-wrap">
            <input type="text" class="text-input dest-name-field" data-id="${dest.id}" placeholder="Lugar o dirección" value="${escapeHtml(dest.name)}" autocomplete="off">
            <div class="autocomplete-dropdown dest-dropdown-${dest.id}"></div>
          </div>
          <div class="input-unit-wrap">
            <input type="number" class="text-input dest-km-field" data-id="${dest.id}" placeholder="0.0" value="${dest.distanceKm || ''}" step="0.1" min="0">
            <span class="unit-text">km</span>
          </div>
        </div>
      `;

      // Inputs
      const nameInput = row.querySelector('.dest-name-field');
      const kmInput = row.querySelector('.dest-km-field');
      const dropdown = row.querySelector(`.dest-dropdown-${dest.id}`);

      nameInput.addEventListener('input', (e) => {
        this.tripManager.updateDestination(dest.id, { name: e.target.value });
        this.handleAutocomplete(e.target.value, dropdown, (selected) => {
          nameInput.value = selected.name;
          this.tripManager.updateDestination(dest.id, {
            name: selected.name,
            lat: selected.lat,
            lon: selected.lon
          });
          dropdown.classList.remove('show');
          // Auto calcular distancia para este tramo
          const prev = index === 0 ? this.tripManager.origin : list[index - 1];
          calculateRouteDistance(prev, selected).then(km => {
            if (km) {
              this.tripManager.updateDestination(dest.id, { distanceKm: km });
              kmInput.value = km;
            }
          });
        });
      });

      kmInput.addEventListener('input', (e) => {
        this.tripManager.updateDestination(dest.id, { distanceKm: parseFloat(e.target.value) || 0 });
      });

      // Cerrar dropdown al hacer click fuera
      document.addEventListener('click', (e) => {
        if (!nameInput.contains(e.target) && !dropdown.contains(e.target)) {
          dropdown.classList.remove('show');
        }
      });

      // Botones mover/eliminar
      row.querySelector('[data-action="up"]').addEventListener('click', () => {
        this.tripManager.moveDestination(dest.id, 'up');
        this.renderDestinations();
      });
      row.querySelector('[data-action="down"]').addEventListener('click', () => {
        this.tripManager.moveDestination(dest.id, 'down');
        this.renderDestinations();
      });
      row.querySelector('[data-action="delete"]').addEventListener('click', () => {
        this.tripManager.removeDestination(dest.id);
        this.renderDestinations();
      });

      container.appendChild(row);
    });
  }

  updateAllUi() {
    const calc = this.tripManager.calculate();
    const v = calc.vehicle;
    const c = calc.classification;

    // Header Vehicle
    this.dom.headerVehicleName.textContent = `${v.brand} ${v.model || ''}`;

    // Tramos del recorrido
    this.renderLegsList(calc.legs);

    // Métricas Principales (Destacadas)
    this.dom.kpiTotalKm.textContent = formatKm(calc.totalKm);
    this.dom.kpiRateKm.textContent = formatCurrency(calc.ratePerKm) + ' / km';
    this.dom.kpiRateCat.textContent = `${c.label} (${calc.totalKm > 0 ? (BASE_YEAR - v.year) + ' años' : ''})`;
    this.dom.kpiTotalCharge.textContent = formatCurrency(calc.totalToCharge);
    this.dom.kpiFormulaPreview.textContent = `${formatKm(calc.totalKm)} × ${formatCurrency(calc.ratePerKm)}/km = ${formatCurrency(calc.totalToCharge)}`;

    // Gasolina (Secundaria)
    this.dom.kpiFuelLiters.textContent = calc.estimatedLiters.toFixed(1) + ' L';
    this.dom.kpiFuelCost.textContent = formatCurrency(calc.fuelCost);
    this.dom.fuelQuickCost.textContent = formatCurrency(calc.fuelCost);

    // Actualizar texto descriptivo del switch de regreso
    if (this.tripManager.returnToOrigin) {
      const returnDist = this.tripManager.getReturnDistanceKm();
      this.dom.returnInfoText.textContent = `Retorno agregado al itinerario (${formatKm(returnDist)})`;
    } else {
      this.dom.returnInfoText.textContent = 'Agrega automáticamente el tramo final de vuelta';
    }

    // Persistir estado
    Storage.saveCurrentTrip(this.tripManager.createTripState());
  }

  renderLegsList(legs) {
    const listEl = this.dom.legsList;
    listEl.innerHTML = '';
    this.dom.legsCountBadge.textContent = `${legs.length} tramo${legs.length === 1 ? '' : 's'}`;

    if (!legs || legs.length === 0) {
      listEl.innerHTML = `<div style="font-size:12px; color:var(--text-sub); text-align:center; padding:8px;">Ingresa destinos para ver el desglose de tramos.</div>`;
      return;
    }

    legs.forEach(leg => {
      const div = document.createElement('div');
      div.className = 'leg-item' + (leg.isReturn ? ' is-return' : '');
      div.innerHTML = `
        <div class="leg-path">
          <span><strong>${escapeHtml(leg.from)}</strong> → <strong>${escapeHtml(leg.to)}</strong>${leg.isReturn ? ' <span style="font-size:11px; opacity:0.8;">(Regreso)</span>' : ''}</span>
        </div>
        <div class="leg-dist">${formatKm(leg.distanceKm)}</div>
      `;
      listEl.appendChild(div);
    });
  }

  onVehicleChanged() {
    this.updateAllUi();
  }

  onTripChanged() {
    this.updateAllUi();
  }

  loadSavedTripOrDefaults() {
    // Cargar combustible
    const fuel = this.vehicleManager.getFuelConfig();
    this.dom.fuelEfficiency.value = fuel.kmPerLiter || 13.5;
    this.dom.fuelPrice.value = fuel.pricePerLiter || 690;

    // Cargar viaje
    const saved = Storage.getCurrentTrip();
    if (saved) {
      this.tripManager.loadTripState(saved);
    }
    this.dom.originInput.value = this.tripManager.origin.name || 'Calle Los Mota';
    this.dom.returnToggle.checked = this.tripManager.returnToOrigin;
    this.renderDestinations();
  }

  /* Modal de Vehículo */
  openVehicleModal() {
    this.renderQuickVehiclesList();
    this.populateModalWithActiveVehicle();
    this.updateModalRatePreview();
    this.dom.vehicleModal.style.display = 'flex';
  }

  closeVehicleModal() {
    this.dom.vehicleModal.style.display = 'none';
  }

  renderQuickVehiclesList() {
    const list = this.vehicleManager.getVehicles();
    const active = this.vehicleManager.getActiveVehicle();
    const container = this.dom.quickVehiclesList;
    container.innerHTML = '';

    list.forEach(v => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'v-pill-option' + (v.id === active.id ? ' active' : '');
      btn.textContent = `🚗 ${v.brand} ${v.model || ''}`;
      btn.addEventListener('click', () => {
        this.vehicleManager.setActiveVehicle(v.id);
        this.populateModalWithActiveVehicle();
        this.renderQuickVehiclesList();
        this.updateModalRatePreview();
      });
      container.appendChild(btn);
    });
  }

  populateModalWithActiveVehicle() {
    const v = this.vehicleManager.getActiveVehicle();
    this.dom.vBrand.value = v.brand || '';
    this.dom.vModel.value = v.model || '';
    this.dom.vYear.value = v.year || BASE_YEAR;
    this.dom.vFuel.value = v.fuel || 'gasolina';
    this.dom.vCc.value = v.engineCc || '';
    this.dom.vBody.value = v.bodyType || 'sedan';
    this.dom.v4x4.checked = Boolean(v.is4x4);
  }

  getVehicleFromModalInputs() {
    const active = this.vehicleManager.getActiveVehicle();
    return {
      id: active.id,
      brand: this.dom.vBrand.value.trim() || 'Vehículo',
      model: this.dom.vModel.value.trim(),
      year: parseInt(this.dom.vYear.value, 10) || BASE_YEAR,
      fuel: this.dom.vFuel.value,
      engineCc: parseFloat(this.dom.vCc.value) || 0,
      bodyType: this.dom.vBody.value,
      is4x4: this.dom.v4x4.checked
    };
  }

  updateModalRatePreview() {
    const tempVehicle = this.getVehicleFromModalInputs();
    import('./rates.js').then(module => {
      const classification = module.classifyVehicle(tempVehicle);
      this.dom.modalRateCat.textContent = classification.label;
      this.dom.modalRateVal.textContent = formatCurrency(classification.rate) + ' / km';
      this.dom.modalRateNote.textContent = classification.notes || 'Tarifa oficial CGR vigente.';
    });
  }

  saveVehicleFromModal() {
    const data = this.getVehicleFromModalInputs();
    this.vehicleManager.saveVehicle(data);
    this.closeVehicleModal();
    this.showToast('✓ Vehículo y tarifa actualizados');
  }

  /* Modal de Justificación */
  openJustificationModal() {
    const calc = this.tripManager.calculate();
    calc.date = this.tripManager.date;
    this.dom.justificationContainer.innerHTML = generateJustificationHtml(calc);
    this.dom.justificationModal.style.display = 'flex';
  }

  closeJustificationModal() {
    this.dom.justificationModal.style.display = 'none';
  }

  async shareOrCopyJustification() {
    const calc = this.tripManager.calculate();
    calc.date = this.tripManager.date;
    const text = generateJustificationText(calc);

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Justificación de Kilometraje',
          text: text
        });
        return;
      } catch (e) {
        // Fallback a copiar si cancela o falla
      }
    }

    try {
      await navigator.clipboard.writeText(text);
      this.showToast('✓ Resumen copiado al portapapeles');
    } catch (e) {
      this.showToast('No se pudo copiar automáticamente');
    }
  }

  /* PWA Installation */
  initPwa() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.dom.installBtn.style.display = 'flex';
      this.dom.pwaBanner.style.display = 'flex';
    });

    const triggerInstall = async () => {
      if (!this.deferredPrompt) return;
      this.deferredPrompt.prompt();
      const choice = await this.deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        this.dom.installBtn.style.display = 'none';
        this.dom.pwaBanner.style.display = 'none';
        this.showToast('¡App instalada con éxito!');
      }
      this.deferredPrompt = null;
    };

    this.dom.installBtn.addEventListener('click', triggerInstall);
    this.dom.bannerInstallBtn.addEventListener('click', triggerInstall);

    window.addEventListener('appinstalled', () => {
      this.dom.installBtn.style.display = 'none';
      this.dom.pwaBanner.style.display = 'none';
    });
  }
}

// Inicializar la aplicación cuando el DOM esté listo
window.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
