// [Utils]- Utilizarios do sistema
  module.exports = { //[module.exports]- consigo importar tudo que esta dentro para outro lugar
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