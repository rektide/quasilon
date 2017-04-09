var babel= require("babel-core")
var traverse= require("babel-traverse").default
var babylon= require("babylon")

var prefix= "_identMe"

function parseArgNumber( str){
	if(str && str.constructor!== String){
		return
	}
	if(str.startsWith(prefix)){
		var n= str.substring(prefix.length)
		return Number.parseInt(n)
	}
}

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
			Literal: function(path){
				var n= parseArgNumber(path.node.value)
				if(n === undefined) return
				path.node.value= values[n]
			},
			Identifier: function(path){
				var n= parseArgNumber(path.node.name)
				if(n === undefined) return

				var val= values[n]
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
