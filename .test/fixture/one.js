#!/usr/bin/env node
var quasilon= require("../..")()

var getAnswer= quasilon`return "4"+2`

module.exports= quasilon`module.exports= function(){ ${getAnswer.ast.program.body} }`

if(require.main === module){
	console.log(module.exports.code)
}
