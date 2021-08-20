require('isomorphic-fetch');


// fetch('http://localhost:3000/graphql', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify({
//     query: `
//     query{
//         TipoServicios{
//             id
//         }
//     }`
//   }),
// })
//   .then(res => res.json())
//   .then(res => console.log(res.data));

var graphCoolEndpoint = 'http://localhost:3000/graphql';
var num=2;

function iniciarSesion(user, password) {
  fetch(graphCoolEndpoint, {
    headers: { 'content-type': 'application/json' },
    method: 'POST',
    body: JSON.stringify({
      query: `mutation{
            Login(
              email:"${user}" 
              password:"${password}")
              {
              accessToken
            }
          }
      `
    }),
  }).then(function (response) {
    return response.json();
  }).then((data) => {
    obtenerUsuariosPorid(num, data.data.Login.accessToken);
  });  
};

const obtenerUsuariosPorid = async (id, tok) => {
  const response2 = await fetch(graphCoolEndpoint, {
    headers: {
      'Content-Type': 'application/json',
      'authorization': 'bearer ' + tok
    },
    method: 'POST',
    body: JSON.stringify({
      query: `
    query{
        UsuarioById(id:${id})
        {nombre email}
      }`
    }),
  })
  const responseJson2 = await response2.json();
  console.log(responseJson2.data);

};

iniciarSesion("cfugusvq@hotmail.com", "12345");




