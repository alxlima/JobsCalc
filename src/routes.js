const express = require('express'); //[ Express ] - Biblioteca para criar o Servidor
const routes = express.Router() // [Router] funcionalidade rotas de endereços dos caminhos das paginas 

const views = __dirname + "/views/" // EJS precisa ler - SRC/ View no dirname - diretorio rais
//const basePath = __dirname + "/views" //[basePath] - caminha base em [__dirName] - diretorio rais so sistema.
// console.log(__dirname + "/views/index.html")//  caminho do diretorio rais sistema + contact da arquivo html
//[./]- busco diretorio rais terminal:  $ pwd 

const Profile ={ //dados que envio para motor ejs - processar no html
  data: { 
  name:"Alex Lima",
    // avatar:"https://avatars.githubusercontent.com/u/53023996?s=400&u=3d1f72c6da7a9731e42cdb8428bc97990ecd7495&v=4",
    avatar:"https://github.com/alxlima.png",
    "monthly-budget":3000, 
    "hours-per-day": 5,
    "days-per-week": 5,
    "vacation-per-year": 4,
    "value-hour": 75 
  },
  
  controllers: {
    index(req, res){
      return res.render(views + "profile", { profile: Profile.data })
    },

    update(req, res){
      //req.body para pegar os dados 
      const data = req.body

      //definir quantas semana tem no aredondo: 52
      const weeksPerYear = 52

      //remover as semanas de ferias do ano, para pegar quantas semanas tem em 1 mês
      const weekPerMonth = (weeksPerYear- data["vacation-per-year"]) / 12 //[vacation-per-year] ferias por ano
      
      //total de horas trabalhadas na semana
      const weekTotalHours = data["hours-per-day"] * data["days-per-week"]

      //total de horas trabalhadas no mês
      const monthTotalHours =  weekTotalHours * weekPerMonth

      //qual o valor da minha hora ?
      const valueHour = data["monthly-budget"] / monthTotalHours

      Profile.data = {
        ...Profile.data,
        ...req.body,
        "value-hour": valueHour
      }
      
      return res.redirect('/profile')
    }
  }
}

const Job = { //Criado object Literals - que possue funções
   data: [ // Array de estrutura de dados -Lista de jobs.
     {
        id: 1,
        name: "Pizzaria Gulosos",
        "daily-hours": 2,
        "total-hours": 1,
        created_at : Date.now()
      },
      { 
        id: 2,
        name: "OneTwo Project",
        "daily-hours": 3,
        "total-hours": 47,
        created_at : Date.now()
     }
   ], 

   controllers: {
     index(req, res) {
        const updatedJobs = Job.data.map((job) => { //[Map]-semelhando ao forEach,com intuito de receber job update
         //ajustes no job
        const remaining = Job.services.remainingDays(job)
        const status = remaining <= 0 ? 'done' : 'progress' // [<=0]se [?]-Então- 'Done', [:]-Senão 'Progress'
      
        return {
           ...job,   //[...]--função js de espalhamento.
           remaining,//dias restantes
           status,   //progresso
           budget: Job.services.calculateBudget(job, Profile.data["value-hour"])//custo do projeto
         }
        })
      
        return res.render(views + "index", { jobs: updatedJobs })
     },

     create(req, res){
      return res.render(views + "job") //[render]- Renderizo pag através do motor ejs - template engene executando as rotas
     },                                 //[views +]concateno com pagina ejs no dir views 
                                       //EJS precisa ler - SRC/ Views no dirname - diretorio rais  

     save(req, res) {
      //ref: reg.body={ name: 'Alex ', 'daily-hours': '0.4', 'total-hours': '3' }  
         const lastId = Job.data[Job.data.length - 1]?
                        Job.data[Job.data.length - 1].id : 0; //pego a posição no tamanho do Array
                                                          //[?.id]- se id não existe [II] então = 0
         Job.data.push({
           id: lastId + 1,
           name: req.body.name,
           "daily-hours": req.body["daily-hours"],
           "total-hours": req.body["total-hours"],
           created_at: Date.now() //Atribuindo uma nova data = System
          }) // empurrar o req.boy para a constant var jobs.
        
          return res.redirect('/') // redireciono para rota [/]    
          // console.log(req.body)   //testar [Post]enviar e salvar dados  
     },

     show(req, res) {

      const jobId = req.params.id

      const job = Job.data.find(job=> Number(job.id) === Number(jobId)) //[find] busco um registro do id interno em data.
      
      if (!job) {
        return res.send('job not found!')
      }
       
      job.budget = Job.services.calculateBudget(job, Profile.data["value-hour"])// posso definir aqui o valor fixo da hora on futuro
      return res.render(views + "job-edit", { job })
     },
   
     update(req, res) {
      const jobId = req.params.id // pego numero id do job projeto

      const job = Job.data.find(job=> Number(job.id) === Number(jobId)) //[find] busco um registro do id interno em data.
      
      if (!job) { // se não existir o job projeto mensagem de que projeto não existe
        return res.send('job not found!')
      }

      //se existir job projeto atualizar
      const updatedJob = {
        ...job,
        name: req.body.name, // sobreescrevo o nome do job, com valor do req.body.name
        "total-hours": req.body["total-hours"],
        "daily-hours": req.body["daily-hours"],
       }

       Job.data = Job.data.map(job =>{ //retorno um novo objeto
        
        if(Number(job.id) === Number(jobId)){ //se o id cadastro for = jobId
          job = updatedJob  // coloca o job para updated
        }
        
        return job
       })
       //redirecionar para a mesma pagina edit id do jobe alterado
       res.redirect(/job/+ jobId)
     },
     
     delete(req, res){
      const jobId = req.params.id // pego numero id do job projeto

      Job.data = Job.data.filter(job=> Number(job.id) !== Number(jobId)) //[filter] tudo que for verdadeiro se mantenho no filto tudo que for falso remove.
                                                              //[!==]- se Id for diferentes ao JobId - mantem - se = delete
      
      return res.redirect('/')

     }
  },

   services: {
     remainingDays(job) { 
       //calculo de tempo restante do projeto //ex: 40 horas / 2 horas dia - prazo 20dias 
       const remainingDays = (job ["total-hours"] / job ["daily-hours"]).toFixed() //[toFixed()]- arrendondar valor fixo para numero quebrado Ex: 12.1 = 12
   
       const createDate = new Date(job.created_at) //retorno novo objeto data criação projeto
       const dueDay = createDate.getDay() + Number(remainingDays)//[dueDate]-Dia da Entrega -[getDay] dia da semana
       const dueDateInMs = createDate.setDate(dueDay)  //[dueDate]- Data do Vencimento - [setDate]- crio nova data 
       
       //difença do tempo em milesegundos
       const timeDiffInMs = dueDateInMs - Date.now() //[timeDiffInMs] -tempo venc x tempo agora(misec)
       //transformar millisec em dias
       const dayInMs = 1000 * 60 * 60 * 24
       const dayDiff = Math.floor(timeDiffInMs / dayInMs) //[Math.floor]--aredondo valor quebrado pra baixo
      
       //restam x dias
       return dayDiff
     },
     calculateBudget: (job, valueHour)=> valueHour * job["total-hours"] // calculo o custo do projeto
  }   
}
 
// "request,reponse" - requisão de pedido e resposta para Rotas do navegador web browser
//->modelo 01 envio(sendFile) html pronto.
//routes.get('/',(request, response) => response.sendFile(basePath + "/index.html"))  
//routes.get('/job',(request, response) => response.sendFile(basePath + "/job.html"))  
//routes.get('/job/edit',(request, response) => response.sendFile(basePath + "/job-edit.html"))  
//routes.get('/profile',(request, response) => response.sendFile(basePath + "/profile.html"))  
  
//->modelo 02 onde eu Renderizo( render) através do motor ejs - template engene executando as rotas
routes.get('/', Job.controllers.index)  //EJS precisa ler - SRC/ View no dirname - diretorio rais 
routes.get('/job', Job.controllers.create) //[views +]concateno com pagina ejs no dir views 
routes.post('/job', Job.controllers.save) 
routes.get('/job/:id',Job.controllers.show) // get - apresento cadastro do job id para editar
routes.post('/job/:id',Job.controllers.update) // post - faço atualização do id job
routes.post('/job/delete/:id',Job.controllers.delete) 
routes.get('/profile', Profile.controllers.index)  // profile [:]valor é profile var.
routes.post('/profile', Profile.controllers.update)  // profile [:]valor é profile var.

// devolvo a rotas
module.exports = routes;