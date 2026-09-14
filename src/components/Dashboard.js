import { reportsAPI, productsAPI, usersAPI } from '../services/api.js';

export class Dashboard {
  constructor(onLogout) {
    this.onLogout = onLogout;
  }

  render(container) {
    this.container = container;
    this.container.innerHTML = `
      <div class="max-w-5xl mx-auto px-4 py-8">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-semibold text-gray-900">Dashboard - Mini ERP</h1>
          <button id="logoutBtn" class="btn-secondary">Cerrar sesión</button>
        </div>

        <div id="statsArea" class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <p class="text-gray-500 col-span-3">Cargando resumen...</p>
        </div>

        <h2 class="text-xl font-semibold mb-3">Productos</h2>
        <div id="productsArea">
          <p class="text-gray-500">Cargando productos...</p>
        </div>
      </div>
    `;

    this.attachEventListeners();
    this.loadDashboardData();
  }

  attachEventListeners() {
    this.container.querySelector('#logoutBtn').addEventListener('click', () => {
      usersAPI.logout();
      this.onLogout?.();
    });
  }

  async loadDashboardData() {
    try {
      const dashboardData = await reportsAPI.getDashboardSummary();
      const products = await productsAPI.getAll();

      this.updateStats(dashboardData);
      this.updateProductsTable(products);
    } catch (error) {
      console.error('Error:', error);
      this.container.querySelector('#productsArea').innerHTML =
        '<p class="text-red-600">No se pudieron cargar los datos del ERP.</p>';
      this.container.querySelector('#statsArea').innerHTML = '';
    }
  }

  updateStats(data) {
    const statsArea = this.container.querySelector('#statsArea');
    const entries = Object.entries(data ?? {});

    if (entries.length === 0) {
      statsArea.innerHTML = '<p class="text-gray-500 col-span-3">Sin datos de resumen.</p>';
      return;
    }

    statsArea.innerHTML = entries
      .map(
        ([key, value]) => `
          <div class="card">
            <p class="text-sm text-gray-500 capitalize">${key.replace(/_/g, ' ')}</p>
            <p class="text-2xl font-bold text-blue-600">${value}</p>
          </div>
        `
      )
      .join('');
  }

  updateProductsTable(products) {
    const productsArea = this.container.querySelector('#productsArea');

    if (!products || products.length === 0) {
      productsArea.innerHTML = '<p class="text-gray-500">No hay productos cargados.</p>';
      return;
    }

    productsArea.innerHTML = `
      <div class="overflow-x-auto card">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="border-b border-gray-200 text-gray-500">
              <th class="py-2 pr-4">Nombre</th>
              <th class="py-2 pr-4">Precio</th>
              <th class="py-2 pr-4">Stock</th>
            </tr>
          </thead>
          <tbody>
            ${products.map(renderProductRow).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}

function renderProductRow(product) {
  const name = product.name ?? product.nombre ?? '-';
  const price = product.price ?? product.precio ?? '-';
  const stock = product.stock ?? product.cantidad ?? '-';

  return `
    <tr class="border-b border-gray-100">
      <td class="py-2 pr-4">${name}</td>
      <td class="py-2 pr-4">$${price}</td>
      <td class="py-2 pr-4">${stock}</td>
    </tr>
  `;
}