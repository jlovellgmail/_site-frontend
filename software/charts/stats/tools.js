//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
var cout = function(s){ console.log(s) };
sign = function(arg) { return arg < 0 ? -1 : 1 };
//--------------------------------------------------
[
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
].forEach(function(name){ add_attr_method(name); });
function add_attr_method(name){ 
    d3.selection.prototype[name] = function(arg){
        if(arguments.length == 0){
            return this.attr(name);            
        } 
        return this.attr(name, arg); 
    } 
}
//--------------------------------------------------
if (!Array.prototype.last) {
    Array.prototype.last = function() {
        return this[this.length - 1];
    };
};
var line = d3.svg.line()
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; })
    .interpolate("linear")
;
// a copy, because of confliected name in other file
var d3line = d3.svg.line()
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; })
    .interpolate("linear")
;
//--------------------------------------------------
var minmax = function(min, max){
    this.min = min;
    this.max = max;
    this.size = function() { return max - min; };
    this.get_corrected = function() {
        if (this.max < this.min) return new minmax(max, min);
        else return new minmax(min, max);
    };
};
//--------------------------------------------------
get_r = function(p1, p2){
    if (!p1.x || !p1.y || !p2.x || !p2.y) {
        cout(">>> get_r(): got a point with no x or y");
        return;
    }
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};
function get_centerangle(startangle, endangle){
    return startangle + (endangle - startangle) / 2;
}
function get_centerangleforpath(d){
    return get_centerangle(d.startAngle, d.endAngle);
}
function get_point_given_angleradius(a, radius){
    var x = Math.sin(a) * radius;
    var y = -Math.cos(a) * radius;
    return { x: x, y: y };
}
function get_centerpoint_given_pathradius(d, radius){
    var a = get_centerangleforpath(d);
    return get_point_given_angleradius(a, radius);
}
function point(x, y) {
    return { x:x, y:y };
}
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
}
//--------------------------------------------------
var rectclass = function(){
    this.x = 0;
    this.y = 0;
    this.w = 100;
    this.h = 100;
    this.m = new marginclass(10, 10, 10, 10);
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
        return this;
    }
    this.set_right = function(x0){
        this.x = x0 - this.w;
        return this;
    }
    this.set_top = function(y0){
        this.y = y0;
        return this;
    }
    this.set_bottom = function(y0){
        this.y = y0 - this.h;
        return this;
    }
    this.set_h = function(h0){
        this.h = h0;
        return this;
    }
    this.set_w = function(w0){
        this.w = w0;
        return this;
    }
    this.set_c = function(c0){
        this.c = c0;
        return this;
    }
    this.update_sel = function(){
        if(this.sel){
            // return 
            this.sel = 
                this.sel
                .x(this.x)
                .y(this.y)
                .width(this.w)
                .height(this.h)
                .fill(this.c)
                ;
            return this.sel;
        }
        else{
            cout("rectclass->update_sel(): this.sel was not true");
        }
    }
    this.update_geom_from_sel = function(){
        if(this.sel){
            this.x = this.sel.attr("x");
            this.y = this.sel.attr("y");
            this.w = this.sel.attr("width");
            this.h = this.sel.attr("height");
            return this;
        }
        else{
            cout("rectclass->update_geom_from_sel(): this.sel was not true")
        }
    }
};
//--------------------------------------------------
var apply_style = function(sel, st) {
    for (var i = 0; i < st.length; i++) {
        sel.style(st[i][0], st[i][1]);
    }
    return sel;
}
d3.selection.prototype.st = function(style0) {
    return arguments.length < 1
        ? this
        : apply_style(this, style0);
};
d3.selection.prototype.hide = function(){
    this.attr("visibility","hidden");
    return this.style("display", "none");
}
d3.selection.prototype.show = function(){
    this.attr("visibility","visible");
    return this.style("display", "inherit");
}
d3.selection.prototype.is_visible = function(){
    return this.style("visibility") == "visible";
}
d3.selection.prototype.translate = function(dx,dy){
    var s = "translate("+dx+","+dy+")";
    return this.attr("transform", s);
}
d3.transition.prototype.translate = function(dx,dy){
    return this.attr("transform", "translate("+dx+","+dy+")");
}
d3.selection.prototype.get_box = function(){
    return this.node().getBBox();
}
//--------------------------------------------------
var set_line = function(sel, x1, y1, x2, y2) {
    sel.attr("x1", x1).attr("y1", y1).attr("x2", x2).attr("y2", y2);
    return sel;
}
var append_line = function(sel, x1, y1, x2, y2) {
    if (sel) {
        var line_sel = sel.append("line")
            .attr("x1", x1)
            .attr("y1", y1)
            .attr("x2", x2)
            .attr("y2", y2)
            .style("stroke", "rgba(0,0,0, .2)")
        ;
        return line_sel;
    }
    else cout("append_line(): sel: " + sel);
}
var append_dottedline = function(sel, x1, y1, x2, y2) {
    sel.append("line")
        .attr("x1", x1)
        .attr("y1", y1)
        .attr("x2", x2)
        .attr("y2", y2)
        .style("stroke", "rgba(0,0,0, .2)")
        .style("stroke-dasharray", "5,5")
        .style("d", "M5 20 l215 0")
    ;
};
var append_styledline = function(sel, p1, p2, st) {
    // "st" arg is 2d array of style pairs
    var line = sel.append("line")
        .attr("x1", p1[0])
        .attr("y1", p1[1])
        .attr("x2", p2[0])
        .attr("y2", p2[1]);
    for (var i = 0; i < st.length; i++) {
        line.style(st[i][0], st[i][1]);
    }
};
var append_rect_fill = function(sel, rect) {
    var newsel = sel.append("rect")
        .attr("x", rect.x)
        .attr("y", rect.y)
        .attr("width", rect.w)
        .attr("height", rect.h)
        .attr("fill", rect.c)
        ;
    return newsel;
}
var append_rect_stroke = function(sel, rect) {
    var l = rect.left();
    var r = rect.right();
    var t = rect.top();
    var b = rect.bottom();
    append_line(sel, l, t, r, t);
    append_line(sel, r, t, r, b);
    append_line(sel, r, b, l, b);
    append_line(sel, l, b, l, t);
}
//--------------------------------------------------
function accessor_index(d,i){
    return i;
}
function accessor_absolute_index(d){
    return d.absolute_index;
}
function accessor_key(d,i){
    if(d != undefined) return moment(d.key).valueOf();
    return undefined;
}
function accessor_RunningDuration(d,i){
    var t = d.values[0];
    if(t.hasOwnProperty("RunningDuration")){        
        if(t.RunningDuration == undefined  ||
            isNaN(t.RunningDuration) ){
            cout("accessor_RunningDuration, 1 -> got undefined or NaN");
        }
        return t.RunningDuration;
    }
    if(t.hasOwnProperty("DateCompleted")  &&  t.hasOwnProperty("DateCreated")){
        if(moment(t.DateCompleted).diff(t.DateCreated) == undefined  ||
            isNaN(moment(t.DateCompleted).diff(t.DateCreated)) ){
                cout("accessor_RunningDuration, 2 -> got undefined or NaN");
        }
        return moment(t.DateCompleted).diff(t.DateCreated);// moment.diff() returns a raw number in milliseconds
    }
    return -1;
}
function accessor_TotalSize(d,i){
    if(d.values[0].hasOwnProperty("TotalSize")) return d.values[0].TotalSize;
    else return -1;
}
//--------------------------------------------------
// array intervals
function get_interval(array, accessor, interval){
    var out = {};   
    out.interval = {};
    out.interval.start = interval.start;
    out.interval.end = interval.end;
    out.accessor = accessor;
    out.values = [];
    out.values = 
        array.filter(
            function(d){
                return accessor(d).within(interval);
            }
        );
    return out;
}
function get_interval_list(array, accessor, d_interval, start, end){
    var interval_list_out = []; 
    var interval = {
        start: start,
        end: Math.min(start+d_interval, end)
    };
    while(interval.start < end){
        interval_list_out.push(get_interval(array, accessor, interval));
        interval.start = interval.end;
        interval.end = interval.start + d_interval;
    }
    return interval_list_out;
}
var get_d_interval_for_n_intervals = function(array, accessor, n_intervals){
    var domain = d3.extent(array, accessor);
    var d_interval = (domain[1] - domain[0]) / n_intervals;
    return d_interval;
}
var set_interval_average_RunningDuration = function(interval){
    var sum = 0;
    var elements_not_undefined_count = 0;
    interval.values.forEach(function(d){
        var temp = accessor_RunningDuration(d);
        if(temp != undefined){
            sum += temp;
            elements_not_undefined_count++;
        }
    });
    interval.RunningDuration_sum = sum;
    interval.RunningDuration_elements_not_undefined = elements_not_undefined_count;
    if(elements_not_undefined_count != 0){
        interval.RunningDuration_average = sum / elements_not_undefined_count;
    }
    else{
        interval.RunningDuration_average = 0;
    }
}
var set_interval_average_RunningDuration_and_TotalSize = function(interval, scale){
    var RunningDuration_sum = 0;
    var TotalSize_sum = 0;
    var RunningDuration_elements_not_undefined_count = 0;
    var TotalSize_elements_not_undefined_count = 0;
    interval.values.forEach(function(d){        
        var RunningDuration_temp = accessor_RunningDuration(d);
        var TotalSize_temp = accessor_TotalSize(d);
        if(RunningDuration_temp != undefined){
            RunningDuration_sum += RunningDuration_temp;
            RunningDuration_elements_not_undefined_count++;
        }
        if(TotalSize_temp != undefined){
            TotalSize_sum += TotalSize_temp;
            TotalSize_elements_not_undefined_count++;
        }
    });
    interval.RunningDuration_sum = RunningDuration_sum;
    interval.TotalSize_sum = TotalSize_sum;
    interval.RunningDuration_elements_not_undefined = RunningDuration_elements_not_undefined_count;
    interval.TotalSize_elements_not_undefined = TotalSize_elements_not_undefined_count;
    if(RunningDuration_elements_not_undefined_count != 0){
        interval.RunningDuration_average = RunningDuration_sum / RunningDuration_elements_not_undefined_count;
    }
    else{
        interval.RunningDuration_average = 0;
    }
    if(TotalSize_elements_not_undefined_count != 0){
        interval.TotalSize_average = TotalSize_sum / TotalSize_elements_not_undefined_count;
    }
    else{
        interval.TotalSize_average = 0;
    }

    if(     interval.RunningDuration_average != 0  
        &&  interval.TotalSize_average != 0  
        &&  interval.RunningDuration_average != undefined
        &&  interval.TotalSize_average != undefined ){
        interval.ratio = interval.RunningDuration_average / interval.TotalSize_average;
    }
    else{
        interval.ratio = 0;
    }
    // also put an initial x value in there, 
    // ask the key for data join to keep columns stationary
    // adding the second argument for this
    interval.startval_scaled = scale(moment(interval.interval.start));
}
//--------------------------------------------------
// convert floats into 255-based, return string "rgba(..."
function fc(r,g,b, a){
    r = Math.floor(r*255);
    g = Math.floor(g*255);
    b = Math.floor(b*255);
    return "rgba("+r+","+g+","+b+","+a+")";
}
var floatcolor = fc;
//--------------------------------------------------
function ms(d,i){ return moment(d).valueOf(); }
function is_array(val){ return val instanceof Array; }
Number.prototype.within = function(range){
    if(!is_array(range)){
        range = [range];
        //cout("within(): converted argument to array");
    }
    range = d3.extent(range);
    return range[0] <= this  &&  this <= range[1];
}
function getcopyofnestedarray(nested_array){
    return nested_array.map(function(d){ 
        return {
            key: d.key, 
            values: d.values.slice(),
            absolute_index: d.absolute_index
        };

    });
}
function hasproblems(val){
    if(isNaN(val) || val==undefined || val==Infinity || val==-Infinity) return true;
    else return false;
}
//--------------------------------------------------
var tick_data = function(d){ return d3.format(".1f")(d/1000000000) + " Gb"; }
var tick_data_scientific = function(d){ return d3.format(".1e")(d/1000000000) + " Gb"; }
var tick_duration = function(d){ return d3.format(".1f")(d/(1000 * 60 * 60)) + " hrs"; }
var tick_index = function(d,i){ return accessor_index(d,i); }
var tick_time = function(d){ return moment(d).format("MMM D, YYYY"); }
function log_format(d, format){
  var x = Math.log(d) / Math.log(logscale_base) + 1e-6;
  return Math.abs(x - Math.floor(x)) < .01 ? format(d) : "";
}
var onebillion = 1000000000;
var onetrillion = onebillion * 1000;
var replace_zero_val = .00001;
var logscale_base = 10;











