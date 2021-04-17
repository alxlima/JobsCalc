
//refatoreio o const Job = //object Literals que incluo funções
  
const Job = require('../model/job') // busco job.js em modelo de dados do objeto
const JobUtils = require('../utils/JobUtils') // busco jobUlts.js em modelo de dados do objeto
const Profile = require('../model/Profile')

module.exports = {
    create(req, res){
     return res.render("job") //[render]- Renderizo pag através do motor ejs - template engene executando as rotas
    },                                 //[views +]concateno com pagina ejs no dir views // refatorei o views pois inclui em server.js
                                      //EJS precisa ler - SRC/ Views no dirname - diretorio rais  

    save(req, res) {
        const jobs = Job.get()
        //ref: reg.body={ name: 'Alex ', 'daily-hours': '0.4', 'total-hours': '3' }  
        const lastId = jobs[jobs.length - 1]?
                       jobs[jobs.length - 1].id : 0; //pego a posição no tamanho do Array
                                                         //[?.id]- se id não existe [II] então = 0
        jobs.push({
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
     const jobs = Job.get()

     const job = jobs.find(job=> Number(job.id) === Number(jobId)) //[find] busco um registro do id interno em data.
     
     if (!job) {
       return res.send('job not found!')
     }
      
     const profile = Profile.get()//[profile]-- recebo todos os dado de Profile.js

     job.budget = JobUtils.calculateBudget(job, profile["value-hour"])// posso definir aqui o valor fixo da hora on futuro
     return res.render("job-edit", { job })
    },

      
    update(req, res) {  
     const jobId = req.params.id // pego numero id do job projeto
     const jobs = Job.get()

     const job = jobs.find(job=> Number(job.id) === Number(jobId)) //[find] busco um registro do id interno em data.
     
     if (!job) { // se não existir o job projeto mensagem de que projeto não existe
       return res.send('job not found!')
     }

     //se existir job projeto atualizar
     const updatedJob = {
       ...job,              // [...] -espred - espalhar 
       name: req.body.name, // sobreescrevo o nome do job, com valor do req.body.name
       "total-hours": req.body["total-hours"],
       "daily-hours": req.body["daily-hours"],
      }

      const newJobs = jobs.map(job =>{ //retorno um novo objeto
       
       if(Number(job.id) === Number(jobId)){ //se o id cadastro for = jobId
         job = updatedJob  // coloca o job para updated
       }
       
       return job
      })

      Job.update(newJobs) // obtenho o NewJobs, em new model/jobs.js atualizar dados

      //redirecionar para a mesma pagina edit id do jobe alterado
      res.redirect(/job/+ jobId)
    },
    
    delete(req, res){
     const jobId = req.params.id // pego numero id do job projeto

     Job.delete(jobId)
     
     return res.redirect('/')

    }
 }