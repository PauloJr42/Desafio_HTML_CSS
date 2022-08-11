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






var apiKey 
let apikey
let requestToken
let username 
let password
let sessionId
let descricao
let nomeDaLista
let media_id
let listId


let loginButton:any = document.getElementById('login-button')
let searchButton = document.getElementById('search-button')
let searchContainerfilm = document.getElementById('search-container-film')
let listButton = document.getElementById('list-button')
let addButton = document.getElementById('add-button')




    function preencherLogin() {
        username = document.getElementById('login')
        console.log(username.value);
        validateLoginButton();
       }

function preencherSenha() {
 password = document.getElementById('senha')
 console.log(password.value);
 validateLoginButton();
}



function preencherApi() {
 apiKey = document.getElementById('api-key')
 console.log(apiKey.value);
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
    let result:any = await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/token/new?api_key=${apiKey.value}`,
    method: "GET",
    body:{

    }
    })
    requestToken = result.request_token;
    console.log("requesttotem " + requestToken);
   }

   async function logar() {
    await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=${apiKey.value}`,
    method: "POST",
    body: {
    
    password: `${password.value}`,
    request_token: `${requestToken}`,
    username: `${username.value}`
    
    }
    })
   }

   async function criarSessao() {
    let result:any = await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/session/new?api_key=${apiKey.value}`,
    method: "POST",
    body: {
        request_token: `${requestToken}`,
        
        }
    })
    sessionId = result.session_id;
    console.log("sessionID " + sessionId);
    apikey = apiKey.value;
   }

class HttpClient {
    
 static async get({url, method, body}) {
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

searchButton.addEventListener('click', async () => {
    let lista = document.getElementById("lista");
    if (lista) {
    lista.outerHTML = "";
    }
    let query = document.getElementById('search');
    let listaDeFilmes:any = await procurarFilme(query);
    let ul = document.createElement('ul');
    ul.id = "lista"
    for (const item of listaDeFilmes.results) {
    let li = document.createElement('li');
    li.appendChild(document.createTextNode(item.original_title + "  "))
    ul.appendChild(li)
    li.appendChild(document.createTextNode("ID: " + item.id))
    ul.appendChild(li)
    }
    console.log(listaDeFilmes);
    searchContainerfilm.appendChild(ul);
   })




async function procurarFilme(query:any) {
 query = encodeURI(query.value) 
 console.log(query)
 let result = await HttpClient.get({
 url: `https://api.themoviedb.org/3/search/movie?api_key=${apikey}&query=${query}`,
 method: "GET",
 body:{

 }
 })
 return result
}

async function adicionarFilme(filmeId) {
 let result = await HttpClient.get({
 url: `https://api.themoviedb.org/3/movie/${filmeId}?api_key=${apikey}&language=en-US`,
 method: "GET",
 body:{}
 })
 console.log(result);
}


function preencherName() {
    nomeDaLista = document.getElementById('name-list')
    console.log(nomeDaLista)

   }
   

function preencherDescricao() {
    descricao = document.getElementById('description-list')
    console.log(descricao)

   }
   


listButton.addEventListener('click', async () => {
    await criarLista();
    })



async function criarLista() {
 let result:any = await HttpClient.get({
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
    media_id = document.getElementById('media-id')
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
 media_id: `${media_id.value}`
 }
 })
 console.log(result);
}

async function pegarLista() {
 let result = await HttpClient.get({
 url: `https://api.themoviedb.org/3/list/${listId}?api_key=${apikey}`,
 method: "GET",
 body:{}
 })
 console.log(result);
}



