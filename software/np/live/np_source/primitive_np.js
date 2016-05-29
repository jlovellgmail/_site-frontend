//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
var prstruct = {};
prstruct.s = "";
prstruct.n = 0;
prstruct.c = [];
prstruct.c_evals = [];
prstruct.eval_children = function(){
	var that = this;
	this.c_evals = [];
	this.c.forEach(function(child){that.c_evals.push(child.evaluate(  that.comp_depth + 1  ))});
}
// derived objects can redefine op() if 
// their evaluation is a simple binary operation
// or they can redefine the evaluate() function if they need custom behavior
prstruct.op = function(a,b){}
prstruct.evaluate = function(comp_depth){
	// try putting this in a property
	// so I'm able to call it from the eval_children() function
	// without having to pass it as argument
	this.comp_depth = comp_depth;
	// I shouldn't have to check if we're already in a compleaf at this point
	// because terminals all have their evaluate() functions redefined to return
	// their val property. So we must be in a non-compleaf non-terminal
	// to have arrived here, ie the node must have children.
	// - so I think it also doesn't matter if I continue to increment and pass 
	// the comp_depth along to the terminal
	if(comp_depth > g.compdepth_max){
		return check(this.compleaf.evaluate());
	}
	else{
		this.eval_children();
		var eval = this.op(this.c_evals[0], this.c_evals[1]);
		return check(eval);
	}
}
//--------------------------------------------------
// switch to testing array arguments
var add = Object.create(prstruct);
add.s = "+";
add.n = 2;
add.evaluate = function(comp_depth){
	this.comp_depth = comp_depth;
	if(comp_depth > g.compdepth_max){
		return check(this.compleaf.evaluate());
	}
	else{
		this.eval_children();
		// example:
		// both children are sqrt, then c_evals[] has two elements
		// each of which is a 2-element array
		// we want to return a 4-element flat array with the four possible combos
		return arrayarg.add(this.c_evals[0], this.c_evals[1]);
	}
}
//--------------------------------------------------
var sub = Object.create(prstruct);
sub.s = "-";
sub.n = 2;
sub.evaluate = function(comp_depth){
	this.comp_depth = comp_depth;
	if(comp_depth > g.compdepth_max){
		return check(this.compleaf.evaluate());
	}
	else{
		this.eval_children();
		return arrayarg.sub(this.c_evals[0], this.c_evals[1]);
	}
}
//--------------------------------------------------
var mult = Object.create(prstruct);
mult.s = "*";
mult.n = 2;
mult.evaluate = function(comp_depth){
	this.comp_depth = comp_depth;
	if(comp_depth > g.compdepth_max){
		return check(this.compleaf.evaluate());
	}
	else{
		this.eval_children();
		return arrayarg.mult(this.c_evals[0], this.c_evals[1]);
	}
}
//--------------------------------------------------
var div = Object.create(prstruct);
div.s = "/";
div.n = 2;
div.evaluate = function(comp_depth){
	this.comp_depth = comp_depth;
	if(comp_depth > g.compdepth_max){
		return check(this.compleaf.evaluate());
	}
	else{
		this.eval_children();
		return arrayarg.div(this.c_evals[0], this.c_evals[1]);
	}
}
//--------------------------------------------------
var pow = Object.create(prstruct);
pow.s = "pow";
pow.n = 2;
pow.evaluate = function(comp_depth){
	this.comp_depth = comp_depth;
	if(comp_depth > g.compdepth_max){
		return check(this.compleaf.evaluate());
	}
	else{
		this.eval_children();
		return arrayarg.pow(this.c_evals[0], this.c_evals[1]);
	}
}
//--------------------------------------------------
var sq = Object.create(prstruct);
sq.s = "sq";
sq.n = 1;
sq.evaluate = function(comp_depth){
	this.comp_depth = comp_depth;
	if(comp_depth > g.compdepth_max){
		return check(this.compleaf.evaluate());
	}
	else{
		this.eval_children();
		var eval = [];
		this.c_evals.forEach(function(d){
			eval.push(arrayarg.sq(d));
		});
		return flatten(eval);
	}
}
//--------------------------------------------------
var sqrt = Object.create(prstruct);
sqrt.s = "sqrt";
sqrt.n = 1;
sqrt.evaluate = function(comp_depth){
	this.comp_depth = comp_depth;
	if(comp_depth > g.compdepth_max){
		return check(this.compleaf.evaluate());
	}
	else{
		this.eval_children();
		// example: 
		// both children are also sqrt()
		// after eval_children(), c_evals[] has two elements, each is a 2-element array
		// simply call arrayarg.sqrt() and it gets flattened
		// whoops I thought this was add()
		// only one child, returning on 2-element array, which is an element in c_evals[]
		var eval = [];
		this.c_evals.forEach(function(d){
			// this will only happen once for the single child of sqrt.
			// - switch from push() to concat() so it's flat without needing to call flatten().
			// - calling arrayarg.sqrt returns a 2-element array
			// so we end up with eval = a flat array with two elements
			eval.push(arrayarg.sqrt(d));
		});
		return flatten(eval);
	}
}
//--------------------------------------------------
var sin = Object.create(prstruct);
sin.s = "sin";
sin.n = 1;
sin.evaluate = function(comp_depth){
	this.comp_depth = comp_depth;
	if(comp_depth > g.compdepth_max){
		return check(this.compleaf.evaluate());
	}
	else{
		this.eval_children();
		var eval = [];
		this.c_evals.forEach(function(d){
			eval.push(arrayarg.sin(d));
		});
		return flatten(eval);
	}
}
//--------------------------------------------------
var cos = Object.create(prstruct);
cos.s = "cos";
cos.n = 1;
cos.evaluate = function(comp_depth){
	this.comp_depth = comp_depth;
	if(comp_depth > g.compdepth_max){
		return check(this.compleaf.evaluate());
	}
	else{
		this.eval_children();
		var eval = [];
		this.c_evals.forEach(function(d){
			eval.push(arrayarg.cos(d));
		});
		return flatten(eval);
	}
}
//--------------------------------------------------
var tan = Object.create(prstruct);
tan.s = "tan";
tan.n = 1;
tan.evaluate = function(comp_depth){
	this.comp_depth = comp_depth;
	if(comp_depth > g.compdepth_max){
		return check(this.compleaf.evaluate());
	}
	else{
		this.eval_children();
		var eval = [];
		this.c_evals.forEach(function(d){
			eval.push(arrayarg.tan(d));
		});
		return flatten(eval);
	}
}
//--------------------------------------------------
var greaterthan = Object.create(prstruct);
greaterthan.s = "gt";
greaterthan.n = 2;
greaterthan.op = function(a,b){ return (a > b) ? 1 : 0; }
//--------------------------------------------------
var pr_if = Object.create(prstruct);
pr_if.s = "if";
pr_if.n = 1;
pr_if.evaluate = function(comp_depth){
	this.comp_depth = comp_depth;
	if(comp_depth > g.compdepth_max){
		return check(this.compleaf.evaluate());
	}
	else{
		this.eval_children();
		return (this.c_evals[0] > 0) ? 1 : 0;
	}
}
//--------------------------------------------------
var pr_if2 = Object.create(prstruct);
pr_if2.s = "if2";
pr_if2.n = 2;
pr_if2.evaluate = function(comp_depth){
	this.comp_depth = comp_depth;
	if(comp_depth > g.compdepth_max){
		return check(this.compleaf.evaluate());
	}
	else{
		this.eval_children();
		if(arrayarg.pr_if2(this.c_evals[0]) > 0) return this.c_evals[1];
	}
}
// not sure how to set this above up right now...
// - I think it it not engaged
//--------------------------------------------------
var pr_or = Object.create(prstruct);
pr_or.s = "or";
pr_or.n = 2;
pr_or.op = function(a,b){ return (this.c_evals[0] > 0 || this.c_evals[1] > 0) ? 1 : 0; }
//--------------------------------------------------
var pr_and = Object.create(prstruct);
pr_and.s = "and";
pr_and.n = 2;
pr_and.op = function(a,b){ return (this.c_evals[0] > 0 && this.c_evals[1] > 0) ? 1 : 0; }
//--------------------------------------------------
var floor = Object.create(prstruct);
floor.s = "floor";
floor.n = 1;
floor.evaluate = function(comp_depth){
	this.comp_depth = comp_depth;
	if(comp_depth > g.compdepth_max){
		return check(this.compleaf.evaluate());
	}
	else{
		this.eval_children();
		var eval = [];
		this.c_evals.forEach(function(d){
			eval.push(arrayarg.floor(d));
		});
		return flatten(eval);
	}
}
//--------------------------------------------------
var abs = Object.create(prstruct);
abs.s = "floor";
abs.n = 1;
abs.evaluate = function(comp_depth){
	this.comp_depth = comp_depth;
	if(comp_depth > g.compdepth_max){
		return check(this.compleaf.evaluate());
	}
	else{
		this.eval_children();
		var eval = [];
		this.c_evals.forEach(function(d){
			eval.push(arrayarg.abs(d));
		});
		return flatten(eval);
	}
}
//--------------------------------------------------
var neg = Object.create(prstruct);
neg.s = "neg";
neg.n = 1;
neg.evaluate = function(comp_depth){
	this.comp_depth = comp_depth;
	if(comp_depth > g.compdepth_max){
		return check(this.compleaf.evaluate());
	}
	else{
		this.eval_children();
		var eval = [];
		this.c_evals.forEach(function(d){
			eval.push(arrayarg.neg(d));
		});
		return flatten(eval);
	}
}
//--------------------------------------------------
var num = Object.create(prstruct);
num.s = "num";
num.n = 0;
num.val = Math.random();
num.evaluate = function(){ return [this.val]; }
//--------------------------------------------------
function nodestruct(pr){
	this.s = pr.s;
	this.n = pr.n;
	this.op = pr.op;
	this.evaluate = pr.evaluate;
	this.c = new Array;
	this.c_list = new Array;
	this.val = Math.random();
	this.compleaf = null;
	this.leaf_flag = false;
}
nodestruct.prototype = prstruct;
//--------------------------------------------------














