//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
var sliderclass = function (parent_sel, sliderpos, flink, linktext) {



    this.testvar = 0;



    var g = parent_sel.append("g");
    this.g = g;



    g.attr("transform", "translate(" + sliderpos.x + "," + sliderpos.y + ")");
    var w = 300;
    var h = 20;
    var boundingrect = new rectclass();
    this.boundingrect = boundingrect;
    // rect gets position 0,0, transform g determines location
    boundingrect.set(0, 0, w, h);
    boundingrect.c = "rgba(0,0,0, .1)";
    boundingrect.m.set_all(2);
    boundingrect.append_to(g);
    var bar = boundingrect.get_inrect();
    bar.m.set_all(2);
    bar.c = "rgba(255,255,255, .7)";
    bar.append_to(g);
    var axis_g = g.append("g");// put the group for axis here beneath cursor
    this.axis_g = axis_g;
    var cursor_boundingrect = bar.get_inrect();
    var cursor = bar.get_inrect();
    this.cursor = cursor;// testing
    var cursor_g = g.append("g");
    this.cursor_g = cursor_g;//testing
    cursor_g.x = cursor.x;
    cursor_g.y = cursor.y;
    cursor_g.attr("transform", "translate(" + cursor_g.x + "," + cursor_g.y + ")");
    cursor.setpos(0, 0);
    cursor.w = 20;
    cursor.xmin = cursor_boundingrect.left() + cursor.w / 2;
    cursor.xmax = cursor_boundingrect.right() - cursor.w / 2;
    this.cursor_xmin = cursor.xmin;//testing
    this.cursor_xmax = cursor.xmax;//testing
    var domain = [cursor.xmin, cursor.xmax];
    this.domain = domain;
    var range = [0, 1];
    this.range = range;
    var scale = d3.scale.linear().domain(domain).range(range);
    this.scale = scale;
    cursor.sel = cursor.append_to(cursor_g);
    var inverse_scale = d3.scale.linear().domain(range).range(domain);
    this.inverse_scale = inverse_scale;
    // axis
    var weedaxis = d3.svg.axis()
		.scale(inverse_scale)
	 	.ticks(15)
	 	.orient("bottom")
		.tickFormat(function (d) { return d3.round(d, 2); })
		.tickSubdivide(true)
    ;
    this.weedaxis = weedaxis;
    axis_g
       .attr("transform", "translate(" + boundingrect.left() + "," + (boundingrect.bottom() - 4) + ")")
       .attr("class", "axis_slider_generic")
       .call(weedaxis)
    ;
    // axis turned off by default
    axis_g.attr("visibility", "hidden");
    // returns linear value in [0,1]
    var get_value = function () {
        var x = cursor_g.x + cursor.w / 2;
        return scale(x);
    }
    var val = get_value();
    // text
    var text_xoffset = 80;
    var text_g = g.append("g");
    var textx = boundingrect.right() + 10;
    var texty = cursor_boundingrect.bottom();
    text_g.attr("transform", "translate(" + textx + "," + texty + ")");
    var valtext_sel = text_g.append("text").attr("class", "class_slidervaltext");
    valtext_sel
		.attr("text-anchor", "end")
		.attr("x", text_xoffset - 10)
    ;
    //valtext_sel.attr("y", 3);
    var update_valtext = function () {
        //valtext_sel.text(d3.round(val,2));
        valtext_sel.text(d3.format("0.02f")(val));
    }
    var linktext_sel = text_g.append("text").attr("class", "sliderlinktext").text(linktext);
    //linktext_sel.attr("y", -linktext_sel.node().getBBox().height - 1);
    linktext_sel.attr("x", text_xoffset);
    // drag cursor
    var draghandler_cursor_g = function () {
        cursor_g.x += d3.event.dx;
        cursor_g.x = Math.max(bar.get_inrect().left(), Math.min(cursor_g.x, bar.get_inrect().right() - cursor.w));
        cursor_g.attr("transform", "translate(" + cursor_g.x + "," + cursor_g.y + ")");
        val = get_value();
        update_valtext();
        // send val to the linked function that was passed in
        flink(val);
    }
    var drag_cursor_g = d3.behavior.drag()
		.on('dragstart', function () { d3.event.sourceEvent.stopPropagation(); })
		.on('drag', draghandler_cursor_g);
    cursor_g.call(drag_cursor_g);
    // dragging entire slider
  //   var drag_g = d3.behavior.drag()
		// .on('dragstart', function () {
		//     d3.event.sourceEvent.stopPropagation();
		// })
		// .on('drag', function (d, i) {
		//     sliderpos.x += d3.event.dx;
		//     sliderpos.y += d3.event.dy;
		//     g.attr("transform", "translate(" + sliderpos.x + "," + sliderpos.y + ")");
		// });
  //   g.call(drag_g);
    this.setsliderfromval = function (val0) {
        val = val0;
        var x = scale.invert(val);
        x -= cursor.w / 2;
        cursor_g.x = x;
        cursor_g.attr("transform", "translate(" + cursor_g.x + "," + cursor_g.y + ")");
        update_valtext();
    }
};










