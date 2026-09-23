# Kilometraje y Cobro - PWA Mobile First

> **PWA sencilla, rápida y enfocada en una sola necesidad: calcular recorridos y determinar cuánto corresponde cobrar por kilometraje con tarifas oficiales de Costa Rica (CGR).**

---

## 🎯 Flujo Principal Inmediato

La aplicación está diseñada **Mobile First**, sin módulos innecesarios, sin odómetros, sin inventarios y sin configuraciones complejas.

```text
Origen → Destino → Destino → ... → [Regresar al origen (opcional)]
```

### Funciones Principales:
* **Ubicación actual como origen**: Botón `📍 Mi ubicación` mediante GPS del celular.
* **Búsqueda de lugares**: Autocompletado rápido con catálogo offline de Costa Rica y geocodificación en línea (OpenStreetMap).
* **Múltiples destinos**: Agregar (`➕`), eliminar (`✕`) y reordenar (`▲`/`▼`) destinos al instante.
* **Cálculo de distancias**:
  - Detección automática en ruta (OSRM / carretera).
  - Posibilidad de escribir/ajustar manualmente los kilómetros de cualquier tramo en cualquier momento.
* **Regresar al origen**: Interruptor para sumar automáticamente el tramo de retorno.

---

## 💰 Resultados Destacados

Para cada tramo se muestra de inmediato:
```text
Origen → Destino = XX.X km
```

Y al final, de forma destacada y de alto impacto:

* **KM TOTALES: XXX.X km**
* **TARIFA: ₡XXX / km**
* **TOTAL A COBRAR: ₡XX,XXX**

> **Fórmula Oficial:** `KM TOTALES × TARIFA POR KM = TOTAL A COBRAR`

---

## 🚗 Vehículo y Tarifas CGR

Conserva **únicamente** los datos requeridos por la tabla oficial de la Contraloría General de la República (CGR Costa Rica) para determinar la tarifa exacta:
* **Marca y Modelo**
* **Año (Antigüedad 0 a 10+ años)**
* **Motor / Cilindrada (cc)**
* **Tipo de Combustible** (Gasolina, Diésel, Híbrido, Eléctrico)
* **Carrocería y Doble Tracción (4x4)** (Requisitos de la Nota 1 CGR para clasificar como Rural vs Liviano).

Permite cambiar o configurar vehículos rápidamente con recálculo en vivo de la tarifa.

---

## ⛽ Gasolina (Cálculo Secundario)

* Permite ingresar **km/L** y **precio por litro (₡/L)**.
* Muestra:
  - **Litros estimados**
  - **Costo estimado de gasolina**
* Completamente opcional e independiente del total a cobrar.

---

## 📄 Justificación y Resumen

Opción para ver, compartir o imprimir un resumen completo que incluye:
* Fecha
* Vehículo y categoría CGR
* Origen y destinos con desglose de kilómetros por tramo
* Kilómetros totales
* Tarifa aplicada por km
* **Total a cobrar**
* Litros estimados y costo referencial de gasolina

Permite **copiar al portapapeles / compartir vía WhatsApp** o **imprimir directamente en PDF/papel**.

---

## 📱 PWA e Instalación en Celular

* **Manifest PWA** y **Service Worker** con soporte offline.
* Lista para **GitHub Pages** con rutas relativas (`./`).
* Instalable en Android (Chrome) e iOS (Safari "Agregar a Inicio").
