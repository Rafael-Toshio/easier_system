// Scripts da tela de login (login.html)
const API = 'http://localhost:3001/api';
let tipoAtual = 'cliente';

function setTipo(tipo) {
  tipoAtual = tipo;
  document.querySelectorAll('.tab-btn').forEach((b, i) => {
    b.classList.toggle('active', (i === 0 && tipo === 'cliente') || (i === 1 && tipo === 'funcionario'));
  });
}

function toggleSenha() {
  const input = document.getElementById('senha');
  input.type = input.type === 'password' ? 'text' : 'password';
}

function showMsg(texto, tipo) {
  const el = document.getElementById('msg');
  el.textContent = texto;
  el.className = 'msg ' + tipo;
}

async function fazerLogin(e) {
  e.preventDefault();
  const btn = document.getElementById('btnLogin');
  btn.disabled = true;
  btn.textContent = 'ENTRANDO...';

  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  try {
    const res = await fetch(`${API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha, tipo: tipoAtual })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      showMsg('Login realizado! Redirecionando...', 'ok');

      const destino = data.usuario.tipo === 'funcionario'
        ? '../../administrador/funcionario.html'
        : '../dashboard/dashboard.html';

      setTimeout(() => { window.location.href = destino; }, 1200);
    } else {
      showMsg(data.erro || 'Erro ao fazer login.', 'erro');
    }
  } catch (err) {
    showMsg('Não foi possível conectar ao servidor.', 'erro');
  } finally {
    btn.disabled = false;
    btn.textContent = 'ENTRAR';
  }
}
