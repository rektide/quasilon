var quasilon= require("../..")

var getAnswer= quasilon`return "4"+2`

module.exports= quasilon`module.exports= function(){ ${getAnswer} }`
