const fs= require("fs");
const http=require("http");
const url = require("url");
const path= require("path");

function calcoloTotale(prodotti,quantita) {
    const prezziProdotti = {
        farina: 3,
        pasta: 8,
        latte: 4,
        uova: 6,
        olio: 5,
    };
    let totale=0;

    if (prodotti && Array.isArray(prodotti)) {
        
        for (let i = 0; i < prodotti.length; i++) {
            const prodotto=prodotti[i];
            totale+=prezziProdotti[prodotto];
        }

        
    }

    return totale*quantita;
}

function requestHandler(request,response){
    let oggettoUrl=url.parse(request.url,"true");
    let percorsoFile="."+oggettoUrl.pathname;
    console.log(percorsoFile);
    if (percorsoFile==="./") {
        percorsoFile="./index.html";
    }

    const extname=path.extname(percorsoFile);
    console.log(extname);
    let estensioneFile;
    switch (extname) {
        case ".html":
            estensioneFile="text/html";
            break;

        case ".css":
            estensioneFile="text/css";
            break;

        case ".js":
            estensioneFile="text/javascript";
            break;
        
        case ".jpg":
            estensioneFile="image/jpg";
            break;

        case ".img":
            estensioneFile="image/img";
            break;

        case ".png":
            estensioneFile="image/png";
            break;
    }

    if (percorsoFile=="./recuperaDati") {
        let messaggio="";
        let errors = "";
        let invia=false;

        const listaProdotti=oggettoUrl.query.prodotto;
        const quantita=oggettoUrl.query.Quantita;
        const regexNumber= /^[0-9]+$/;


        if (!listaProdotti) {
            invia=true;
            errors+=`
                <input type="checkbox" name="prodotto" id="prodotto1" value="farina">
                <label for="prodotto1" class="errorLabels">farina 3$</label><br>
                <input type="checkbox" name="prodotto" id="prodotto2" value="pasta">
                <label for="prodotto2" class="errorLabels">Pasta 8$</label><br>
                <input type="checkbox" name="prodotto" id="prodotto3" value="latte">
                <label for="prodotto3" class="errorLabels">latte 4$</label><br>
                <input type="checkbox" name="prodotto" id="prodotto4" value="uova">
                <label for="prodotto4" class="errorLabels">uova 6$</label><br>
                <input type="checkbox" name="prodotto" id="prodotto5" value="olio">
                <label for="prodotto5" class="errorLabels">olio 5$</label><br>
            `;
        }
        else{
            errors+=`
            <input type="checkbox" name="prodotto" id="prodotto1" value="farina">
            <label for="prodotto1">farina 3$</label><br>
            <input type="checkbox" name="prodotto" id="prodotto2" value="pasta">
            <label for="prodotto2">Pasta 8$</label><br>
            <input type="checkbox" name="prodotto" id="prodotto3" value="latte">
            <label for="prodotto3">latte 4$</label><br>
            <input type="checkbox" name="prodotto" id="prodotto4" value="uova">
            <label for="prodotto4">uova 6$</label><br>
            <input type="checkbox" name="prodotto" id="prodotto5" value="olio">
            <label for="prodotto5">olio 5$</label><br>
            `;
        }

        if (!regexNumber.test(quantita) || !quantita) {
            invia=true;
            errors+=`
            <label for="Quantita">Quantita che vuoi acquistare</label><br>
            <input class="error" type="text" id="Quantita" name="quantita" value="inserisci una quantita"><br>
            `;
        }
        else{
            errors+=`
            <label for="Quantita">Quantita che vuoi acquistare</label><br>
            <input type="text" id="Quantita" name="Quantita" value="${quantita}"><br>
            `;
        }

        if (invia) {
            messaggio+=`<!DOCTYPE html>
        <html lang="it">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="/css/Style.css">
            <title>negozio</title>
        </head>
        <body>
            <header>
                <h2>Negozio Bello</h2>
            </header>
        
            <section>
                <nav>
                    <ul>
                        <li><a href="#">contatti</a></li>
                        <li><a href="#">accedi</a></li>
                        <li><a href="#">assistenza</a></li>
                    </ul>
                </nav>
          
                <article>
                    <img src="/img/Canardbusiness.png" alt="business duck" id="img1">
                    <form action="recuperaDati" method="get">
                    <p>e' proprio un bel negozio</p><br>

                    ${errors}

                    <input type="submit">

                    </form>

                </article>
            </section>
        
            <footer>
                <p>fatto da simone siepi</p>
            </footer>
        
        </body>
        </html>`;

            response.writeHead(200,{'Content-Type': 'text/html'});
            response.write(messaggio);
            response.end();
        }
        else{
            let costoTotale=calcoloTotale(listaProdotti,quantita);
            messaggio=`<!DOCTYPE html>
            <html lang="it">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>costo totale</title>
            </head>
            <body>
                <h1>Costo totale</h1><br>
                <p>hai comprato ${listaProdotti} per una quantita di ${quantita} pagando un totale ${costoTotale} $</p>
            </body>
            </html>`;
            response.writeHead(200,{'Content-Type': 'text/html'});
            response.write(messaggio);
            response.end();
            
        }
    }
    
    fs.readFile(percorsoFile,function(error,data){
        if (error) {
            response.writeHead(404);
            response.write("pagina non trovata");
        }else{
            response.writeHead(200,{"content-Type":estensioneFile});
            response.write(data,"utf8");
        }
        response.end(); 
    });
}

const porta=3000;
const server=http.createServer(requestHandler);
server.listen(porta, ()=>{console.log(`server in ascolto su http://localhost:${porta}`)});