



let apiKey;
let username;
let senha1;
let Botaologin = document.getElementById('botaoLogin');
let BotaoProcura = document.getElementById('botaoProcura');
let BlocoProcura = document.getElementById('blocoProcura');
let apikey = document.getElementById('api-key');
let Titulo = document.getElementById('p-Titulo');



/*PRENCHIMENTO
    LOGIN*/
function preencherLogin() {
    let login = document.getElementById('login');
    username = login.value;
    validateLoginButton();
}


/*PRENCHIMENTO
     SENHA*/
function preencherSenha() {
    let senha2 = document.getElementById('senha2');
    senha1 = senha2.value;
    validateLoginButton();
}
//input apikey - receiving value validate login button
function preencherApi() {
    apiKey = apikey.value;
    validateLoginButton();
}
//validate login button
function validateLoginButton() {
    if (senha1 && username && apiKey) {
        Botaologin.disabled = false;
    }
    else {
        Botaologin.disabled = true;
    }
}
//method Search Films in API
function procurarFilme(query) {
    return __awaiter(this, void 0, void 0, function* () {
        query = encodeURI(query);
        console.log(query);
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`,
            method: "GET"
        });
        return result;
    });
}
// fill container with list of movies
if (BotaoProcura) {
    BotaoProcura.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
        let ListaProcura = document.getElementById("listaProcura");
        if (ListaProcura) {
            ListaProcura.outerHTML = "";
            Titulo.hidden = true;
        }
        let query = document.getElementById('search');
        let listaFilmes = yield procurarFilme(query.value);
        // let ul = document.createElement('ul');
        let div = document.createElement('div');
        div.id = "listasearch";
        for (const item of listaFilmes.results) {
            let i = document.createElement('i');
            let imagem = document.createElement('img');
            let a = document.createElement('a');
            let imglink = `https://image.tmdb.org/t/p/w500/` + item.poster_path;
            div.setAttribute("style", "display:flex; flex-direction:column; align-content:center;");
            imagem.setAttribute("src", imglink);
            imagem.setAttribute("style", "border: solid 1px #000; float: left; margin-right:10px;");
            imagem.height = 90;
            i.setAttribute("href", imglink);
            i.setAttribute("target", "_blank");
            i.setAttribute("title", "click to see enlarged image");
            i.setAttribute("style", " line-height:100px; float: left; font-size:12px; font-family: Arial, Helvetica, sans-serif; color:#000;");
            document.body.appendChild(div);
            document.body.appendChild(i);
            i.appendChild(imagem);
            //i.appendChild(document.createTextNode(item.original_title + '  |  id.(' + item.id + ')'));
            i.appendChild(i);
            div.appendChild(i);
        }
        if (Titulo) {
            Titulo.hidden = false;
        }
        console.log(listaFilmes);
        if (BlocoProcura) {
            BlocoProcura.appendChild(div);
        }
    }));
}
//fill body of site
class HttpClient {
    static get({ url, method, body = null }) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let requer = new XMLHttpRequest();
                requer.open(method, url, true);
                requer.onload = () => {
                    if (requer.status >= 200 && requer.status < 300) {
                        resolve(JSON.parse(requer.responseText));
                    }
                    else {
                        reject({
                            status: requer.status,
                            statusText: requer.statusText
                        });
                    }
                };
                requer.onerror = () => {
                    reject({
                        status: requer.status,
                        statusText: requer.statusText
                    });
                };
                if (body) {
                    requer.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                    body = JSON.stringify(body);
                }
                requer.send(body);
            });
        });
    }
}
