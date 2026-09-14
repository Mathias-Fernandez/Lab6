import { usersAPI } from '../services/api.js';
import { TEST_CREDENTIALS } from '../config/api.js';

export class Login {
  constructor(onLoginSuccess) {
    this.onLoginSuccess = onLoginSuccess;
  }

  render(container) {
    this.container = container;
    this.container.innerHTML = `
      <div class="min-h-screen flex items-center justify-center bg-gray-50">
        <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
          <h2 class="text-3xl font-extrabold text-gray-900 text-center">
            Mini ERP
          </h2>
          <div id="loginError"></div>
          <form id="loginForm" class="space-y-4">
            <input
              type="email"
              id="email"
              placeholder="Email"
              value="${TEST_CREDENTIALS.admin.email}"
              class="input-field"
              required
            />
            <input
              type="password"
              id="password"
              placeholder="Contraseña"
              value="${TEST_CREDENTIALS.admin.password}"
              class="input-field"
              required
            />
            <button type="submit" class="btn-primary w-full">
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    const form = this.container.querySelector('#loginForm');
    const errorBox = this.container.querySelector('#loginError');
    const button = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      errorBox.innerHTML = '';

      const email = this.container.querySelector('#email').value;
      const password = this.container.querySelector('#password').value;

      button.disabled = true;
      button.textContent = 'Ingresando...';

      try {
        await usersAPI.login(email, password);
        this.onLoginSuccess?.();
      } catch (error) {
        const message =
          error.response?.data?.message ??
          error.response?.data?.detail ??
          'Credenciales inválidas o error de conexión.';
        errorBox.innerHTML = `<p class="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2 mb-2">${message}</p>`;
      } finally {
        button.disabled = false;
        button.textContent = 'Iniciar Sesión';
      }
    });
  }
}