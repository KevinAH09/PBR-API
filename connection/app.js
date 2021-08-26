require('isomorphic-fetch');
const puppeteer = require("puppeteer");
const fs = require('fs');
const colors = require("colors");

var graphCoolEndpoint = 'http://localhost:3000/graphql';
var num = 2;

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
              accessToken,
              id
            }
          }
      `
        }),
    }).then(function (response) {
        return response.json();
    }).then((data) => {
        const token = data.data.Login.accessToken;
        const idUsuario=data.data.Login.id;
        console.log(data.data);
        botBCR(token,idUsuario);
    });
};

const savePropiedades = async (tok, fol, descripcion, idUsuario,pais, divPrimaria, divSecundaria, divTerciaria, divCuaternaria, dirrecion, geolocalizacion) => {
    
    //   -------------
    const saveLocalizacion = await fetch(graphCoolEndpoint, {
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'bearer ' + tok
        },
        method: 'POST',
        body: JSON.stringify({
            query: `
      mutation{
          createLocalizacion(data:{pais:"${pais}",divPrimaria:"${divPrimaria}",divSecundaria:"${divSecundaria}",divTerciaria:"${divTerciaria}",divCuaternaria:"${divCuaternaria}",direccion:"${dirrecion}",geolocalizacion:"${geolocalizacion}"}){id}
      }`
        }),
    })
    const responseSaveLocalizacion = await saveLocalizacion.json();
    console.log(responseSaveLocalizacion);
    const idLocalizacion =  responseSaveLocalizacion.data.createLocalizacion.id;

    // ----
    const savePropiedad = await fetch(graphCoolEndpoint, {
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'bearer ' + tok
        },
        method: 'POST',
        body: JSON.stringify({
            query: `
      mutation{
        createPropiedad(data:{numero:"${fol}",localizacion:${idLocalizacion},usuario:${idUsuario},descripcion: "${descripcion}"}){id}
       }`
        }),
    })
    const responseSavePropiedad = await savePropiedad.json();
    console.log(responseSavePropiedad);
};
// const saveLocalizacion = async (tok, pais, divPrimaria, divSecundaria, divTerciaria, divCuaternaria, dirrecion, geolocalizacion) => {
//     const response2 = await fetch(graphCoolEndpoint, {
//         headers: {
//             'Content-Type': 'application/json',
//             'authorization': 'bearer ' + tok
//         },
//         method: 'POST',
//         body: JSON.stringify({
//             query: `
//         mutation{
//             createLocalizacion(data:{pais:"${pais}",divPrimaria:"${divPrimaria}",divSecundaria:"${divSecundaria}",divTerciaria:"${divTerciaria}",divCuaternaria:"${divCuaternaria}",direccion:"${dirrecion}",geolocalizacion:"${geolocalizacion}"}){id}
//         }`
//         }),
//     })
//     const responseJson2 = await response2.json();
//     console.log(responseJson2.data);
//     savePropiedad()

// };
//   const save= async (token,pais,divPrimaria,divSecundaria,divTerciaria,divCuaternaria,dirrecion,geolocalizacion) => {
//     const response2 = await fetch(graphCoolEndpoint, {
//       headers: {
//         'Content-Type': 'application/json',
//         'authorization': 'bearer ' + tok
//       },
//       method: 'POST',
//       body: JSON.stringify({
//         query: `
//         mutation{
//             createLocalizacion(data:{pais:"${pais}",divPrimaria:"${divPrimaria}",divSecundaria:"${divSecundaria}",divTerciaria:"${divTerciaria}",divCuaternaria:"${divCuaternaria}",direccion:"${dirrecion}",geolocalizacion:"${geolocalizacion}"}){id}
//         }`
//       }),
//     })
//     const responseJson2 = await response2.json();
//     console.log(responseJson2.data);

//   };


async function botBCR(token,idUsuario) {
    try {
        console.log("Iniciando el bot".blue);
        // abrir chrome
        const browser = await puppeteer.launch({
            headless: false,
            devtools: true,
        });
        // abrir page
        const page = await browser.newPage();
        await page.goto("https://ventadebienes.bancobcr.com/wps/portal/bcrb/bcrbienes/bienes/terrenos?&tipo_propiedad=3");
        await page.waitForSelector("div[class='table-cell binesCell']", {
            visible: true,
        });

        console.log("Cargo".blue);
        // await page.click("div[class='table-cell binesCell'][2] > div > div > a");
        const divCont = await page.$$("div[class='table-cell binesCell']");
        const cont = divCont.length;
        for (let i = 0; i < cont; i++) {
            const divs = await page.$$("div[class='table-cell binesCell']");
            const div = divs[i];
            const a = await div.$('a');
            await a.click();
            // --------------dowload IMG-------------------------------------------------------------
            await page.waitForSelector("label[class='textType2 strongText mainTitle']", {
                visible: true,
            });
            const listImg = await page.evaluate(() => {
                const list = document.querySelector("div[class='table-cell cell55 imageList']").querySelectorAll("a[href='#myGallery']");
                const srcs = [];
                list.forEach(element => {
                    srcs.push(element.children[0].src);
                });
                return srcs;

            });
            console.log(listImg);
            for (let j = 0; j < listImg.length; j++) {
                var viewSource = await page.goto(listImg[j]);
                fs.writeFile("./src/img/" + i + j + ".jpg", await viewSource.buffer(), function (err) {
                    if (err) {
                        return console.log(err);
                    }

                });
                await page.goBack();
            };
            // -----------------------GET Text----------------------------------------------------
            await page.waitForSelector("label[class='textType2 strongText mainTitle']", {
                visible: true,
            });
            const ProvinciaCanton = await page.evaluate((x) => {
                if (document.querySelector("label[class='textType2 strongText mainTitle']") != null) {
                    return document.querySelector("label[class='textType2 strongText mainTitle']").textContent;
                }
                return "";
            });
            console.log(ProvinciaCanton);
            const folio = await page.evaluate((x) => {
                if (document.querySelector("label[class='textType3 strongText']") != null) {
                    return document.querySelector("label[class='textType3 strongText']").textContent
                }
                return "";
            });
            console.log(folio);
            const distrito = await page.evaluate((x) => {
                if (document.querySelectorAll("p")[0] != null) {
                    return document.querySelectorAll("p")[0].textContent;
                }
                return "";
            });
            console.log(distrito);
            const direccionExacta = await page.evaluate((x) => {
                if (document.querySelectorAll("p")[1] != null) {
                    return document.querySelectorAll("p")[1].textContent;
                }
                return "";
            });
            console.log(direccionExacta);
            const descripcion = await page.evaluate((x) => {
                if (document.querySelectorAll("p")[2] != null) {
                    return document.querySelectorAll("p")[2].textContent;
                }
                return "";
            });
            console.log(descripcion);
            const tamano = await page.evaluate((x) => {
                if (document.querySelectorAll("div[class='table-row lineSpacing3']")[2].children[0].children[1] != null) {
                    return document.querySelectorAll("div[class='table-row lineSpacing3']")[2].children[0].children[1].textContent;
                }
                return "";
            });
            console.log(tamano);
            const precioIncial = await page.evaluate((x) => {
                if (document.querySelectorAll("label[class='strongText']")[0] != null) {
                    return document.querySelectorAll("label[class='strongText']")[0].textContent;
                }
                return "";
            });
            console.log(precioIncial);
            const descuento = await page.evaluate((x) => {
                if (document.querySelectorAll("label[class='strongText']")[1] != null) {
                    return document.querySelectorAll("label[class='strongText']")[1].textContent;
                }
                return "";
            });
            console.log(descuento);
            const montoDescuento = await page.evaluate((x) => {
                if (document.querySelectorAll("label[class='strongText']")[2] != null) {
                    return document.querySelectorAll("label[class='strongText']")[2].textContent;
                }
                return "";
            });
            console.log(montoDescuento);
            const precioFinal = await page.evaluate((x) => {
                if (document.querySelectorAll("label[class='strongText']")[3] != null) {
                    return document.querySelectorAll("label[class='strongText']")[3].textContent;
                }
                return "";
            });
            console.log(precioFinal);
            const coordenadas = await page.evaluate((x) => {
                if (document.querySelector("div[class='table-row mapDetailSeccionBox lineSpacing3']") != null) {
                    let str = document.querySelector("div[class='table-row mapDetailSeccionBox lineSpacing3']").children[0].children[0].src;
                    return str.split('q=').pop().split('&key')[0];
                }
                return "No entro";
            });

            console.log(coordenadas);
            savePropiedades(token, folio,descripcion,idUsuario,"Costa Rica",ProvinciaCanton.split(",")[0],ProvinciaCanton.split(",")[1],distrito,"",direccionExacta,coordenadas);

            console.log("-------------------------------------------".red);
            await page.goBack();
            await page.waitForSelector("div[class='table-cell binesCell']", {
                visible: true,
            });
        }
    } catch (error) {
        console.log(error);
    }

}
iniciarSesion("cfugusvq@hotmail.com", "12345");




