 //[controllers] - controle de funçionalidades e regras de negocio do sistema
  const Profile = require('../model/Profile') //[../]retorno 2 pastas na dir para pegar model
  
  module.exports = {  //[module.exports]- importante para importar tudo que esta dentro para outro lugar
    index(req, res){
      return res.render("profile", { profile: Profile.get() }) //[profile.get] pego profile data
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

      Profile.update({
        ...Profile.get(),//pega data em model.profile.js
        ...req.body,
        "value-hour": valueHour
      }) 
      
      return res.redirect('/profile')
    }
  }