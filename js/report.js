/**
 * report.js - Generación de comprobante oficial de liquidación y exportaciones (Imprimir / CSV / JSON)
 */

export function formatCurrency(amount) {
  const num = Number(amount) || 0;
  return '₡ ' + num.toLocaleString('es-CR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

export function formatNumber(num, decimals = 2) {
  const val = Number(num) || 0;
  return val.toLocaleString('es-CR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

export function generateVoucherHtml(tripRecord) {
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
      <!-- Encabezado Institucional -->
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

      <!-- Datos del Funcionario y Vehículo en 2 Columnas -->
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

      <!-- Tabla Detallada de Tramos -->
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

      <!-- Resumen Financiero y Liquidación -->
      <div class="voucher-grid-2 voucher-summary-row">
        <!-- Gasolina Referencial -->
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

        <!-- Monto Oficial a Liquidar -->
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

      <!-- Firmas de Aprobación -->
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

export function printVoucher(tripRecord) {
  const container = document.getElementById('print-area');
  if (!container) return;
  container.innerHTML = generateVoucherHtml(tripRecord);
  window.print();
}

export function exportTripsToCsv(trips) {
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

export function exportTripsToJson(trips) {
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
