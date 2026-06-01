const usuario = JSON.parse(
  localStorage.getItem('usuario')
);

if(!usuario){

  window.location.href = '../login/login.html';

}

console.log(usuario);