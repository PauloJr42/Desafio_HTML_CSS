// Um desenvolvedor tentou criar um projeto que consome a base de dados de filme do TMDB para criar um organizador 
// de filmes, mas desistiu pois considerou o seu código inviável. 
//Você consegue usar typescript para organizar esse código e a partir daí aprimorar o que foi feito?

// A ideia dessa atividade é criar um aplicativo que: 
// - Busca filmes
// - Apresenta uma lista com os resultados pesquisados
// - Permite a criação de listas de filmes e a posterior adição de filmes nela

// Todas as requisições necessárias para as atividades acima já estão prontas, mas a implementação delas ficou pela metade 
//(não vou dar tudo de graça).
// Atenção para o listener do botão login-button que devolve o sessionID do usuário
// É necessário fazer um cadastro no https://www.themoviedb.org/ e seguir a documentação do site para entender como gera uma 
//API key https://developers.themoviedb.org/3/getting-started/introduction
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};




var apiKey = "eed437133c744ed195e6622d61cd2585";
let apikey;
let requestToken;
let username = "paulosraiva@hotmail.com";
let password = "Nuttere@2021";
let sessionId;
let descricao;
let nomeDaLista;
let media_id;
let listId;

let loginButton = document.getElementById('login-button');
let searchButton = document.getElementById('search-button');
let searchContainer = document.getElementById('search-container');
let listButton = document.getElementById('list-button');
let addButton = document.getElementById('add-button');


function preencherSenha() {
 password = document.getElementById('senha').value;
 console.log(password);
 validateLoginButton();
}

function preencherLogin() {
 username = document.getElementById('login').value;
 console.log(username);
 validateLoginButton();
}

function preencherApi() {
 apiKey = document.getElementById('api-key').value;
 console.log(apiKey);
 validateLoginButton();
}


function validateLoginButton() {
 if (password && username && apiKey) {
 loginButton.disabled = false;
 } else {
 loginButton.disabled = true;
 }
}


loginButton.addEventListener('click', async () => {
    await criarRequestToken();
    await logar();
    await criarSessao();
    })

async function criarRequestToken () {
    let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/token/new?api_key=${apiKey}`,
    method: "GET"
    })
    requestToken = result.request_token;
    console.log("requesttotem " + requestToken);
   }

   async function logar() {
    await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=${apiKey}`,
    method: "POST",
    body: {
    username: `${username}`,
    password: `${password}`,
    request_token: `${requestToken}`,
    
    }
    })
   }

   async function criarSessao() {
    let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/session/new?api_key=${apiKey}`,
    method: "POST",
    body: {
        request_token: `${requestToken}`,
        
        }
    })
    sessionId = result.session_id;
    console.log("sessionID " + sessionId);
    apikey = apiKey;
   }

class HttpClient {
 static async get({url, method, body = null}) {
 return new Promise((resolve, reject) => {
 let request = new XMLHttpRequest();
 request.open(method, url, true);

 request.onload = () => {
 if (request.status >= 200 && request.status < 300) {
 resolve(JSON.parse(request.responseText));
 } else {
 reject({
 status: request.status,
 statusText: request.statusText
 })
 }
 }
 request.onerror = () => {
 reject({
 status: request.status,
 statusText: request.statusText
 })
 }

 if (body) {
 request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
 body = JSON.stringify(body);
 }
 request.send(body);
 })
 }
}

/*searchButton.addEventListener('click', async () => {
    let lista = document.getElementById("lista");
    if (lista) {
    lista.outerHTML = "";
    }
    let query = document.getElementById('search').value;
    let listaDeFilmes = await procurarFilme(query);
    let ul = document.createElement('ul');
    ul.id = "lista"
    for (const item of listaDeFilmes.results) {
    let li = document.createElement('li');
    li.appendChild(document.createTextNode(item.original_title))
    ul.appendChild(li)
    }
    console.log(listaDeFilmes);
    searchContainer.appendChild(ul);
   })*/

   function procurarFilme(query) {
    return __awaiter(this, void 0, void 0, function* () {
        query = encodeURI(query);
        console.log(query);
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/search/movie?api_key=${apikey}&query=${query}`,
            method: "GET"
        });
        return result;
    });
}

if (searchButton) {
    searchButton.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
        let listasearch = document.getElementById("listasearch");
        if (listasearch) {
            listasearch.outerHTML = "";
            titlefilm.hidden = true;
        }
        let query = document.getElementById('search');
        let listaDeFilmes = yield procurarFilme(query.value);
        let div = document.createElement('div');
        div.id = "listasearch";
        for (const item of listaDeFilmes.results) {
            let p = document.createElement('p');
            let img = document.createElement('img');
            let a = document.createElement('a');
            let imglink = `https://image.tmdb.org/t/p/w500/` + item.poster_path;
            div.setAttribute("style", "display:flex; flex-direction:column; align-content:center;");
            img.setAttribute("src", imglink);
            img.setAttribute("style", "border: solid 1px #000; float: left; margin-right:10px;");
            img.height = 90;
            a.setAttribute("href", imglink);
            a.setAttribute("target", "_blank");
            p.setAttribute("title", "click to see enlarged image");
            p.setAttribute("style", " line-height:100px; float: left; font-size:12px; font-family: Arial, Helvetica, sans-serif; color:#000;");
            document.body.appendChild(div);
            document.body.appendChild(a);
            p.appendChild(img);
            p.appendChild(document.createTextNode(item.original_title + '  |  id.(' + item.id + ')'));
            a.appendChild(p);
            div.appendChild(a);
        }
       
    }));
}


/*async function procurarFilme(query) {
 query = encodeURI(query)
 console.log(query)
 let result = await HttpClient.get({
 url: `https://api.themoviedb.org/3/search/movie?api_key=${apikey}&query=${query}`,
 method: "GET"
 })
 return result
}*/

async function adicionarFilme(filmeId) {
 let result = await HttpClient.get({
 url: `https://api.themoviedb.org/3/movie/${filmeId}?api_key=${apikey}&language=en-US`,
 method: "GET"
 })
 console.log(result);
}


function preencherName() {
    nomeDaLista = document.getElementById('name-list').value;
    console.log(nomeDaLista);

   }
   

function preencherDescricao() {
    descricao = document.getElementById('description-list').value;
    console.log(descricao);

   }
   


listButton.addEventListener('click', async () => {
    await criarLista();
    })



async function criarLista() {
 let result = await HttpClient.get({
 url: `https://api.themoviedb.org/3/list?api_key=${apikey}&session_id=${sessionId}`,
 method: "POST",
 body: {
 name: `${nomeDaLista}`,
 description: `${descricao}`,
 language: "pt-br"
 }
 })
 listId = result.list_id;
 console.log(listId);

}

function preencherMediaid() {
    media_id = document.getElementById('media-id').value;
    console.log(media_id);

   }

   addButton.addEventListener('click', async () => {
    await adicionarFilmeNaLista();
    })

async function adicionarFilmeNaLista() {
 let result = await HttpClient.get({
 url: `https://api.themoviedb.org/3/list/${listId}/add_item?api_key=${apikey}&session_id=${sessionId}`,
 method: "POST",
 body: {
 media_id: `${media_id}`,
 }
 })
 console.log(result);
}

async function pegarLista() {
 let result = await HttpClient.get({
 url: `https://api.themoviedb.org/3/list/${listId}?api_key=${apikey}`,
 method: "GET"
 })
 console.log(result);
}

{/* <div style="display: flex;">
 <div style="display: flex; width: 300px; height: 100px; justify-content: space-between; flex-direction: column;">
 <input id="login" placeholder="Login" onchange="preencherLogin(event)">
 <input id="senha" placeholder="Senha" type="password" onchange="preencherSenha(event)">
 <input id="api-key" placeholder="Api Key" onchange="preencherApi()">
 <button id="login-button" disabled>Login</button>
 </div>
 <div id="search-container" style="margin-left: 20px">
 <input id="search" placeholder="Escreva...">
 <button id="search-button">Pesquisar Filme</button>
 </div>
</div>*/}
