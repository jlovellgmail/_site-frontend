//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
function cout(s){ console.log(s); }
//--------------------------------------------------
function flatten(arg){
    if(Object.prototype.toString.call(arg) != "[object Array]"){
        // arg is not an array, 
        // assume it's a raw value and return it
        // - need to return array here in case it's a raw number
        // that is initially sent to flatten(), in which case
        // it never makes it to the else() below where it would be concatenated
        // into an array
        return [arg];
    }
    else{
        // arg is an array
        // flatten each of its elements, in case they are arrays
        // concatenate all those flattened children arrays into single flat array
        var flattened_elements = [];
        arg.forEach(function(element){
            flattened_elements = flattened_elements.concat(flatten(element));
        });
        return flattened_elements;
    }
}
//--------------------------------------------------
function gate(){
    var that = this;
    this.threshold = .5;
    this.trial = function(){
        return Math.random() > this.threshold;
    }
}
//--------------------------------------------------
function hasproblems(arg){
    if( isNaN(arg) ||  
        arg == undefined ||
        arg == Infinity ||
        arg == -Infinity ||
        arg == null )
    {
        return true;
    }
    else{
        return false;
    }
}
//--------------------------------------------------
if(typeof Object.create !== "function"){
    Object.create = function(o){
        var F = function(){};
        F.prototype = o;
        return new F();
    };
}
//--------------------------------------------------
function fc(r,g,b, a){
    r = Math.floor(r*255);
    g = Math.floor(g*255);
    b = Math.floor(b*255);
    return "rgba("+r+","+g+","+b+","+a+")";
}
var floatcolor = fc;
//--------------------------------------------------
Array.prototype.last = function(){ return this[this.length - 1]; }
Array.prototype.chooserandom = function(){ return this[Math.floor(Math.random()*this.length)]; }
Array.prototype.random_index = function(){ return Math.floor(Math.random()*this.length); }
//--------------------------------------------------
var attributes = [
    "id",
    "x",
    "y",
    "width",
    "height",
    "fill",
    "stroke",
    "class",
    "r",
    "cx",
    "cy",
    "transform",
    "x1",
    "y1",
    "x2",
    "y2",
    "d"
]
attributes.forEach(function(name){ add_attr_method_selection(name); });
attributes.forEach(function(name){ add_attr_method_transition(name); });
function add_attr_method_selection(name){ d3.selection.prototype[name] = function(arg){ return this.attr(name, arg); } }
function add_attr_method_transition(name){ d3.transition.prototype[name] = function(arg){ return this.attr(name, arg); } }
//--------------------------------------------------
d3.selection.prototype.translate = function(dx,dy){ var s = "translate("+dx+","+dy+")"; return this.attr("transform", s); }
d3.transition.prototype.translate = function(dx,dy){ return this.attr("transform", "translate("+dx+","+dy+")"); }
//--------------------------------------------------
var d3line = d3.svg.line()
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; })
    .interpolate("linear")
	;
//--------------------------------------------------
function point(x,y){ return {x:x,y:y}; }
//--------------------------------------------------
var marginclass = function(l, r, t, b){
    this.l = l ? l : 0;
    this.r = r ? r : 0;
    this.t = t ? t : 0;
    this.b = b ? b : 0;
    this.set = function(l, r, t, b){
        this.l = l;
        this.r = r;
        this.t = t;
        this.b = b;
    };
    this.set_all = function(val){
        this.l = val;
        this.r = val;
        this.t = val;
        this.b = val;
    };
    this.get_copy = function(){
        return new marginclass(this.l, this.r, this.t, this.b);
    }
}//end: marginclass()
//--------------------------------------------------
var rectclass = function(){
    this.x = 0;
    this.y = 0;
    this.w = 100;
    this.h = 100;
    this.m = new marginclass(20,20,20,20);
    this.c = "rgba(0,0,0, 1)";
    this.set = function(x0, y0, w0, h0){
        this.x = x0;
        this.y = y0;
        this.w = w0;
        this.h = h0;
    }
    this.setpos = function(x0, y0){
        this.x = x0;
        this.y = y0;
    }
    this.setdims = function(w0, h0){
        this.w = w0;
        this.h = h0;
    }
    this.left = function() { return this.x; };
    this.right = function() { return this.x + this.w; };
    this.top = function() { return this.y; };
    this.bottom = function() { return this.y + this.h; };
    this.center = function() { return point(this.x + this.w / 2, this.y + this.h / 2); }
    this.get_inrect = function() {
        var inrect = new rectclass();
        inrect.x = this.x + this.m.l;
        inrect.y = this.y + this.m.t;
        inrect.w = this.w - this.m.l - this.m.r;
        inrect.h = this.h - this.m.t - this.m.b;
        return inrect;
    };
    this.inside = function(x, y) {
        if (this.left() < x) return false;
        if (this.right() > x) return false;
        if (this.top() < y) return false;
        if (this.bottom() > y) return false;
        return true;
    };
    this.append_to = function(parent_sel){
        var sel = parent_sel.append("rect");
        sel.attr("x", this.x);
        sel.attr("y", this.y);
        sel.attr("width", this.w);
        sel.attr("height", this.h);
        sel.attr("fill", this.c);
        return sel;
    }
    this.get_copy = function(){
        var copy = new rectclass();
        copy.x = this.x;
        copy.y = this.y;
        copy.w = this.w;
        copy.h = this.h;
        copy.m = this.m.get_copy();
        copy.c = this.c;
        return copy;
    }
    this.copy_to = function(sel){
        sel.attr("x", this.x);
        sel.attr("y", this.y);
        sel.attr("width", this.w);
        sel.attr("height", this.h);
        sel.attr("color", this.c)
        return sel;
    }
    this.set_left = function(x0){
        this.x = x0;
        return this.x;
    }
    this.set_right = function(x0){
        this.x = x0 - this.w;
        return this.x;
    }
    this.set_top = function(y0){
        this.y = y0;
        return this.y;
    }
    this.set_bottom = function(y0){
        this.y = y0 - this.h;
        return this.y;
    }
}//end: rectclass()














