require('isomorphic-fetch');

fetch('http://localhost:3000/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: `
    query{
        TipoServicios{
            id
        }
    }` 
  }),
})
.then(res => res.json())
.then(res => console.log(res.data));