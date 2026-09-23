# Kilometraje CGR - PWA Mobile First para Viajes Laborales

> **Aplicación Web Progresiva (PWA)** funcional, responsive y Mobile First para calcular, registrar y justificar liquidaciones de viajes laborales por kilometraje, utilizando como **fuente de verdad estricta** la tabla oficial de tarifas de arrendamiento de vehículos a funcionarios publicada por la **Contraloría General de la República (CGR) de Costa Rica**.

---

## 🌟 Características Principales

1. **Cálculo de Rutas y Tramos**:
   - Definición de punto de origen.
   - Múltiples destinos con motivos laborales específicos por visita.
   - Reordenamiento interactivo (subir/bajar) y eliminación de destinos.
   - Interruptor de **Regreso al Origen** con cálculo automático o ajuste manual de distancia.
   - Suma en tiempo real de **KM por tramo y KM Totales**.

2. **Tarifa Empresarial Oficial CGR**:
   - Matriz completa de las **9 categorías oficiales** y los **11 escalafones de antigüedad** (Modelo 2025 hasta 2015 o anterior).
   - Determinación automática según las notas 1, 2, 3 y 4 de la CGR:
     - **Vehículo Rural** (Gasolina o Diesel): Carrocería rural/familiar/pick-up, motor > 2.200 cc y doble tracción 4x4 simultáneamente.
     - **Vehículo Liviano Gasolina A**: Hasta 1.600 cc.
     - **Vehículo Liviano Gasolina B**: Más de 1.600 cc.
     - **Vehículo Liviano Diesel**.
     - **Motocicleta** (Gasolina o Eléctrica).
     - **Vehículo Híbrido** y **Vehículo Eléctrico**.
   - Posibilidad de anulación/selección manual de categoría si se requiere.
   - **Monto por kilometraje** = `KM Totales × Tarifa oficial por km`.

3. **Cálculo Complementario de Gasolina**:
   - Configuración de tipo de combustible, precio por litro y rendimiento del vehículo (km/L).
   - `Litros estimados = KM totales ÷ km/L`.
   - `Costo de gasolina = Litros estimados × Precio por litro`.
   - **Totalmente separado del monto de reembolso**, sirviendo como dato referencial y de control.

4. **Resumen Ejecutivo (KPI Cards)**:
   - **KM TOTALES**
   - **TARIFA / KM**
   - **MONTO POR KILOMETRAJE** (destacado en colones ₡)
   - **LITROS ESTIMADOS**
   - **COSTO DE GASOLINA**

5. **Historial y Comprobante Imprimible de Justificación**:
   - Guardado local de cada viaje con fecha, vehículo, origen, destinos, tramos, odómetros, tarifa y totales.
   - Generación instantánea de **Comprobante de Justificación y Liquidación**:
     - Formato institucional con diseño listo para imprimir en papel carta o guardar como PDF (`Ctrl+P` / botón "Imprimir").
     - Incluye datos del solicitante, ficha técnica del vehículo, tabla detallada de tramos, cuadro financiero de liquidación y líneas para firmas del funcionario y jefatura aprobatoria.
   - Exportación de historial completo a **Excel/CSV** y **JSON**.

6. **PWA Real 100% Offline**:
   - Web App Manifest con soporte para instalación en Android, iOS y Desktop.
   - Service Worker con caché de recursos para funcionar sin conexión a internet en giras o zonas sin cobertura.
   - Rutas relativas (`./`) para despliegue directo en **GitHub Pages**.
   - Modo oscuro y modo claro.

---

## 📊 Matriz Oficial de Tarifas CGR (₡ por km recorrido)

| Antigüedad | Modelo | Rural Gasolina | Rural Diesel | Liviano Gas. A (≤1600cc) | Liviano Gas. B (>1600cc) | Liviano Diesel | Moto Gasolina | Moto Eléctrica | Híbrido | Eléctrico |
|---|---|---|---|---|---|---|---|---|---|---|
| **0 años** | 2025 | ₡293,90 | ₡266,91 | ₡199,65 | ₡254,10 | ₡231,28 | ₡71,56 | ₡60,24 | ₡249,30 | ₡190,97 |
| **1 año** | 2024 | ₡273,00 | ₡246,46 | ₡187,53 | ₡236,41 | ₡215,98 | ₡69,75 | ₡53,08 | ₡231,02 | ₡167,38 |
| **2 años** | 2023 | ₡261,55 | ₡235,12 | ₡180,97 | ₡226,70 | ₡207,65 | ₡69,05 | ₡48,84 | ₡220,98 | ₡153,77 |
| **3 años** | 2022 | ₡255,78 | ₡229,25 | ₡177,76 | ₡221,77 | ₡203,50 | ₡69,01 | ₡46,35 | ₡215,90 | ₡146,17 |
| **4 años** | 2021 | ₡253,39 | ₡226,66 | ₡176,54 | ₡219,71 | ₡201,86 | ₡69,01 | ₡46,35 | ₡213,79 | ₡143,19 |
| **5 años** | 2020 | ₡253,05 | ₡226,02 | ₡176,52 | ₡219,37 | ₡201,72 | ₡69,01 | ₡46,35 | ₡213,48 | ₡140,43 |
| **6 años** | 2019 | ₡253,05 | ₡226,02 | ₡176,52 | ₡219,37 | ₡201,72 | ₡69,01 | ₡46,35 | ₡213,48 | ₡140,01 |
| **7 años** | 2018 | ₡250,28 | ₡222,75 | ₡175,25 | ₡216,92 | ₡199,89 | ₡69,01 | ₡46,35 | ₡211,10 | ₡134,94 |
| **8 años** | 2017 | ₡247,27 | ₡219,56 | ₡173,66 | ₡214,32 | ₡197,79 | ₡69,01 | ₡46,35 | ₡208,54 | ₡130,63 |
| **9 años** | 2016 | ₡244,84 | ₡216,92 | ₡172,41 | ₡212,21 | ₡196,10 | ₡69,01 | ₡46,35 | ₡206,51 | ₡126,99 |
| **10+ años** | 2015- | ₡242,92 | ₡214,78 | ₡171,46 | ₡210,52 | ₡194,78 | ₡69,01 | ₡46,35 | ₡204,94 | ₡123,98 |

---

## 🚀 Guía de Publicación en GitHub Pages

Este proyecto no requiere NodeJS, Webpack ni compilación previa; está construido en **Vanilla JS moderno** y listo para alojarse de forma estática en **GitHub Pages**.

### Paso 1: Crear un nuevo repositorio en GitHub
1. Ve a [github.com/new](https://github.com/new).
2. Nómbralo, por ejemplo: `kilometraje-cgr` o `kilometraje-pwa`.
3. Selecciona **Public** y no agregues README ni .gitignore adicionales.

### Paso 2: Subir los archivos desde tu computadora
Abre tu terminal en la carpeta del proyecto (`C:\Users\mrodriguez\.gemini\antigravity-ide\scratch\kilometraje-pwa`) y ejecuta:

```bash
git init
git add .
git commit -m "feat: PWA completa de cálculo y justificación de kilometraje CGR"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/kilometraje-cgr.git
git push -u origin main
```

*(Reemplaza `TU_USUARIO` y `kilometraje-cgr` con los datos de tu cuenta de GitHub).*

### Paso 3: Activar GitHub Pages
1. En tu repositorio de GitHub, haz clic en **Settings** (Configuración).
2. En el menú lateral izquierdo, haz clic en **Pages**.
3. En **Build and deployment > Source**, selecciona **Deploy from a branch**.
4. En **Branch**, selecciona `main` y la carpeta `/ (root)`.
5. Haz clic en **Save** (Guardar).
6. En un par de minutos, GitHub te dará la URL pública:  
   `https://TU_USUARIO.github.io/kilometraje-cgr/`

---

## 📱 Cómo Instalar la PWA en tu Celular

### En Android (Google Chrome):
1. Abre la URL de tu app en Chrome desde el celular.
2. Verás el botón o banner **"Instalar"** en la parte superior de la app, o toca el menú de Chrome (`⋮`) y selecciona **"Instalar aplicación"** / **"Agregar a la pantalla principal"**.
3. La aplicación se instalará como una app nativa, con su icono independiente y apertura a pantalla completa sin barra de navegación del navegador.

### En iOS / iPhone (Safari):
1. Abre la URL en Safari.
2. Toca el botón **Compartir** (icono de cuadrado con flecha hacia arriba en la barra inferior).
3. Desplázate hacia abajo y selecciona **"Agregar a pantalla de inicio"** (Add to Home Screen).
4. Confirma el nombre y toca **"Agregar"**.

---

## 🔒 Privacidad y Almacenamiento Local
- **100% del lado del cliente**: No se envían datos personales, rutas, ni kilometrajes a ningún servidor externo.
- Todo se guarda de forma segura en el almacenamiento local (`localStorage`) de tu navegador.
- Funciona sin internet: puedes registrar y consultar viajes en zonas rurales o de montaña sin cobertura celular.
