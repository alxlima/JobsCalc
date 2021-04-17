// Array de estrutura de dados -Lista de jobs.
let data = [ 
             //[let]-tipo var alteravel - [data]- dados que envio para motor ejs - processar no html       
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
  ];
  
  //Exporto retorno dos  dados do services Jobs 
  module.exports = {
      get(){
          return data // retorno dados registro
      },

      update(newJob){
        data = newJob // pego data e passo um novo array com dados a atualizar
      },

      delete(id){
        // pego data e passo id se for diferente para delete
       data = data.filter(job=> Number(job.id) !== Number(id)) 
       //[filter] tudo que for verdadeiro se mantenho no filto tudo que for falso remove.
        //[!==]- se Id for diferentes ao JobId - mantem - senão = delete
      }
  }
