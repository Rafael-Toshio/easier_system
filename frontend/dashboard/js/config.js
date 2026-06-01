
// Tema claro/escuro
function setTheme(theme) {
	if (theme === 'dark') {
		document.documentElement.classList.add('dark-mode');
		localStorage.setItem('theme', 'dark');
		document.getElementById('theme-toggle').textContent = 'Modo Claro';
		document.getElementById('theme-label').textContent = 'Modo escuro ativado';
	} else {
		document.documentElement.classList.remove('dark-mode');
		localStorage.setItem('theme', 'light');
		document.getElementById('theme-toggle').textContent = 'Modo Escuro';
		document.getElementById('theme-label').textContent = 'Modo claro ativado';
	}
}

function toggleTheme() {
	const current = localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
	setTheme(current === 'dark' ? 'light' : 'dark');
}


// Aguarda o carregamento dos components antes de inicializar o tema
function waitForThemeButton() {
	const btn = document.getElementById('theme-toggle');
	if (btn) {
		setTheme(localStorage.getItem('theme') === 'dark' ? 'dark' : 'light');
	} else {
		setTimeout(waitForThemeButton, 50);
	}
}
document.addEventListener('DOMContentLoaded', waitForThemeButton);