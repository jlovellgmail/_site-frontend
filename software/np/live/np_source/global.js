//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
var g = {};
g.test = [];
g.prlist = [];
g.prlist_terminals = [];
g.prlist_1c = [];
g.prlist_2c = [];
g.childbearing_creationdepth_min = 2;
g.creationdepth_max = 4;
g.compdepth_max = 4;
g.chooseexisting_depth_min = 3;
g.gate_chooseexisting = new gate();
//--------------------------------------------------

// jan16
/*
var div;
*/
var html_div;

var svgrect;
var svg;
var gp;
var root;
var dx;
var data;
var graph;
var layout;// visualization of the gp/np
var x;
var y;
var nodelist = [];
var g_networkdata;
var g_replace_problems_val = 0;
//--------------------------------------------------
function g_problemhandler(val){
	return g_replace_problems_val;
}
function check(val){
    return hasproblems(val) ? g_replace_problems_val : val;
}
//--------------------------------------------------
// basic math ops to be converted into protected versions
var raw = {};
raw.add = function(a,b){return a + b;}
raw.sub = function(a,b){return a - b;}
raw.mult = function(a,b){return a * b;}
raw.div = function(a,b){return a / b;}
raw.pow = function(a,b){return Math.pow(a,b);}
raw.sq = function(a){return a * a;}
raw.sqrt = function(a){return Math.sqrt(a);}
raw.sin = function(a){return Math.sin(a);}
raw.cos = function(a){return Math.cos(a);}
raw.tan = function(a){return Math.tan(a);}
raw.floor = function(a){return Math.floor(a);}
raw.abs = function(a){return Math.abs(a);}
raw.neg = function(a){return -a;}
raw.pr_if2 = function(a){return a > 0 ? 1 : 0;}
//--------------------------------------------------
var checked = {};
Object.keys(raw).forEach(function(key){
	checked[key] = function(){
		var arglist = [].slice.apply(arguments);
		// will need to change this to handle arbitrary
		// maybe raw should accept a single array of args
		var out;
		if(arglist.length == 1) out = raw[key](arglist[0]);
		if(arglist.length == 2) out = raw[key](arglist[0], arglist[1]);
		return check(out);
	}
});
//--------------------------------------------------
var arrayarg = {};
Object.keys(checked).forEach(function(key){
	arrayarg[key] = function(){
		var arglist = [].slice.apply(arguments);
		var out = [];
		// need to change this, as noted above in checked, 
		// raw should probably accept an array from the beginning
		if(arglist.length == 1){
			[].concat(arglist[0]).forEach(function(d){
				// concat instead of push might be necessary 
				// to always keep everything flat
				out = out.concat(checked[key](d));
			});
		}
		else if(arglist.length == 2){
			[].concat(arglist[0]).forEach(function(d0){
				[].concat(arglist[1]).forEach(function(d1){
					// concat instead of push might be necessary 
					// to always keep everything flat
					out = out.concat(checked[key](d0,d1));
				});
			});
		}
		return out;
	}
});
// redefine sqrt() with custom functionality
arrayarg.sqrt = function(arglist){
	var out = [];
	arglist.forEach(function(arg){ 
		out = out.concat(  checked.sqrt(arg) );
		out = out.concat( -checked.sqrt(arg) );
	});
	return out;
}
//--------------------------------------------------
g.mutate = function(){

	// jan16
	/*
	np.mutate();
	*/
	g.test = [];
	g.prlist = [];
	g.prlist_terminals = [];
	g.prlist_1c = [];
	g.prlist_2c = [];
	//div = null;
	svgrect = null;
	svg = null;
	gp = null;
	root = null;
	dx = null;
	data = null;
	graph = null;
	layout = null;// visualization of the gp/np
	x = null;
	y = null;
	nodelist = [];
	g_networkdata = null;
	np = null;
	layout = null;
	graph = null;
	d3.select("#id_div1").selectAll("*").remove();
	render_layout_np();

}//end: g.mutate()
//--------------------------------------------------













