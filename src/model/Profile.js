const { get } = require("../routes");

//[Model] - É responsabel por tratar a camada dados do sistema
let data = { //[let]-tipo var alteravel - [data]- dados que envio para motor ejs - processar no html       
  name: "Alex Lima",
  // avatar:"https://avatars.githubusercontent.com/u/53023996?s=400&u=3d1f72c6da7a9731e42cdb8428bc97990ecd7495&v=4",
  avatar: "https://github.com/alxlima.png",
  "monthly-budget": 3000,
  "hours-per-day": 5,
  "days-per-week": 5,
  "vacation-per-year": 4,
  "value-hour": 75,
};

//retorno os dados do prifile para controllers profile
module.exports = {
    get(){
        return data;
    },
    update(newData){
      data = newData; 
    }
}