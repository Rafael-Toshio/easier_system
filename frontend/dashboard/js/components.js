// Carrega componentes HTML comuns (sidebar, header, footer) nas páginas
function loadComponent(id, url) {
  fetch(url)
    .then(res => res.text())
    .then(html => { document.getElementById(id).innerHTML = html; })
    .catch(() => { document.getElementById(id).innerHTML = '<div style="color:red">Erro ao carregar componente: ' + url + '</div>'; });
}

document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('sidebar-component'))
    loadComponent('sidebar-component', '../components/sidebar.html');
  if (document.getElementById('header-component'))
    loadComponent('header-component', '../components/header.html');
  if (document.getElementById('footer-component'))
    loadComponent('footer-component', '../components/footer.html');
});
