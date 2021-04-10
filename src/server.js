const express = require("express")//var para executar o server
const server = express()
const routes = require("./routes") //busco as rotas no arquivo.

// usando template engene - motor de redenrização é EJS
//inclui configuação para utilizar EJS - Template Engine - command install terminal:  npm i ejs
server.set('view engine','ejs') // [EJS] - motor de visualização do HTML sera EJS

// habilitar arquivos statics - publicos- scritps-img
server.use(express.static("public")) // [Use] serve add conf. servidor, neste caso busca arq. pasta public criando as rotas.
        

// usar o req.body
server.use(express.urlencoded({ extended: true }))// faço a requisição do corpo da pagina para methodo post

// routes
server.use(routes)

//console.log(server)//para testar o server - terminal: $ node src/server.js
server.listen(3000 , () => console.log ('rodando'))//defino porta 3000 do servidor comunicação
                                                   //http://localhost:3000/ - acesso web browser

                