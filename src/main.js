import './style.css';
import { isAuthenticated } from './services/api.js';
import { Login } from './components/Login.js';
import { Dashboard } from './components/Dashboard.js';

const app = document.getElementById('app');

function render() {
  if (isAuthenticated()) {
    const dashboard = new Dashboard(render);
    dashboard.render(app);
  } else {
    const login = new Login(render);
    login.render(app);
  }
}

render();