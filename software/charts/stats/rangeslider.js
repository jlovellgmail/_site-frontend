//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
function change_slider_domain(n_days){
    var range;
    if(n_days == Number.MAX_VALUE){
        rangeslidermenu.button_allhistory.on();
        rangeslidermenu.button_30days.off();
        rangeslidermenu.button_10days.off();
        range = [moment(g_DateCreated_min), moment(g_DateCreated_max)];
    }
    else{
        rangeslidermenu.button_allhistory.off();
        if(n_days == 30){
            rangeslidermenu.button_30days.on();
            rangeslidermenu.button_10days.off();
        }
        else{
            rangeslidermenu.button_30days.off();
            rangeslidermenu.button_10days.on();
        }
        var mstotalrange = msperday * n_days;
        var msmax = moment(g_DateCreated_max).valueOf();
        var msmin = msmax - mstotalrange;
        range = [moment(msmin), moment(msmax)];
    }
    rangeslider.range = range;
    rangeslider.scale.range(range);
    rangeslider.lc.scale.range(range);
    rangeslider.lc.inverse_scale.domain(range);
    rangeslider.rc.scale.range(range);
    rangeslider.rc.inverse_scale.domain(range);
    rangeslider.x_axis.scale(rangeslider.rc.inverse_scale);    
    rangeslider
        .axis_g
        .transition()
        .call(rangeslider.x_axis)
        .delay(0)
        .duration(g_duration)
        .ease(g_ease)
        ;
    rangeslider.update_from_scale_change();
}
//--------------------------------------------------
function rangeslidermenuclass(parent_sel) {
    var g = parent_sel.append("g").attr("id", "id_rangeslidermenu_g");
    this.g = g;
    var pos = point(0,0);
    var current = point(pos.x, pos.y);
    var separation = g_small_menu_separation_point;
    var class_rangeslider_menubutton = "slider_button_text2";
    var button_margin = point(6,3);
    var blist = [];
    //--------------------------------------------------
    var labelbutton = new buttonclass(
        "Slider Range:",
        "id_rangeslidermenu_labelbutton", 
        function(){}, 
        -1,
        g, 
        button_margin,
        class_rangeslider_menubutton
    );
    this.labelbutton = labelbutton;
    labelbutton.b.attr("transform", "translate(" + current.x + "," + current.y + ")");
    current.x += labelbutton.b.node().getBBox().width + separation.x;
    //--------------------------------------------------
    // all available history
    var button_allhistory = new buttonclass(
        "All Available History",
        "id_rangeslidermenu_allhistorybutton",
        change_slider_domain,
        Number.MAX_VALUE,
        g, 
        button_margin,
        class_rangeslider_menubutton
    );
    this.button_allhistory = button_allhistory;
    blist.push(button_allhistory);
    blist.last().b.attr("transform", "translate(" + current.x + "," + current.y + ")");
    current.x += blist.last().b.node().getBBox().width + separation.x;
    //--------------------------------------------------
    // 30 days
    var button_30days = new buttonclass(
        "30 days",
        "id_rangeslidermenu_30daysbutton",
        change_slider_domain,
        30,
        g, 
        button_margin,
        class_rangeslider_menubutton
    );
    this.button_30days = button_30days;
    blist.push(button_30days);
    blist.last().b.attr("transform", "translate(" + current.x + "," + current.y + ")");
    current.x += blist.last().b.node().getBBox().width + separation.x;
    //--------------------------------------------------
    // 10 days
    var button_10days = new buttonclass(
        "10 days",
        "id_rangeslidermenu_10daysbutton",
        change_slider_domain,
        10,
        g, 
        button_margin,
        class_rangeslider_menubutton
    );
    this.button_10days = button_10days;
    blist.push(button_10days);
    blist.last().b.attr("transform", "translate(" + current.x + "," + current.y + ")");
    current.x += blist.last().b.node().getBBox().width + separation.x;
    //--------------------------------------------------
    var text_on = "rgba(0,0,0, .9)";
    var text_off = "rgba(0,0,0, .4)";
    var bg_on = "rgba(0,0,0, .2)";
    var bg_off = "rgba(0,0,0, .1)";
    blist.forEach(function(d){
        d.colors(bg_on, bg_off, text_on, text_off);
    });
    labelbutton.colors("rgba(255,255,255, 0)", "rgba(255,255,255, 0)", text_on, text_on);
    labelbutton.on();
    labelbutton.clickable = false;
    button_allhistory.on();
    button_30days.off();
    button_10days.off();
}//end:rangeslidermenuclass()
//--------------------------------------------------
var rangesliderclass = function (parent_sel, sliderpos, flinkpair, linktext) {
    var that = this;
    var g = parent_sel.append("g");
    this.g = g;
    g.attr("transform", "translate(" + sliderpos.x + "," + sliderpos.y + ")");
    this.sliderpos = sliderpos;
    var halo = g.append("image")
        
        //.attr("xlink:href", "/public/images/4.20.14b_halo.png")
        .attr("xlink:href", "images/4.20.14b_halo.png")

        .attr("x", 7)
        .attr("y", -44)
        .attr("width", 787)
        .attr("height", 107)
    ;
    var wbar = 800;
    var hbar = 16;
    var bar = new rectclass();
    this.bar = bar;//testing
    bar.set(40, 0, wbar - 80 , hbar);
    bar.c = "rgba(255,255,255, 1)";
    bar.append_to(g);
    var axis_g = g.append("g");
    this.axis_g = axis_g;// testing
    var span = {};
    span.g = g.append("g");
    span.g.attr("id","id_span_g");
    var projection = {};
    projection.g = g.append("g");
    //--------------------------------------------------
    var range = [moment(g_DateCreated_min), moment(g_DateCreated_max)];
    this.range = range;
    var tick_edge_margin = 2;
    bar.m.set_all(0);
    bar.m.l = tick_edge_margin;
    bar.m.r = tick_edge_margin;
    var scalerect = bar.get_inrect();    
    var domain = [scalerect.left(), scalerect.right()];
    var scale = d3.time.scale().domain(domain).range(range);
    this.scale = scale;
    //--------------------------------------------------
    lc = {};
    this.lc = lc;//testing
    lc.g = g.append("g");
    lc.g.attr("id", "lc_g");
    lc.pointlist = [
        { "x": 0, "y": 0 },
        { "x": 20, "y": 0 },
        { "x": 20, "y": 19 },
        { "x": 16, "y": 16 },
        { "x": 0, "y": 16 },
        { "x": 0, "y": 0 }
    ];
    lc.path = lc.g.append("path")
        .attr("d", line(lc.pointlist))
        .attr("class", "rangeslider_cursor")
        ;
    var pathextent_left = d3.extent(lc.pointlist, function (d) { return d.x; });
    lc.g.w = pathextent_left[1] - pathextent_left[0];
    lc.g.xmin = bar.left() - lc.g.w + tick_edge_margin;
    lc.g.xmax = bar.right() - lc.g.w - tick_edge_margin;
    lc.g.x = lc.g.xmin;
    lc.g.y = 0;
    lc.domain = [lc.g.xmin, lc.g.xmax];
    lc.scale = d3.time.scale().domain(lc.domain).range(range);
    lc.inverse_scale = d3.time.scale().domain(range).range(lc.domain);
    lc.g.set_val = function(){
        lc.g.val = lc.scale(lc.g.x);
    }
    lc.g.setfromval = function(val0){
        lc.g.val = val0;
        lc.g.x = lc.inverse_scale(val0);//scale.invert does not work
        lc.g.attr("transform", "translate(" + lc.g.x + "," + lc.g.y + ")");
    }
    lc.g.flink = flinkpair[0];
    lc.g.draghandler = function(){
        lc.g.x += d3.event.dx;
        lc.g.x = Math.max(lc.g.xmin, Math.min(lc.g.x, rc.g.x - rc.g.w));
        lc.g.attr("transform", "translate(" + lc.g.x + "," + lc.g.y + ")");
        lc.g.set_val();
        lc.g.flink(lc.g.val);
        update_span();
        update_projection();
        vd.update();
    }
    //--------------------------------------------------
    rc = {};
    this.rc = rc;//testing
    rc.g = g.append("g");
    rc.g.attr("id", "rc_g");
    rc.pointlist = [
        { "x": 0, "y": 0 },
        { "x": 20, "y": 0 },
        { "x": 20, "y": 16 },
        { "x": 4, "y": 16 },
        { "x": 0, "y": 19 },
        { "x": 0, "y": 0 }
    ];
    rc.path = rc.g.append("path")
        .attr("d", line(rc.pointlist))
        .attr("class", "rangeslider_cursor")
        ;
    var pathextent_left = d3.extent(rc.pointlist, function (d) { return d.x; });
    rc.g.w = pathextent_left[1] - pathextent_left[0];
    rc.g.xmin = bar.left() + tick_edge_margin;
    rc.g.xmax = bar.right() - tick_edge_margin;
    rc.g.x = rc.g.xmax;
    rc.g.y = 0;
    rc.domain = [rc.g.xmin, rc.g.xmax];
    rc.scale = d3.time.scale().domain(rc.domain).range(range);
    rc.inverse_scale = d3.time.scale().domain(range).range(rc.domain);
    rc.g.set_val = function () {
        rc.g.val = rc.scale(rc.g.x);
        return rc.g.val;
    }
    rc.g.setfromval = function (val0) {
        rc.g.val = val0;
        rc.g.x = rc.inverse_scale(val0);//scale.invert does not work
        rc.g.attr("transform", "translate(" + rc.g.x + "," + rc.g.y + ")");
    }
    rc.g.flink = flinkpair[1];
    rc.g.draghandler = function () {
        rc.g.x += d3.event.dx;
        rc.g.x = Math.min(rc.g.xmax, Math.max(rc.g.x, lc.g.x + lc.g.w));
        rc.g.attr("transform", "translate(" + rc.g.x + "," + rc.g.y + ")");
        rc.g.set_val();
        rc.g.flink(rc.g.val);
        update_span();
        update_projection();
        vd.update();
    }
    //--------------------------------------------------
    span.rect = new rectclass();
    span.rect.h = 16;
    span.rect.y = 0;
    span.rect.c = "rgba(0,0,0, .27)";
    span.sel = span.rect.append_to(span.g);
    update_span();
    function update_span() {
        span.dx = lc.g.x + lc.g.w;
        span.w = rc.g.x - span.dx;
        span.sel.attr("width", span.w);
        span.g.attr("transform", "translate(" + span.dx + ",0)");
    }
    span.draghandler = function(){        
        var hold = span.dx;
        span.dx += d3.event.dx;
        span.dx = Math.min(Math.max(span.dx, scalerect.left()), scalerect.right() - span.w);
        if(span.dx == hold) return;
        span.g.attr("transform","translate("+span.dx+",0)");
        gmindomain = scale(span.dx);
        gmaxdomain = scale(span.dx+span.w);
        lc.g.setfromval(gmindomain);
        rc.g.setfromval(gmaxdomain);
        update_projection();
        g_update();
        vd.update();
    }
    //--------------------------------------------------
    projection.path = projection.g.append("path")
        .attr("fill", "rgba(0,0,0, .08)");
    function update_projection() {
        projection.pointlist = [];
        projection.pointlist.push(point(span.dx, span.rect.y));
        var x = 0;
        var y = -72;
        projection.pointlist.push(point(x, y));
        x = 800;
        projection.pointlist.push(point(x, y));
        x = span.dx + span.w;
        y = span.rect.y;
        projection.pointlist.push(point(x, y));
        projection.path.attr("d", line(projection.pointlist));
    }
    update_projection();
    //--------------------------------------------------
    var x_axis = d3.svg.axis()
        .scale(rc.inverse_scale)
        .tickSize(25)
        ;
    this.x_axis = x_axis;
    axis_g
        .attr("transform", "translate(0," + bar.top() + ")")
        .attr("class", "rangeslider_axis")
        .call(x_axis)
        ;
    //--------------------------------------------------
    var drag_cg = d3.behavior.drag()
        .on('dragstart', function(){ d3.event.sourceEvent.stopPropagation(); })
        .on('drag', function(){
            if(this.id == "lc_g"){ return lc.g.draghandler(); }
            if(this.id == "rc_g"){ return rc.g.draghandler(); }
            if(this.id == "id_span_g"){ return span.draghandler(); }
        });
    // these are used in analytics.js to set the behavior for "dragend"
    this.drag_cg = drag_cg;
    this.span = span;
    this.lc = lc;
    this.rc = rc;
    // is this not being used?
    this.end_event_function = function(){ cout("end_event_function() is empty"); };
    rc.g.call(drag_cg);
    lc.g.call(drag_cg);
    span.g.call(drag_cg);
    //--------------------------------------------------
    function update_from_scale_change(){
        lc.g.x = lc.inverse_scale(lc.g.val);//scale.invert not working
        lc.g.x = Math.max(lc.g.xmin, lc.g.x);
        rc.g.x = rc.inverse_scale(rc.g.val);//scale.invert not working
        rc.g.x = Math.max(rc.g.x, lc.g.x+lc.g.w);
        lc.g.set_val();
        rc.g.set_val();
        lc.g
            .transition()
            .attr("transform", "translate(" + lc.g.x + "," + lc.g.y + ")")
            .delay(0)
            .duration(g_duration)
            .ease(g_ease)
            ;
        rc.g
            .transition()
            .attr("transform", "translate(" + rc.g.x + "," + rc.g.y + ")")
            .delay(0)
            .duration(g_duration)
            .ease(g_ease)
            ;
        gmindomain = lc.g.val;
        gmaxdomain = rc.g.val;
        vd.update_with_transitions();        
        g_update_with_transitions();
        span.dx = lc.g.x + lc.g.w;
        span.w = rc.g.x - span.dx;
        span.sel
            .transition()
            .attr("width", span.w)
            .delay(0)
            .duration(g_duration)
            .ease(g_ease)
            ;
        span.g
            .transition()
            .attr("transform", "translate(" + span.dx + ",0)")
            .delay(0)
            .duration(g_duration)
            .ease(g_ease)
            ;
        projection.pointlist = [];
        projection.pointlist.push(point(span.dx, span.rect.y));
        var x = 0;
        var y = -72;
        projection.pointlist.push(point(x, y));
        x = 800;
        projection.pointlist.push(point(x, y));
        x = span.dx + span.w;
        y = span.rect.y;
        projection.pointlist.push(point(x, y));
        projection.path
            .transition()
            .attr("d", line(projection.pointlist))
            .delay(0)
            .duration(g_duration)
            .ease(g_ease)
            ;
        that.end_event_function();
    }//end:update_from_scale_change()
    this.update_from_scale_change = update_from_scale_change;
    //--------------------------------------------------
    var cval = 80;
    var valboxcolor = "rgba("+cval+","+cval+","+cval+", 1)";
    var valdisplay_right = {};
    this.valdisplay_right = valdisplay_right;
    valdisplay_right.g = g.append("g");
    valdisplay_right.pointlist_rect = [
        { "x": 0, "y": 0 },
        { "x": 150, "y": 0 },
        { "x": 150, "y": 33 },
        { "x": 0, "y": 33 },
        { "x": 0, "y": 0 }
    ];
    valdisplay_right.pointlist_point = [
        // point
        { "x": 10, "y": 0 },
        { "x": 16, "y": 6 },
        { "x": 22, "y": 0 },
    ]
    valdisplay_right.pathg = valdisplay_right.g.append("g");
    valdisplay_right.rectpathg = valdisplay_right.pathg.append("g");
    valdisplay_right.rectpath = valdisplay_right.rectpathg
    	.append("path")
    	.attr("d",line(valdisplay_right.pointlist_rect))
    	;
    valdisplay_right.rectpath.attr("fill",valboxcolor);
    valdisplay_right.pointpathg = valdisplay_right.pathg.append("g");
    valdisplay_right.pointpath = valdisplay_right.pointpathg
    	.append("path")
    	.attr("d",line(valdisplay_right.pointlist_point))
    	;
    valdisplay_right.pointpathg.attr("transform","translate(0,36)");
    valdisplay_right.pointpathg.attr("visibility","hidden");
    valdisplay_right.pathg.attr("transform","scale(.6)");
    valdisplay_right.textg = valdisplay_right.g.append("g");
    valdisplay_right.text_sel = valdisplay_right.textg.append("text")
        .attr("fill","rgba(255,255,255, .9)")
        .style("font-size","12px")
        .text(moment(gmaxdomain).format("MMM DD, YYYY"))
        ;
    valdisplay_right.textg.attr("transform","translate(7,14)");
    function get_left_valdisplay(){
        var valdisplay_right = {};
        this.valdisplay_right = valdisplay_right;
        valdisplay_right.g = g.append("g");
        valdisplay_right.pointlist_rect = [
            { "x": 0, "y": 0 },
            { "x": 150, "y": 0 },
            { "x": 150, "y": 33 },
            { "x": 0, "y": 33 },
            { "x": 0, "y": 0 }
        ];
        valdisplay_right.pointlist_point = [
            // point
            { "x": 10, "y": 0 },
            { "x": 16, "y": 6 },
            { "x": 22, "y": 0 },
        ]
        valdisplay_right.pathg = valdisplay_right.g.append("g");
        valdisplay_right.rectpathg = valdisplay_right.pathg.append("g");
        valdisplay_right.rectpath = valdisplay_right.rectpathg
        	.append("path")
        	.attr("d",line(valdisplay_right.pointlist_rect))
        	;
        valdisplay_right.rectpath.attr("fill",valboxcolor);
        valdisplay_right.pointpathg = valdisplay_right.pathg.append("g");
        valdisplay_right.pointpath = valdisplay_right.pointpathg
        	.append("path")
        	.attr("d",line(valdisplay_right.pointlist_point))
        	;
        valdisplay_right.pointpathg.attr("transform","translate(0,36)");
        valdisplay_right.pointpathg.attr("visibility","hidden");        
        valdisplay_right.pathg.attr("transform","scale(.6)");
        valdisplay_right.textg = valdisplay_right.g.append("g");
        valdisplay_right.text_sel = valdisplay_right.textg.append("text")
            .attr("fill","rgba(255,255,255, .9)")
            .style("font-size","12px")
            .text(moment(gmindomain).format("MMM DD, YYYY"))
            ;
        valdisplay_right.textg.attr("transform","translate(7,14)");
        return valdisplay_right;
    }
    var vd = {};
    this.vd = vd;
    vd.right = valdisplay_right;
    vd.left = get_left_valdisplay();
    vd.update = function(){
        var r = this.right;
        var dx = rc.g.x + 15;
        var dy = 0;
        r.g.attr("transform","translate("+dx+","+dy+") scale(.8)");
        r.text_sel
            .text(moment(gmaxdomain)
            .format("MMM DD, YYYY"))
            .attr("shape-rendering", "crispEdges")
            ;
        var l = this.left;
        dx = lc.g.x - 67;
        l.g.attr("transform","translate("+dx+","+dy+") scale(.8)");
        l.text_sel
            .text(moment(gmindomain)
            .format("MMM DD, YYYY"))
            .attr("shape-rendering", "crispEdges")
            ;
    }
    vd.update_with_transitions = function(){
        var r = this.right;
        var dx = rc.g.x + 15;
        var dy = 0;
        r.g
            .transition()
            .attr("transform","translate("+dx+","+dy+") scale(.8)")
            .delay(0)
            .duration(g_duration)
            .ease(g_ease)
            ;
        r.text_sel
            .text(moment(gmaxdomain)
            .format("MMM DD, YYYY"))
            .attr("shape-rendering", "crispEdges")
            ;        
        var l = this.left;
        dx = lc.g.x - 67;
        l.g
            .transition()
            .attr("transform","translate("+dx+","+dy+") scale(.8)")
            .delay(0)
            .duration(g_duration)
            .ease(g_ease)
            ;
        l.text_sel
            .text(moment(gmindomain)
            .format("MMM DD, YYYY"))
            .attr("shape-rendering", "crispEdges")
            ;
    }
    vd.update();
};//end:rangesliderclass








