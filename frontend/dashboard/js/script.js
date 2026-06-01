// === Conteúdo extraído da tag <script> do HTML ===
let tickets = [
  { id: 'CHM-001', titulo: 'Problema no ar-condicionado', categoria: 'Manutenção', status: 'Em andamento', data: '04/06/2026', hora: '10:30', desc: 'O ar-condicionado do veículo não está resfriando corretamente. Mesmo com o sistema ligado no máximo, a temperatura interna não baixa.' },
  { id: 'CHM-002', titulo: 'Dúvida sobre revisão periódica', categoria: 'Revisão Periódica', status: 'Concluído', data: '03/06/2026', hora: '15:20', desc: 'Gostaria de saber quando devo realizar a próxima revisão e quais itens são verificados no pacote básico.' },
  { id: 'CHM-003', titulo: 'Verificação do freio ABS', categoria: 'Manutenção', status: 'Concluído', data: '28/05/2026', hora: '09:00', desc: 'Luz de alerta do ABS acendeu no painel. Preciso de inspeção urgente.' },
];

let nextId = 4;

function showPage(pageId, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + pageId).classList.add('active');
  if (btn) btn.classList.add('active');
  if (pageId === 'chamados') renderAllTickets();
  if (pageId === 'inicio') renderRecent();
  updateCounts();
}

document.querySelector('[onclick*="chamados"]').setAttribute('data-page', 'chamados');

function getBadgeClass(status) {
  const map = { 'Em andamento': 'badge-andamento', 'Concluído': 'badge-concluido', 'Aberto': 'badge-aberto', 'Cancelado': 'badge-cancelado' };
  return map[status] || 'badge-aberto';
}

function renderRecent() {
  const list = document.getElementById('recent-list');
  const recent = tickets.slice(0, 3);
  if (recent.length === 0) {
    list.innerHTML = '<div class="no-results">Nenhum chamado encontrado.</div>';
    return;
  }
  list.innerHTML = recent.map(t => `
    <div class="ticket-item" onclick="openDetalhe('${t.id}')">
      <div class="ticket-info">
        <div class="ticket-title">${t.titulo}</div>
        <div class="ticket-date">Aberto em ${t.data} às ${t.hora}</div>
      </div>
      <div class="ticket-right">
        <span class="badge ${getBadgeClass(t.status)}">${t.status}</span>
        <span class="ticket-arrow">›</span>
      </div>
    </div>
  `).join('');
}

function renderAllTickets(filtered) {
  const data = filtered !== undefined ? filtered : tickets;
  const body = document.getElementById('tickets-table-body');
  const noRes = document.getElementById('no-results');
  if (data.length === 0) {
    body.innerHTML = '';
    noRes.style.display = 'block';
    return;
  }
  noRes.style.display = 'none';
  body.innerHTML = data.map(t => `
    <div class="ticket-row" onclick="openDetalhe('${t.id}')">
      <div>
        <div class="ticket-title">${t.titulo}</div>
        <div class="ticket-id">${t.id}</div>
        <div style="font-size:12px;color:#888;">
          ${t.marca ? 'Marca: ' + t.marca + ' | ' : ''}
          ${t.modelo ? 'Modelo: ' + t.modelo + ' | ' : ''}
          ${t.placa ? 'Placa: ' + t.placa : ''}
        </div>
      </div>
      <div class="ticket-category">${t.categoria}</div>
      <div class="ticket-date-col">${t.data} às ${t.hora}</div>
      <span class="badge ${getBadgeClass(t.status)}">${t.status}</span>
    </div>
  `).join('');
}

function updateCounts() {
  document.getElementById('count-total').textContent = tickets.length;
  document.getElementById('count-andamento').textContent = tickets.filter(t => t.status === 'Em andamento' || t.status === 'Aberto').length;
  document.getElementById('count-concluido').textContent = tickets.filter(t => t.status === 'Concluído').length;
}

function filterTickets() {
  const q = document.getElementById('search-input').value.toLowerCase();
  const s = document.getElementById('filter-status').value;
  const filtered = tickets.filter(t => {
    const matchText = t.titulo.toLowerCase().includes(q) || t.categoria.toLowerCase().includes(q) || t.id.toLowerCase().includes(q);
    const matchStatus = !s || t.status === s;
    return matchText && matchStatus;
  });
  renderAllTickets(filtered);
}


// Novo fluxo: abrir modal de categoria
function openNewModal() {
  document.getElementById('modal-categoria').classList.add('open');
}

// Seleciona categoria e avança para etapa 2
function selectCategoria(categoria) {
  closeModal('modal-categoria');
  document.getElementById('new-categoria').value = categoria;
  document.getElementById('new-titulo').value = '';
  document.getElementById('new-marca').value = '';
  document.getElementById('new-modelo').value = '';
  document.getElementById('new-placa').value = '';
  document.getElementById('new-desc').value = '';
  document.getElementById('modal-novo').classList.add('open');
}


function submitNewTicket() {
  const titulo = document.getElementById('new-titulo').value.trim();
  const categoria = document.getElementById('new-categoria').value;
  const marca = document.getElementById('new-marca').value.trim();
  const modelo = document.getElementById('new-modelo').value.trim();
  const placa = document.getElementById('new-placa').value.trim();
  const desc = document.getElementById('new-desc').value.trim();
  if (!titulo || !categoria || !marca || !modelo || !placa) {
    showToast('Preencha todos os campos obrigatórios.');
    return;
  }
  const now = new Date();
  const data = now.toLocaleDateString('pt-BR');
  const hora = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const id = 'CHM-00' + (nextId++);
  tickets.unshift({ id, titulo, categoria, marca, modelo, placa, status: 'Aberto', data, hora, desc: desc || 'Sem descrição.' });
  closeModal('modal-novo');
  renderAllTickets();
  renderRecent();
  updateCounts();
  showToast('✓ Chamado aberto com sucesso!');
}

function openDetalhe(id) {
  const t = tickets.find(x => x.id === id);
  if (!t) return;
  document.getElementById('detalhe-content').innerHTML = `
    <div class="detail-field"><div class="detail-label">ID</div><div class="detail-value" style="font-family:'DM Mono',monospace">${t.id}</div></div>
    <div class="detail-field"><div class="detail-label">Título</div><div class="detail-value">${t.titulo}</div></div>
    <div class="detail-field"><div class="detail-label">Categoria</div><div class="detail-value">${t.categoria}</div></div>
    <div class="detail-field"><div class="detail-label">Marca</div><div class="detail-value">${t.marca || '-'}</div></div>
    <div class="detail-field"><div class="detail-label">Modelo</div><div class="detail-value">${t.modelo || '-'}</div></div>
    <div class="detail-field"><div class="detail-label">Placa</div><div class="detail-value">${t.placa || '-'}</div></div>
    <div class="detail-field"><div class="detail-label">Status</div><span class="badge ${getBadgeClass(t.status)}">${t.status}</span></div>
    <div class="detail-field"><div class="detail-label">Aberto em</div><div class="detail-value">${t.data} às ${t.hora}</div></div>
    <div class="detail-field"><div class="detail-label">Descrição</div><div class="detail-desc">${t.desc}</div></div>
  `;
  document.getElementById('modal-detalhe').classList.add('open');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

document.querySelectorAll('.modal-overlay').forEach(o => {
  o.addEventListener('click', e => { if (e.target === o) o.classList.remove('open'); });
});

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

function handleSair() {
  showToast('Saindo da conta...');
  localStorage.clear();
  setTimeout(() => { 
    window.location.href = '../login/login.html'; 
  }, 1200);
}

function toggleDropdown() {
  const dd = document.getElementById('user-dropdown');
  const chevron = document.getElementById('dropdown-chevron');
  const isOpen = dd.classList.contains('open');
  dd.classList.toggle('open', !isOpen);
  chevron.classList.toggle('open', !isOpen);
}

function closeDropdown() {
  document.getElementById('user-dropdown').classList.remove('open');
  document.getElementById('dropdown-chevron').classList.remove('open');
}

function openConfiguracoes() {
  window.location.href = 'config.html';
}

document.addEventListener('click', function(e) {
  const wrapper = document.getElementById('user-dropdown-wrapper');
  if (!wrapper.contains(e.target)) closeDropdown();
});

renderRecent();
updateCounts();
