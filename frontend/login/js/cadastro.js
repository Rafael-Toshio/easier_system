// Scripts da tela de cadastro (cadastro.html)
const API = 'http://localhost:3001/api';
let tipoAtual = 'cliente';

function setTipo(tipo) {
  tipoAtual = tipo;
  document.querySelectorAll('.tab-btn').forEach((b, i) => {
    b.classList.toggle('active', (i === 0 && tipo === 'cliente') || (i === 1 && tipo === 'funcionario'));
  });
  document.getElementById('campoCargo').style.display = tipo === 'funcionario' ? 'flex' : 'none';
}

function toggleSenha(id) {
  const input = document.getElementById(id);
  input.type = input.type === 'password' ? 'text' : 'password';
}

function showMsg(texto, tipo) {
  const el = document.getElementById('msg');
  el.textContent = texto;
  el.className = 'msg ' + tipo;
}

async function cadastrar(e) {
  e.preventDefault();
  const btn = document.getElementById('btnCadastrar');
  btn.disabled = true;
  btn.textContent = 'CADASTRANDO...';

  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const cpf = document.getElementById('cpf').value;
  const telefone = document.getElementById('telefone').value;
  const cargo = document.getElementById('cargo') ? document.getElementById('cargo').value : '';
  const senha = document.getElementById('senha').value;
  const confirmar = document.getElementById('confirmar').value;

  if (senha !== confirmar) {
    showMsg('As senhas não coincidem.', 'erro');
    btn.disabled = false;
    btn.textContent = 'CADASTRAR';
    return;
  }

  try {
    const res = await fetch(`${API}/cadastro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, cpf, telefone, cargo, senha, tipo: tipoAtual })
    });
    const data = await res.json();
    if (res.ok) {
      showMsg('Cadastro realizado! Redirecionando para login...', 'ok');
      setTimeout(() => { window.location.href = 'login.html'; }, 1200);
    } else {
      showMsg(data.erro || 'Erro ao cadastrar.', 'erro');
    }
  } catch (err) {
    showMsg('Não foi possível conectar ao servidor.', 'erro');
  } finally {
    btn.disabled = false;
    btn.textContent = 'CADASTRAR';
  }
}
