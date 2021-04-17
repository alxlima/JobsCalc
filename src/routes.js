const express = require('express'); //[ Express ] - Biblioteca para criar o Servidor
const routes = express.Router() // [Router] funcionalidade rotas de endereços dos caminhos das paginas 
const ProfileController = require('./controllers/ProfileController' ) // [profilecontroller] importo de controllers
const JobController = require('./controllers/JobController' ) 
const DashboardController = require('./controllers/DashboardController' )

// refatorei esta const views, sendo chamada la no arquivo server.js
//const views = __dirname + "/views/" // EJS precisa ler - SRC/ View no dirname - diretorio rais 
//const basePath = __dirname + "/views" //[basePath] - caminho base em [__dirName] - diretorio rais so sistema.
// console.log(__dirname + "/views/index.html")//  caminho do diretorio rais sistema + contact da arquivo html
//[./]- busco diretorio rais terminal:  $ pwd 

// "Request,Reponse" - requisão de pedido e resposta para Rotas do navegador web browser

//->modelo 01 envio(sendFile) html pronto.
//routes.get('/',(request, response) => response.sendFile(basePath + "/index.html"))  
//routes.get('/job',(request, response) => response.sendFile(basePath + "/job.html"))  
//routes.get('/job/edit',(request, response) => response.sendFile(basePath + "/job-edit.html"))  
//routes.get('/profile',(request, response) => response.sendFile(basePath + "/profile.html"))  
  
//->modelo 02 onde eu Renderizo( render) através do motor ejs - template engene executando as rotas
routes.get('/', DashboardController.index)  //EJS precisa ler - SRC/ View no dirname - diretorio rais 
routes.get('/job', JobController.create) //[views +]concateno com pagina ejs no dir views 
routes.post('/job', JobController.save) 
routes.get('/job/:id',JobController.show) // get - apresento cadastro do job id para editar
routes.post('/job/:id',JobController.update) // post - faço atualização do id job
routes.post('/job/delete/:id',JobController.delete) 
routes.get('/profile', ProfileController.index)  // profile [:]valor é profile var.
routes.post('/profile', ProfileController.update)  // profile [:]valor é profile var.

// devolvo a rotas
module.exports = routes;