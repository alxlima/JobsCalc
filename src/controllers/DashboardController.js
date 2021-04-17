const Job = require('../model/job') // busco job.js em modelo de dados do objeto
const JobUtils = require('../utils/JobUtils') // busco jobUlts.js em modelo de dados do objeto
const Profile = require('../model/Profile')

module.exports = { // exporto index 
  index(req, res) {
    const jobs = Job.get(); //[jobs] var do array que pego retorno get job.js de todos os jobs
    const profile = Profile.get(); //[profile] var do array que pego retorno get Profile.js de todos os perfis usuarios

    let statusCount = { //objeto atualizo dados estatisticas dos  estados do projetos
        progress: 0,  // Em andamento de
        done: 0,      // Encerrados
        total: jobs.length      // Projetos ao total
    }
     
    //total de horas por dia de cada job em andamento (progress)
    let jobTotalHours = 0

    const updatedJobs = jobs.map((job) => {
      //[Map]-semelhante ao forEach,com intuito de receber job update
      //ajustes no job
      const remaining = JobUtils.remainingDays(job);
      const status = remaining <= 0 ? "done" : "progress"; //[dias que faltam <=0]se, [?]-Então- 'Done', [:]-Senão 'Progress'

      //Somando a quantidade de status 
      statusCount[status] += 1; // status é = done, statusCount[done] += 1
                                // ex: [status] += 1 -> é o mesmo que  [status] = [status] + 1 

      //total de horas por dia de cada job em andamento (progress)
      //forma de calculo usando ternario
      jobTotalHours = status=='progress' ? jobTotalHours + Number(job['daily-hours']) : jobTotalHours//daily-hours são horas quero trabalhar por dia no jo
                  // se status = 'progress' [?]-Então - jobTotalHours + Numero dias quero trabalhar [:]-Senão retorno so o resultado padrão

      //forma de calculo usando padrão if
      //if(status == 'progress'){
      //  jobTotalHours += Number(job['daily-hours']) //daily-hours são horas quero trabalhar por dia no jo
      //}  
     
      return {
        ...job, //[...]--função js de espalhamento.
        remaining, //dias restantes
        status, //progresso
        budget: JobUtils.calculateBudget(job, profile["value-hour"]), //custo do projeto
      };
    });
  
    //qtd horas quero trabalhar dia (profile) > qtd horas dia de cada job Em andamento (Progress)
    const freeHours = profile["hours-per-day"] - jobTotalHours


    return res.render("index", { jobs: updatedJobs, 
                                 profile: profile, 
                                 statusCount: statusCount,
                                 freeHours: freeHours
                                });
  },
};
