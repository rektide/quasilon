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
				if(typeof(val) === "string"){
					path.replaceWithSourceString(val)
				}else if(Array.isArray(val)){
					val= Array.prototype.concat.apply([], val)
					path.replaceWithMultiple(val)
				}else{
					path.replaceWith(val)
				}
			}
		})
		return babel.transformFromAst(ast)
	}
}
