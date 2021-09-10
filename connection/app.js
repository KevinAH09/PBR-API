require('isomorphic-fetch');
const puppeteer = require("puppeteer");
const fs = require('fs');

var graphCoolEndpoint = 'http://localhost:3000/graphql';
//Conexion a Api PBR, para que el bot obtenga el token con el cual ingresara informacion a la base de datos
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
        const idUsuario = data.data.Login.id;
        console.log(data.data);
        botBCR(token, idUsuario);
    });
};
//Funcion para guardar los datos de la propiedad
async function savePropiedades(tok, fol, descripcion, tamano, idUsuario, pais, divPrimaria, divSecundaria, divTerciaria, divCuaternaria, dirrecion, geolocalizacion, precioIncial, precioFinal, AgenteVenta, TelefonoAgenteVenta, EmailAgenteVenta) {

    //Se guarda la localizacion de la propiedad
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
    const idLocalizacion = responseSaveLocalizacion.data.createLocalizacion.id;

    // Se guarda la propiedad con los datos basicos
    const savePropiedad = await fetch(graphCoolEndpoint, {
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'bearer ' + tok
        },
        method: 'POST',
        body: JSON.stringify({
            query: `
      mutation{
        createPropiedad(data:{numero:"${fol}",localizacion:${idLocalizacion},extension:"${tamano}",categoria:1,usuario:${idUsuario},descripcion: "${descripcion}"}){id}
       }`
        }),
    })
    const responseSavePropiedad = await savePropiedad.json();
    console.log(responseSavePropiedad);
    const idPropiedad = responseSavePropiedad.data.createPropiedad.id;
    //Se guarda el propiedatrio de la propiedad, en este caso es el agente de dicha propiedad.
    const savePropieTario = await fetch(graphCoolEndpoint, {
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'bearer ' + tok
        },
        method: 'POST',
        body: JSON.stringify({
            query: `
            mutation{
                createPropietario(data:{nombre:"${AgenteVenta}",email:"${EmailAgenteVenta}",telefono:"${TelefonoAgenteVenta}"}){id}
              }`
        }),
    })
    const responsesavePropieTario = await savePropieTario.json();
    console.log(responsesavePropieTario);
    const idPropietario = responsesavePropieTario.data.createPropietario.id;
    // Se guarda la propiedad y el propietario en la realcion intermediaria
    const savePropieTarioPropiedad = await fetch(graphCoolEndpoint, {
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'bearer ' + tok
        },
        method: 'POST',
        body: JSON.stringify({
            query: `
            mutation{
                createPropiedadPropietario(data:{propiedadId:${idPropiedad},propietarioId:${idPropietario}}){creado}
              }`
        }),
    })
    const responsesavePropieTarioPropiedad = await savePropieTarioPropiedad.json();
    console.log(responsesavePropieTarioPropiedad);
    // Se guarda el precio inicial con el cual se vende la propiedad
    const savePrecioPropiedadIni = await fetch(graphCoolEndpoint, {
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'bearer ' + tok
        },
        method: 'POST',
        body: JSON.stringify({
            query: `
            mutation{
                createPrecio(data:{precio:"${precioIncial}",propiedad:${idPropiedad}}){id}
              }`
        }),
    });
    const responsesavePrecioPropiedadIni = await savePrecioPropiedadIni.json();
    console.log(responsesavePrecioPropiedadIni);
    // Se guarda el precio de descuento que posee dicha porpiedad, 2 segundos despues del precio inicial
    setTimeout(() => {
        fetch(graphCoolEndpoint, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'bearer ' + tok
            },
            method: 'POST',
            body: JSON.stringify({
                query: `
                mutation{
                    createPrecio(data:{precio:"${precioFinal}",propiedad:${idPropiedad}}){id}
                  }`
            }),
        });
    }, 2000);
}


// Metodo de scrapping, para barrer la pagina de remates de fincas del Banco de Costa Rica
async function botBCR(token, idUsuario) {
    try {
        console.log("Iniciando el bot");
        // se abre chrominuin
        const browser = await puppeteer.launch({
            headless: false,
            devtools: true,
        });
        // se la abre la pagina del Banco de costa rica
        const page = await browser.newPage();
        await page.goto("https://ventadebienes.bancobcr.com/wps/portal/bcrb/bcrbienes/bienes/terrenos?&tipo_propiedad=3");
        await page.waitForSelector("div[class='table-cell binesCell']", {
            visible: true,
        });

        console.log("Cargo la pagina");
        
        const divCont = await page.$$("div[class='table-cell binesCell']");//Se obtienen todos los div que contienen las propiedades de la pagina inical
        const cont = divCont.length;
        for (let i = 0; i < cont; i++) {
            const divs = await page.$$("div[class='table-cell binesCell']");
            const div = divs[i];
            const a = await div.$('a');
            await a.click();//Se redirige a cada propiedad
            // --------------se selecionan las imagenes de la propiedad y se guardan en lista-------------------------------------------------------------
            await page.waitForSelector("label[class='textType2 strongText mainTitle']", {
                visible: true,
            });
            console.log("Se empieza a barrer la propiedad "+i);
            console.log("Obtencion de datos de la propiedad...");
            // Se obtiene la provincia y el canton de la propiedad
            const ProvinciaCanton = await page.evaluate((x) => {
                if (document.querySelector("label[class='textType2 strongText mainTitle']") != null) {
                    return document.querySelector("label[class='textType2 strongText mainTitle']").textContent;
                }
                return "";
            });
            // Se obtiene el folio asignado por el Banco de Costa Rica
            const folio = await page.evaluate((x) => {
                if (document.querySelector("label[class='textType3 strongText']") != null) {
                    return document.querySelector("label[class='textType3 strongText']").textContent
                }
                return "";
            });
            // Se obtiene el distrito de la propiedad
            const distrito = await page.evaluate((x) => {
                if (document.querySelectorAll("p")[0] != null) {
                    return document.querySelectorAll("p")[0].textContent;
                }
                return "";
            });
            // Se obtiene la direccion exacta de la propiedad
            const direccionExacta = await page.evaluate((x) => {
                if (document.querySelectorAll("p")[1] != null) {
                    return document.querySelectorAll("p")[1].textContent;
                }
                return "";
            });
            // Se obtiene la descripcion de la propiedad
            const descripcion = await page.evaluate((x) => {
                if (document.querySelectorAll("p")[2] != null) {
                    return document.querySelectorAll("p")[2].textContent;
                }
                return "";
            });
            // Se obtiene la dimension de terreno de la propiedad
            const tamano = await page.evaluate((x) => {
                if (document.querySelectorAll("div[class='table-row lineSpacing3']")[2].children[0].children[1] != null) {
                    return document.querySelectorAll("div[class='table-row lineSpacing3']")[2].children[0].children[1].textContent;
                }
                return "";
            });
            // Se obtiene el precio inicial, sin descuento de la propiedad
            const precioIncial = await page.evaluate((x) => {
                if (document.querySelectorAll("label[class='strongText']")[0] != null) {
                    return document.querySelectorAll("label[class='strongText']")[0].textContent;
                }
                return "";
            });
            // Se obtiene el procentaje del descuento de la propiedad
            const descuento = await page.evaluate((x) => {
                if (document.querySelectorAll("label[class='strongText']")[1] != null) {
                    return document.querySelectorAll("label[class='strongText']")[1].textContent;
                }
                return "";
            });
            // Se obtiene el precio con el descuento incluido de la propiedad, con el descuento incluido
            const precioFinal = await page.evaluate((x) => {
                if (document.querySelectorAll("label[class='strongText']")[3] != null) {
                    return document.querySelectorAll("label[class='strongText']")[3].textContent;
                }
                return "";
            });
            // Se obtiene las coordenadas para google maps de la propiedad
            const coordenadas = await page.evaluate((x) => {
                if (document.querySelector("div[class='table-row mapDetailSeccionBox lineSpacing3']") != null) {
                    let str = document.querySelector("div[class='table-row mapDetailSeccionBox lineSpacing3']").children[0].children[0].src;
                    return str.split('q=').pop().split('&key')[0];
                }
                return "No entro";
            });
            
            // Se obtiene el agente de venta encargado de la propiedad
            const AgenteVenta = await page.evaluate((x) => {
                if (document.querySelector("div[class='table-row lineSpacing3 executiveDetailSeccionBox']") != null) {
                    return document.querySelector("div[class='table-row lineSpacing3 executiveDetailSeccionBox']").children[0].children[1].textContent;
                }
                return "No entro";
            });
            // Se obtiene el telefono con la extencio del agente encargado de la propiedad
            const TelefonoAgenteVenta = await page.evaluate((x) => {
                if (document.querySelector("div[class='table-row lineSpacing3 executiveDetailSeccionBox']") != null) {
                    return document.querySelector("div[class='table-row lineSpacing3 executiveDetailSeccionBox']").children[1].children[1].children[0].textContent;
                }
                return "No entro";
            });
            
            // Se obtiene el email del agente encargado de la propiedad
            const EmailAgenteVenta = await page.evaluate((x) => {
                if (document.querySelector("div[class='table-row lineSpacing3 executiveDetailSeccionBox']") != null) {
                    return document.querySelector("div[class='table-row lineSpacing3 executiveDetailSeccionBox']").children[2].children[1].children[0].textContent;
                }
                return "No entro";
            });
            
            //Se envia los datos a guardar en base de datos
            savePropiedades(token, folio, descripcion, tamano, idUsuario, "Costa Rica", ProvinciaCanton.split(",")[0], ProvinciaCanton.split(",")[1], distrito, "", direccionExacta, coordenadas, precioIncial, precioFinal, AgenteVenta, TelefonoAgenteVenta, EmailAgenteVenta);
            const listImg = await page.evaluate(() => {
                const list = document.querySelector("div[class='table-cell cell55 imageList']").querySelectorAll("a[href='#myGallery']");
                const srcs = [];
                list.forEach(element => {
                    srcs.push(element.children[0].src);
                });
                return srcs;

            });
            console.log("Descarga de imagenes...");
            // Se recorre la lsita de imagenes para descragarlas, en el servidor-------------------------------------------------------------
            for (let j = 0; j < listImg.length; j++) {
                var viewSource = await page.goto(listImg[j]);
                fs.writeFile("./src/img/" + i + j + ".jpg", await viewSource.buffer(), function (err) {
                    if (err) {
                        return console.log(err);
                    }

                });
                await page.goBack();
            };
            // Se detiene el codigo, en espera de que la pagina carge---------------------------------------
            await page.waitForSelector("label[class='textType2 strongText mainTitle']", {
                visible: true,
            });
            console.log("Se termina a barrer la propiedad "+i);
            
            await page.goBack();
            await page.waitForSelector("div[class='table-cell binesCell']", {
                visible: true,
            });

        }
        console.log("Finaliza el bot");
    } catch (error) {
        console.log(error);
    }

}

iniciarSesion("cfugusvq@hotmail.com", "12345");




