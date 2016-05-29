//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
var buttonclass = function(
    text,
    id,
    clickhandler_function, 
    clickhandler_val,
    parent_selection,
    margin,
    cssclass
    )
{
    //--------------------------------------------------
    var onval = true;
    var offval = false;
    var bgcolor_on = titlebutton_bgcolor_on;
    var bgcolor_off = titlebutton_bgcolor_off;
    var textcolor_on = titlebutton_textcolor_on;
    var textcolor_off = titlebutton_textcolor_off;
    //--------------------------------------------------
    this.set_textcolor_off = function(c){
    	textcolor_off = c;
    	return this;
    }
    //--------------------------------------------------
    var that = this;
    this.state = offval;
    var bgcolor = bgcolor_off;
    var textcolor = textcolor_off;
    this.clickhandler_val = clickhandler_val;
    var clickable = true;
    this.clickable = clickable;
    this.id = id;
    this.clickhandler_function = clickhandler_function;
    var that = this;
    //--------------------------------------------------
    var id_g0 = "id_g0";
    var id_g1 = "id_g1";
    var b = parent_selection.append("g")
        .attr("id", this.id)
        ;
    this.b = b;
    this.g0 = b.append("g")
        .attr("id", id_g0)
        ;
    var g1 = b.append("g")
        .attr("id", id_g1)
        ;
    this.g1 = g1;
    var text_sel = g1.append("text")
        .text(text)
        .attr("fill", textcolor)
        .attr("font-size", "10px")
        .attr("class", cssclass)
        ;
    var textBBox = b.select("#" + id_g1).node().getBBox();
    b.select("#" + id_g1)
        .attr("transform", function () {
            var x = -textBBox.x + margin.x;
            var y = -textBBox.y + margin.y;
            return "translate(" + x + "," + y + ")";
        })
        ;
    var bgrect = b.select("#" + id_g0)
        .append("rect")
        .attr("width", function(){ return textBBox.width + margin.x * 2; })
        .attr("height", function(){ return textBBox.height + margin.y * 2; })
        .attr("fill", bgcolor)
        ;
    // overlapping invisible rect for click handling
    var rectbox = b.select("#" + id_g0).node().getBBox();
    b.append("rect")
        .attr("width", rectbox.width)
        .attr("height", rectbox.height)
        .attr("fill", "rgba(255,0,0, 0)")
        .on("click", function(){
            if(clickable) return that.clickhandler_function(clickhandler_val);
        })
        ;
    //--------------------------------------------------
    function colors(bg_on, bg_off, text_on, text_off){
        bgcolor_on = bg_on;
        bgcolor_off = bg_off;
        textcolor_on = text_on;
        textcolor_off = text_off;
    }
    function setcolorsfromstate(){
        text_sel.style("fill", textcolor);
        bgrect.attr("fill", bgcolor);
    }    
    function on(){
        that.state = onval;
        bgcolor = bgcolor_on;
        textcolor = textcolor_on;
        setcolorsfromstate();
    }
    function off(){
        that.state = offval;
        bgcolor = bgcolor_off;
        textcolor = textcolor_off;
        setcolorsfromstate();
    }
    function flip(){
        if(that.state == onval) off();
        else on();
    }
    this.hide = function(){ b.hide(); }
    this.show = function(){ b.show(); }
    //--------------------------------------------------
    var rectposition = new rectclass();
    rectposition.x = rectbox.x;
    rectposition.y = rectbox.y;
    rectposition.w = rectbox.width;
    rectposition.h = rectbox.height;
    this.rectposition = rectposition;
    this.set_left = function(x0){
        rectposition.set_left(x0);
        update_position();
    }
    this.set_right = function(x0){
        rectposition.set_right(x0);
        update_position();
    }
    this.set_top = function(y0){
        rectposition.set_top(y0);
        update_position();
    }
    this.set_bottom = function(y0){
        rectposition.set_bottom(y0);
        update_position();
    }
    function update_position(){
        b.attr("transform","translate("+rectposition.x+","+rectposition.y+")");
    }
    //--------------------------------------------------
    this.colors = colors;
    this.on = on;
    this.off = off;
    this.flip = flip;
    //--------------------------------------------------
}//end:buttonclass







