var babel= require("babel-core")
var traverse= require("babel-traverse").default
var babylon= require("babylon")

var prefix= "_identMe"

module.exports= function quasilon(options){
	options= options|| {}
	options.allowReturnOutsideFunction= true
	return function quasilon(strings){
		var
		  values= Array.prototype.splice.call(arguments, 1)
		  vals= []
		for(var i= 0; i< strings.length; ++i){
			var
			  str= strings[i],
			  val= values[i]
			if(str){
				vals.push(str)
			}
			if(val){
				vals.push(prefix+ i)
			}
		}
		var
		  str= vals.join(""),
		  ast= babylon.parse(str, options)
		traverse(ast, {
			Identifier: function(path){
				var
				  name= path.node.name
				if(!name.startsWith(prefix)){
					return
				}
				var
				  id= Number.parseInt(name.substring(prefix.length)),
				  val= values[id]
				console.log("ITER", id, val)
				if(val instanceof String){
					console.log("STR")
					path.replaceWithSourceString(val)
				}else if(Array.isArray(val)){
					console.log("ARR")
					path.replaceWithMultiple(val)
				}else{
					console.log("ELSE")
					path.replaceWith(val)
				}
			}
		})
		return babel.transformFromAst(ast)
	}
}
