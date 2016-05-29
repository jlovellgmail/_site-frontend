//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
var start_with_graph1 = false;
//--------------------------------------------------
var render_analytics_layout = function(data){



    if(data.length === max_sessions){
        d3.select("#id_platform")
            .append("div")
            .style("padding","10px").style("padding-left","14px").style("background-color",fc(0,0,0, .1))
            .append("text")
            .text("Data is included for up to "+max_sessions+" most recent app sessions.")
            .style("font-style","italic")
            ;
    }

    setup_data(data);

    g_bigdx = -12;
    var toptext_dx = 20;
    var toptext_dy = 30;
    //--------------------------------------------------
    var platform_rect = new rectclass();
    platform_rect.set(0, 0, 900, 640);
    platform_rect.c = "rgba(0,0,0, 0)";
    platform_svg = d3.select("#id_platform")
        .append("svg")
        .attr("width", platform_rect.w)
        .attr("height", platform_rect.h)
        ;
    //--------------------------------------------------
    // platform behind donut is set up after graph to match graph's rect
    // but appended here so it's on the bottom layer
    rdonut_g = platform_svg.append("g");
    //--------------------------------------------------
    var dy = 32;
    var dh = 15;
    //--------------------------------------------------
    rangeslider = new rangesliderclass(platform_svg, point(66+g_bigdx, 510+dy+dh), [flink_left,flink_right], "--");
    rangeslider.lc.g.setfromval(moment(g_DateCreated_min));
    rangeslider.rc.g.setfromval(moment(g_DateCreated_max));
    gmindomain = g_DateCreated_min;
    gmaxdomain = g_DateCreated_max;
    // update initial date display
    rangeslider.vd.update();
    //--------------------------------------------------
    var p = platform_rect.center();
    p.y -= 60;
    donut = new donutclass(platform_svg, p, gdata_base);
    scale_donut(.91);
    //--------------------------------------------------
    // rect for graphs
    // match donut platform
    var r = new rectclass();
    r.x = 66 + g_bigdx;
    r.y = 78 + dy - 60;// -60 donut did that below for the old rect
    r.w = 800;
    r.h = 360 + dh + 60;// +60 donut did it below for the old rect
    r.m.set_all(0);
    //--------------------------------------------------
    // radial gradient on rdonut
    rdonut = {};
    rdonut.grad = rdonut_g.append("radialGradient")
        .attr("r","30%")
        .attr("cx","48%")
        .attr("cy","40%")
        .attr("spreadMethod","pad")
        .attr("id", "rdonut_grad")
        .attr('gradientUnits', 'userSpaceOnUse')
        ;
    rdonut.grad
        .append("stop")
        .attr("offset","20%")
        .attr("stop-color","rgba(255,255,255, .05)")
        ;
    rdonut.grad
        .append("stop")
        .attr("offset","100%")
        .attr("stop-color","rgba(255,255,255, 0)")
        ;
    rdonut_g
        .append("rect")
        .attr("x", r.x)
        .attr("y", r.y)
        .attr("width", r.w)
        .attr("height", r.h)
        .attr("fill", "url(#rdonut_grad)")
        .attr("opacity",1)
        ;
    //--------------------------------------------------
    // graph1
    var args1 = {};
    args1.vscale = d3.scale.linear();
    args1.ydomain = [0, d3.max(gdata_keyDateCreated_sorted_base, accessor_TotalSize)];
    args1.tickfunction = function tickfunction(d){ return d3.format(".0f")(d / 1000000000) + " Gb"; };
    args1.myaccessor = accessor_TotalSize;    
    graph1 = new graphclass1_b(platform_svg, r, args1);
    graph1.update(false);
    graph1.update_tooltips();
    graph1.hide();
    graph1.nodata.hide();
    rangeslider.end_event_function = end_event_function;
    rangeslider.drag_cg = rangeslider.drag_cg.on("dragend", end_event_function);
    rangeslider.rc.g.call(rangeslider.drag_cg);
    rangeslider.lc.g.call(rangeslider.drag_cg);
    rangeslider.span.g.call(rangeslider.drag_cg);
    var toptext_graph1_g = graph1.base_g.append("g");
    graph1.toptext = toptext_graph1_g.append("text")
        .attr("dy",0)
        .attr("class","description_text")
        .text("Output Data")
        ;
    toptext_graph1_g.attr("transform","translate("+(toptext_dx)+","+(toptext_dy)+")");
    //--------------------------------------------------
    // platform for donut based on graph's rect
    var rdonut = r.get_copy();
    rdonut.c = "rgba(255,255,255, .6)";
    var pr = rdonut.append_to(rdonut_g);
    //--------------------------------------------------
    // donut top text
    var writing_g = rdonut_g.append("g");
    writing_g.append("text")
        .attr("dy",0)
        .attr("class","description_text")
        .text("Status Aggregates")
        ;
    writing_g.attr("transform","translate("+(rdonut.x + toptext_dx)+","+(rdonut.y + toptext_dy)+")");
    //--------------------------------------------------
    if(g_graph_testing_tick_controls_flag){
            // button advances graph by one tick
            var tickbutton_clickhandler = function(arg){
                donut.labelforcegraph.force.alpha(g_hold_alpha);
            }
            var tickbutton = 
                new buttonclass(
                    rdonut_g,
                    "id_tickbutton",
                    "Tick",
                    "class_titlebutton",
                    10,
                    5,
                    titlebutton_bgcolor_on,
                    tickbutton_clickhandler,
                    0
                );
            tickbutton.b.attr("transform", "translate("+rdonut.x+","+(rdonut.y + 100)+")");
            // button to run the graph, stop stepping frame by frame
            var rungraphbutton_clickhandler = function(arg){
                g_run_graph_flag = !g_run_graph_flag;
                donut.labelforcegraph.force.alpha(g_hold_alpha);
            }
            var rungraphbutton = 
                new buttonclass(
                    rdonut_g,
                    "id_tickbutton",
                    "Run",
                    "class_titlebutton",
                    10,
                    5,
                    titlebutton_bgcolor_on,
                    rungraphbutton_clickhandler,
                    0
                );
            rungraphbutton.b.attr("transform", "translate("+rdonut.x+","+(rdonut.y + 140)+")");
    }
    //--------------------------------------------------
    var titlebutton_g = platform_svg.append("g");
    var titlemenu = new titlemenuclass(titlebutton_g);
    titlemenu.pos = point(r.x,0);
    titlemenu.g.attr("transform","translate("+titlemenu.pos.x+","+titlemenu.pos.y+")");
    //--------------------------------------------------
    rangeslidermenu = new rangeslidermenuclass(rangeslider.g);
    this.rangeslidermenu = rangeslidermenu;// testing
    var bt = rangeslider.bar;
    rangeslider_box = {x:bt.x, y:bt.y, width:bt.w, height:bt.h };
    rangeslidermenu.box = rangeslidermenu.g.node().getBBox();
    rangeslidermenu.pos = point(0,0);
    rangeslidermenu.pos.x += rangeslider_box.x + rangeslider_box.width - rangeslidermenu.box.width;
    rangeslidermenu.pos.y += 60;
    rangeslidermenu.g.attr("transform","translate("+rangeslidermenu.pos.x+","+rangeslidermenu.pos.y+")");
    //--------------------------------------------------
    //add_testcontrols();
    //add_logscale_slider();
    //--------------------------------------------------
    setup_table();
    //--------------------------------------------------
    if(start_with_graph1){
        graph_title_clickhandler();     
    }
}//end: render_analytics_layout
//--------------------------------------------------
function setup_totals(){
    g_totalduration = 0;
    g_totaldata = 0;
    gdata_keyDateCreated_sorted_filtered.forEach(function(d){
        g_totalduration += accessor_duration(d);
        g_totaldata += accessor_TotalSize(d);
    });
    g_totalappsessions = gdata_keyDateCreated_sorted_filtered.length;
    var valtext_duration = format_duration_hoursminsec(g_totalduration);
    var valtext_data = format_data(g_totaldata);
    var valtext_sessions = g_totalappsessions;
    var valtext_status = function(){        
        if(selector.getval() == selector_allstatus_string) return "All";
        else return selector.getval();
    }
    var totals_svg = table.outer_container.append("svg")
        .width(platform_svg.width())
        .height(80)
        ;
    var group_sep_hard = 170;
    var totals_svg_g = totals_svg.append("g");
    totals_svg_g.pos = point(36,0);
    totals_svg_g.translate(totals_svg_g.pos.x, totals_svg_g.pos.y);
    var units_color = fc(0,0,0, .4);
    var units_fontsize = 24;
    var units_sep = 4;
    g_totals = {};
    //--------------------------------------------------
    g_totals.duration = totals_group(totals_svg_g, "Duration", valtext_duration);
    g_totals.duration.pos = point(rangeslider.sliderpos.x + rangeslider.bar.right(), 0);
    g_totals.duration.translate(g_totals.duration.pos.x, g_totals.duration.pos.y);
    g_totals.duration.accessor = accessor_duration;
    g_totals.duration.shift_g = g_totals.duration.val_g.append("g");
    g_totals.duration.shift_g.append(function(){ return g_totals.duration.val_g.select("text").remove().node(); })
    g_totals.duration.units_g = g_totals.duration.val_g.append("g");
    g_totals.duration.units_g.append("text").text("Days").style("font-size",units_fontsize+"px").fill(units_color);
    g_totals.duration.shift_g.pos_hoursminsec = point(0,0);
    g_totals.duration.shift_g.pos_days = point(-g_totals.duration.units_g.get_box().width - units_sep, 0);
    g_totals.duration.render = function(total_ms){
        var duration = moment.duration(total_ms);
        var hours = Math.floor(duration.asHours());
        var pos;
        var format;
        if(g_formatdays_flag && hours >= 100){
            // display days
            pos = g_totals.duration.shift_g.pos_days;
            g_totals.duration.units_g.show();
            format = format_duration_days;
        }
        else{
            // display hh:mm:ss
            pos = g_totals.duration.shift_g.pos_hoursminsec;
            g_totals.duration.units_g.hide();
            format = format_duration_hoursminsec;
        }
        g_totals.duration.shift_g.translate(pos.x,pos.y);
        var valtext = format(total_ms);
        g_totals.duration.val_g.select("text").text(valtext);
    }
    //--------------------------------------------------
    g_totals.data = totals_group(totals_svg_g, "Data", valtext_data);
    g_totals.data.shift_g = g_totals.data.val_g.append("g");
    g_totals.data.shift_g.append(function(){ return g_totals.data.val_g.select("text").remove().node(); });
    g_totals.data.units_g = g_totals.data.val_g.append("g");
    g_totals.data.units_g.append("text").text("Gb").style("font-size",units_fontsize+"px").fill(units_color);
    g_totals.data.shift_g.translate(-g_totals.data.units_g.get_box().width - units_sep, 0);
    g_totals.data.pos = point(g_totals.duration.pos.x - group_sep_hard, 0);
    g_totals.data.translate(g_totals.data.pos.x, g_totals.data.pos.y);
    g_totals.data.format = format_data;
    //--------------------------------------------------
    g_totals.sessions = totals_group(totals_svg_g, "Sessions", valtext_sessions);
    g_totals.sessions.pos = point(g_totals.data.pos.x - group_sep_hard, 0);
    g_totals.sessions.translate(g_totals.sessions.pos.x, g_totals.sessions.pos.y);
    //--------------------------------------------------
    g_totals.status = totals_group(totals_svg_g, "Status", valtext_status);

    // quick fix to make the space smaller for sessions totals group
    g_totals.status.pos = point(g_totals.sessions.pos.x - group_sep_hard + 30, 0);
    g_totals.status.translate(g_totals.status.pos.x, g_totals.status.pos.y);
    g_totals.status.val_g.hide();
    // move selector with status heading
    selector.ontop
        .style("right", 
            ( -(g_totals.status.pos.x - selector.ontop.width - 14) - totals_svg_g.pos.x) + "px");
    //--------------------------------------------------
    g_totals.launchsource = totals_group(totals_svg_g, "Launch Source", selector_launchsource.getval);
    g_totals.launchsource.pos = point(g_totals.status.pos.x - group_sep_hard, 0);
    g_totals.launchsource.translate(g_totals.launchsource.pos.x, g_totals.launchsource.pos.y);
    g_totals.launchsource.val_g.hide();
    // move selector with heading
    selector_launchsource.ontop
        .style("right", 
            ( -(g_totals.launchsource.pos.x - selector_launchsource.ontop.width - 14) - totals_svg_g.pos.x) + "px");
    //--------------------------------------------------
    function totals_group(sel, headertext, valtext){
        var linesep = 12;
        var dyheader = 20;
        var dyval = 36;
        var linecolor = fc(0,0,0, .1);
        var g = sel.append("g");
        g.header_g = add_header(g);
        g.header_g.translate(-linesep, dyheader);
        function add_header(sel){
            var g = sel.append("g")
                .style("font-size", g_totals_header_fontsize+"px")
                .style("font-weight", "bold")
                .style("text-anchor", "end")
                .fill(fc(0,0,0, .5))
                ;
            var text = g.append("text").text(headertext);
            return g;
        }
        g.val_g = add_val(g);
        g.val_g.translate(-linesep, dyheader + dyval);
        function add_val(sel){
            var g = sel.append("g")
                .style("font-size", g_totals_val_fontsize+"px")
                .style("font-weight", "bold")
                .style("text-anchor", "end")
                .fill(totals_valcolor)
                ;
            var text = g.append("text").text(valtext);
            return g;
        }
        g.line_g = add_line(g);
        function add_line(sel){
            var g = sel.append("g");
            g.append("path")
                .d(line([point(0,4),point(0,60)]))
                .fill("none")
                .stroke(linecolor)
                ;
            return g;
        }
        g.initial_box = g.get_box();
        return g;
    }
    //--------------------------------------------------
    function accessor_duration(d){ 
        var diff = accessor_RunningDuration(d);// returns -1 if the data is missing
        if(diff == -1) return 0;
        else return diff;
    }
    //--------------------------------------------------
    function format_duration_hoursminsec(diff){
        var dur = moment.duration(diff);
        return Math.floor(dur.asHours()) + moment.utc(diff).format(":mm:ss");
    }
    function format_duration_days(diff){
        return d3.format(".1f")(moment.duration(diff).asDays());
    }
    function format_data(d){
        if(d >= 1e12) return d3.format(",.2f")(d/ 1e12 );
        else return d3.format(",.2f")(d/ 1e9 );
    }
}//end: setup_totals()
//--------------------------------------------------
function update_totals(){

    // totals and table is not responding to status selector
    // it shows the count for the full range
    // refilter here
    var range = [ms(gmindomain), ms(gmaxdomain)];    
    // redefine this locally in here so I can not change the var names below right now
    var gdata_keyDateCreated_sorted_filtered = gdata_keyDateCreated_filterStatus_base.filter(function(d){
        return accessor_key(d).within(range);
    });

    g_totalduration = 0;
    g_totaldata = 0;
    gdata_keyDateCreated_sorted_filtered.forEach(function(d){
        g_totalduration += g_totals.duration.accessor(d);
        g_totaldata += accessor_TotalSize(d);
    });
    g_totalappsessions = gdata_keyDateCreated_sorted_filtered.length;
    var valtext_data = g_totals.data.format(g_totaldata);
    var valtext_sessions = g_totalappsessions;
    var valtext_status = function(){        
        if(selector.getval() == selector_allstatus_string) return totals_allstatus_string;
        else return selector.getval();
    }
    var valtext_status_color = function(){
        if(selector.getval() == selector_allstatus_string) return totals_valcolor;
        else if(selector.getval() == "Running") return fc(0,.8,.1, .9);
        else return color_selector[selector.getval()];
    }
    g_totals.duration.render(g_totalduration);
    g_totals.data.val_g.select("text").text(valtext_data);

    g_totals.data.units_g.select("text").text(function(){
        if(g_totaldata >= 1e12) return "Tb";
        else return "Gb";
    });

    g_totals.sessions.val_g.select("text").text(valtext_sessions);
    g_totals.status.val_g
        .fill(valtext_status_color)
        .style("font-size", "24px")
        .select("text")
        .text(valtext_status)
        ;

    g_totals.launchsource.val_g
        .fill(valtext_status_color)
        .style("font-size", "24px")
        .select("text")
        .text(selector_launchsource.getval)
        ;

}//end: update_totals()
//--------------------------------------------------
function setup_table(){
    table = {};
    table.heading_gap = 20;
    table.pos = point(20,40);
    table.dyrows = 40;
    table.dxcols = 200;
    //--------------------------------------------------
    table.outer_container =
        d3.select("#id_generic_slider")
        .append("div")
        .style("padding-top", "16px")
        .style("padding-bottom", "100px")
        .attr("align", "center")
        ;
    table.outer_container
        .style("background-color", fc(0,0,0, .03))
        .style("margin-left", "-20px")
        .style("width", "940px")
        ;
    setup_totals();
    update_totals();
    table.container = 
        table.outer_container
        .append("div")
        .style("margin-left", "auto")
        .style("margin-left", "auto")
        .style("display", "inline-block")
        .style("padding", "40px")
        .style("background-color", "rgba(0,0,0, .02)")
        ;
    //--------------------------------------------------
    setup_cols();
    function setup_cols(){
        var col;
        var basewidth = 140;
        //--------------------------------------------------
        // Id
        col = new Object;
        col.heading = "Id";
        col.accessor = function(d){ return "[id]"; }//return d.values[0].Id; }
        col.dx = basewidth;
        col.marginleft = 0;
        col.anchor = "end";
        col.align = "right";
        table.col_id = col;
        //--------------------------------------------------
        // date created
        col = new Object;
        col.heading = "Date Created";
        col.accessor = function(d){ return moment(d.values[0].DateCreated).format("M/D/YY, h:mm:ss a"); }
        col.dx = basewidth+10;
        col.marginleft = 0;
        col.anchor = "end";
        col.align = "right";
        table.col_created = col;
        //--------------------------------------------------
        // EMPTY
        col = new Object;
        col.heading = "";
        col.accessor = function(d){ return ""; }
        col.dx = 50;
        col.marginleft = 40;
        col.anchor = "start";
        col.align = "left";
        table.col_empty = col;
        //--------------------------------------------------
        // launch source
        col = new Object;
        col.heading = "Launched By";
        col.accessor = function(d){ return d.values[0].LaunchSource; }
        col.dx = basewidth-10;
        col.marginleft = 40;
        col.anchor = "start";
        col.align = "left";
        table.col_source = col;
        //--------------------------------------------------
        // status
        col = new Object;
        col.heading = "Status";
        col.accessor = function(d){ return d.values[0].Status; }
        col.dx = basewidth-100;
        col.marginleft = 0;
        col.anchor = "start";
        col.align = "left";
        table.col_status = col;
        //--------------------------------------------------
        // duration
        col = new Object;
        col.heading = "Duration";        
        col.accessor = function(d){ 
            var diff = accessor_RunningDuration(d);// returns -1 if the data is missing
            if(diff == -1) return "-------";
            var dur = moment.duration(diff);
            return Math.floor(dur.asHours()) + moment.utc(diff).format(":mm:ss");
        }
        col.dx = basewidth-10;        
        col.marginleft = 0;
        col.anchor = "end";
        col.align = "right";
        table.col_duration = col;
        //--------------------------------------------------
        // data
        col = new Object;
        col.heading = "Output Data";
        col.accessor = function(d){ 
            return d3.format(".1f")(accessor_TotalSize(d)/1000000000) + " Gb";
        }
        col.dx = basewidth-20;
        col.marginleft = 0;
        col.anchor = "end";
        col.align = "right";
        table.col_size = col;
        //--------------------------------------------------
        // EMPTY_2
        col = new Object;
        col.heading = "";
        col.accessor = function(d){ return ""; }
        col.dx = 30;
        col.marginleft = 0;
        col.anchor = "start";
        col.align = "left";
        table.col_empty_2 = col;
        //--------------------------------------------------
        table.col_list = [];
        table.col_list.push(table.col_created);
        table.col_list.push(table.col_empty);
        table.col_list.push(table.col_source);
        table.col_list.push(table.col_status);
        table.col_list.push(table.col_duration);
        table.col_list.push(table.col_size);
        table.col_list.push(table.col_empty_2);
        //--------------------------------------------------
        table.headingrow_div = 
            table.container.append("div")
            .attr("id", "id_headingrow_div")
            ;
        table.col_list.forEach(function(col,i_col){
            table.headingrow_div
                .append("span")
                .style("width", col.dx+"px")
                .style("text-align", col.align)
                .style("display", "inline-block")
                .append("text")
                .text(col.heading)
                .style("color", "rgba(0,0,0, .7)")
                .style("text-anchor", col.anchor)
                .style("font-weight", "600")
                ;
        });
        // horizontal rule
        table.headingrow_div.append("hr")
            .style("border", "0")
            .style("border-top", "1px solid #ccc")
            .style("margin", "10px")
            ;
        // group containing all rows
        table.rows_div = 
            table.container.append("div")
            .attr("id", "id_rows_div")
            .style("margin-top", table.heading_gap+"px")
            ;
        //--------------------------------------------------
        update_table();
    }//end: setup_cols()
}//end: setup_table()
//--------------------------------------------------
function update_table(){

    // totals and table is not responding to status selector
    // it shows the count for the full range
    // refilter here
    var range = [ms(gmindomain), ms(gmaxdomain)];    
    // redefine this locally in here so I can not change the var names below right now
    var gdata_keyDateCreated_sorted_filtered = gdata_keyDateCreated_filterStatus_base.filter(function(d){
        return accessor_key(d).within(range);
    });

    var reversed = gdata_keyDateCreated_sorted_filtered.slice().reverse();
    table.rowsel = 
        table.rows_div.selectAll("#id_row")
        .data(reversed, function(d){ return ms(d.key); })        
        ;
    table.enteringrows = 
        table.rowsel
        .enter()
        .insert("div")
        .style("margin-top","20px")
        .attr("id", "id_row")
        ;
    table.col_list.forEach(function(col,i_col){
        table.enteringrows
            .append("span")
            .style("width", col.dx+"px")
            .style("text-align", col.align)
            .style("display", "inline-block")
            .append("text")
            .text(function(d){ return col.accessor(d); })
            .style("color", "rgba(0,0,0, .7)")
            .style("text-anchor", col.anchor)
            ;
    table.rowsel
        .exit()
        .remove()
        ;
    });
}//end: update_table()
//--------------------------------------------------
function donut_title_clickhandler(arg){
    g_donuttitle.on();
    g_graphtitle.off();
    g_graphtitle2.off();
    donut.show();
    rdonut_g.show();
    graph1.hide();
    graph1.nodata.hide();
    update_data();
    donut.update();
    selector.show();
}
function graph_title_clickhandler(arg){
    g_donuttitle.off();
    g_graphtitle.on();
    g_graphtitle2.off();
    donut.hide();
    rdonut_g.hide();
    graph1.show();
    graph1.nodata.show();
    update_data();
    graph1.metric_button.off();
    graph1.toptext.text("Output Data");
    graph1.update(true);
    graph1.update_tooltips();
    selector.show();
}
function graph2_title_clickhandler(arg){
    g_donuttitle.off();
    g_graphtitle.off();
    g_graphtitle2.on();
    donut.hide();
    rdonut_g.hide();
    graph1.show();
    graph1.nodata.show();
    update_data();
    graph1.metric_button.on();
    graph1.toptext.text("Running Durations");
    graph1.update(true);
    graph1.update_tooltips();
    selector.show();
}
//--------------------------------------------------
var titlemenuclass = function(parent_sel){
    var g = parent_sel.append("g");
    this.g = g;
    var pos = point(0,0);
    var separation = point(4,0);
    var current = point(0, 22);
    var class_titlebutton = "class_titlebutton";
    var button_margin = point(10,5);
    //--------------------------------------------------
    g_donuttitle = new buttonclass(
        "Status",
        "id_titlebutton_donut",
        donut_title_clickhandler,
        0,
        g,
        button_margin,
        class_titlebutton
    );
    g_donuttitle.b.attr("transform", "translate(" + current.x + "," + current.y + ")");    
    current.x += g_donuttitle.b.node().getBBox().width + separation.x;
    //--------------------------------------------------
    g_graphtitle = new buttonclass(
        "Data",
        "id_graphbutton",
        graph_title_clickhandler,
        0,
        g,
        button_margin,
        class_titlebutton
    );
    g_graphtitle.b.attr("transform", "translate(" + current.x + "," + current.y + ")");        
    current.x += g_graphtitle.b.node().getBBox().width + separation.x;
    //--------------------------------------------------
    g_graphtitle2 = new buttonclass(
        "Duration",        
        "id_graphbutton2",
        graph2_title_clickhandler,
        0,
        g,
        button_margin,
        class_titlebutton
    );
    g_graphtitle2.b.attr("transform", "translate(" + current.x + "," + current.y + ")");    
    current.x += g_graphtitle2.b.node().getBBox().width + separation.x;
    //--------------------------------------------------
    g_donuttitle.on();
    g_graphtitle.off();
    g_graphtitle2.off();
}//end:titlemenuclass
//--------------------------------------------------
function add_logscale_slider(){
    var linktext = "logscale_base";
    var pos = point(20,20);
    var handler = function(val){
        logscale_base = val;
        graph1.update(true);
    }
    logscale_slider = new sliderclass(platform_svg, pos, handler, linktext);
    logscale_slider.g.translate(400,0);
    logscale_slider.range = [2, 100];
    logscale_slider.scale.range(logscale_slider.range);
    logscale_slider.setsliderfromval(logscale_base);
}
//--------------------------------------------------
function add_testcontrols(){
    g_testcontrols_svg = d3.select("#id_generic_slider")
        .append("svg")
        .attr("width", 900).attr("height", 300)
        ;
    slider_svg_rect = new rectclass();
    slider_svg_rect.set(0, 0, g_testcontrols_svg.attr("width"), g_testcontrols_svg.attr("height"));
    slider_svg_rect.c = "rgba(0,0,0, .05)";
    slider_svg_rect.append_to(g_testcontrols_svg);
    var xpos = 20;
    var ypos = 20;
    var yseparation = 6;
    //--------------------------------------------------
    add_testslider_set1();
    //add_testslider_set2();
    //--------------------------------------------------
    function add_testslider_set2(){
        var linktext = "N_INTERVALS";
        var handler = function(val){
            g_n_intervals = Math.floor(val + .5);
            //graph2.update_plot_from_n_intervals();
        }
        var s = new sliderclass(g_testcontrols_svg, point(xpos, ypos), handler, linktext);
        s.range = [1, 100];
        s.scale.range(s.range);
        s.setsliderfromval(g_n_intervals);
        g_sliderlist.push(s);
    }//end: add_testslider_set2()
    //--------------------------------------------------
    function add_testslider_set1(){
        //--------------------------------------------------
        testslider = new sliderclass(g_testcontrols_svg, point(xpos, ypos), scale_donut, "PIECHART SCALE");
        testslider.range = [.5, 2];
        testslider.scale.range(testslider.range);
        testslider.setsliderfromval(donutscale);
        //--------------------------------------------------
        ypos += testslider.boundingrect.bottom() + yseparation;
        var s = new sliderclass(g_testcontrols_svg, point(xpos, ypos), modify_charge, "CHARGE");
        s.range = [-3000, 3000];
        s.scale.range(s.range);
        s.setsliderfromval(donut.force_parameters.charge);
        function modify_charge(val){
            donut.force_parameters.charge = val;
            donut.labelforcegraph.force.charge(donut.force_parameters.charge);
            donut.labelforcegraph.force.start();
        }
        g_sliderlist.push(s);
        //--------------------------------------------------
        ypos += testslider.boundingrect.bottom() + yseparation;
        var s = new sliderclass(g_testcontrols_svg, point(xpos, ypos), modify_linkdistance, "LINK DISTANCE");
        s.range = [0, 50];
        s.scale.range(s.range);
        s.setsliderfromval(donut.force_parameters.linkdistance);
        function modify_linkdistance(val){
            donut.force_parameters.linkdistance = val;
            donut.labelforcegraph.force.linkDistance(donut.force_parameters.linkdistance);
            donut.labelforcegraph.force.start();
        }
        g_sliderlist.push(s);
        //--------------------------------------------------
        var linkvar = donut.force_parameters.gravity;
        var linktext = "GRAVITY";
        ypos += testslider.boundingrect.bottom() + yseparation;
        var s = new sliderclass(g_testcontrols_svg, point(xpos, ypos), modify_gravity, linktext);
        s.range = [-2, 2];
        s.scale.range(s.range);
        s.setsliderfromval(linkvar);
        function modify_gravity(val){
            linkvar = val;
            donut.labelforcegraph.force.gravity(linkvar);
            donut.labelforcegraph.force.start();
        }
        g_sliderlist.push(s);
        //--------------------------------------------------
        linkvar = donut.force_parameters.chargedistance;
        linktext = "CHARGE DISTANCE";
        ypos += testslider.boundingrect.bottom() + yseparation;
        var s = new sliderclass(g_testcontrols_svg, point(xpos, ypos), modify_chargedistance, linktext);
        s.range = [0, 500];
        s.scale.range(s.range);
        s.setsliderfromval(linkvar);
        function modify_chargedistance(val) {
            linkvar = val;
            donut.labelforcegraph.force.chargeDistance(linkvar);
            donut.labelforcegraph.force.start();
        }
        g_sliderlist.push(s);
        //--------------------------------------------------
        linkvar = donut.force_parameters.linkstrength;
        linktext = "LINK STRENGTH";
        ypos += testslider.boundingrect.bottom() + yseparation;
        var s = new sliderclass(g_testcontrols_svg, point(xpos, ypos), modify_linkstrength, linktext);
        s.range = [-30, 30];
        s.scale.range(s.range);
        s.setsliderfromval(linkvar);
        function modify_linkstrength(val) {
            linkvar = val;
            donut.labelforcegraph.force.linkStrength(linkvar);
            donut.labelforcegraph.force.start();
        }
        g_sliderlist.push(s);
        //--------------------------------------------------
        linkvar = donut.force_parameters.friction;
        linktext = "FRICTION";
        ypos += testslider.boundingrect.bottom() + yseparation;
        var s = new sliderclass(g_testcontrols_svg, point(xpos, ypos), modify_friction, linktext);
        s.range = [0, 1];
        s.scale.range(s.range);
        s.setsliderfromval(linkvar);
        function modify_friction(val) {
            linkvar = val;
            donut.labelforcegraph.force.friction(linkvar);
            donut.labelforcegraph.force.start();
        }
        g_sliderlist.push(s);
        //--------------------------------------------------
        linkvar = donut.force_parameters.theta;
        linktext = "THETA";
        var handler = modify_theta;
        function modify_theta(val) {
            linkvar = val;
            donut.labelforcegraph.force.theta(linkvar);
            donut.labelforcegraph.force.start();
        }
        ypos += testslider.boundingrect.bottom() + yseparation;
        var s = new sliderclass(g_testcontrols_svg, point(xpos, ypos), handler, linktext);
        s.range = [-4, 4];
        s.scale.range(s.range);
        s.setsliderfromval(linkvar);
        g_sliderlist.push(s);
        //--------------------------------------------------
        linkvar = donut.angle;
        linktext = "START ANGLE";
        var handler = modify_startangle;
        function modify_startangle(val) {
            linkvar = val;
            donut.pie
                .startAngle(linkvar)
                .endAngle(linkvar + 2 * Math.PI);
            donut.update();
        }
        ypos += testslider.boundingrect.bottom() + yseparation;
        var s = new sliderclass(g_testcontrols_svg, point(xpos, ypos), handler, linktext);
        s.range = [0, 2 * Math.PI];
        s.scale.range(s.range);
        s.setsliderfromval(linkvar);
        g_sliderlist.push(s);
        //--------------------------------------------------
        linkvar = donut.force_parameters.alpha;
        linktext = "ALPHA";
        var handler = modify_alpha;
        function modify_alpha(val) {
            linkvar = val;
            donut.labelforcegraph.force.alpha(linkvar);
            donut.labelforcegraph.force.start();
        }
        ypos += testslider.boundingrect.bottom() + yseparation;
        var s = new sliderclass(g_testcontrols_svg, point(xpos, ypos), handler, linktext);
        s.range = [-1, 1];
        s.scale.range(s.range);
        s.setsliderfromval(linkvar);
        g_sliderlist.push(s);
    }//end: add_testslider_set1()
}//end: add_testcontrols()
//--------------------------------------------------
function end_event_function(){
    graph1.update_tooltips();
    update_table();
}
function g_update(){
    update_data();
    update_totals();
    if(donut.donut_g.style("visibility") == "visible") donut.update();
    if (graph1.base_g.style("visibility") == "visible") graph1.update(false);
}
function g_update_with_transitions(){
    update_data();
    update_totals();
    if(donut.donut_g.style("visibility") == "visible") donut.update();    
    if (graph1.base_g.style("visibility") == "visible") graph1.update(true);
}
function flink_left(val){
    gmindomain = val;
    g_update();
}
function flink_right(val){
    gmaxdomain = val;
    g_update();
}
function scale_donut(val){
    donutscale = val;
    svg_g.attr("transform", function (d) {
        var s = "";
        s += "translate(" + donutpos.x + "," + donutpos.y + ")";
        s += " scale(" + donutscale + ")";
        return s;
    });
}
//--------------------------------------------------
var setup_data = function(dataset){

    // change any unrecognized statuses to "Unknown"
    dataset.forEach(function(d){
        if(order.indexOf(d.Status) == -1){
            cout("not found status: '"+d.Status+"', changing it to 'Undefined'.");
            d.Status = "Undefined";
        }
    });

    gdata_base = dataset;

    /*
    gdata_keyDateCreated_sorted_base = d3.nest()
        .key(function(d){ return d.DateCreated; })
        .sortKeys(d3.ascending)
        .entries(gdata_base)
        ;
    */
    // problems with the above because there are actually some identical 
    // DateCreated values, so those get nested together and it 
    // causes problems with using absolute_index.
    // For now: manually nesting to give every element its own key.
    // - to do: remove nesting for arrays ordered by DateCreated
    gdata_keyDateCreated_sorted_base = 
        gdata_base.map(function(d){
            return {
                key: d.DateCreated,
                values: [d]
            };
        });
    gdata_keyDateCreated_sorted_base.sort(function(a,b){
        return ms(a.key) - ms(b.key);
    });
    gdata_keyDateCreated_sorted_base.forEach(function(d,i){ 
        d.absolute_index = i;
    });

    g_DateCreated_min = gdata_keyDateCreated_sorted_base[0].key;
    g_DateCreated_max = gdata_keyDateCreated_sorted_base.last().key;

    g_TotalSize_range = d3.extent(gdata_keyDateCreated_sorted_base, accessor_TotalSize);
    g_RunningDuration_range = d3.extent(gdata_keyDateCreated_sorted_base, accessor_RunningDuration);
    gdata_keyStatus_sorted_base = d3.nest()
        .key(function(d){ return d.Status; })
        .sortValues(function(a,b){ return ms(a.DateCreated) - ms(b.DateCreated); })
        .entries(gdata_base)
        ;
    // insert blank entries for missing statuses
    order.forEach(function(status){
        if(gdata_keyStatus_sorted_base.filter(function(d){ return d.key == status; }).length == 0){
            gdata_keyStatus_sorted_base.push({key:status,values:[]});
        }
    });
    // order the keys, 
    // this order is optimized for the visual layout of arcs in the piechart
    // - however: AwaitingAuthorization was added late 
    // and its position in the order has not been tested for how it translates visually
    // in the piechart, in datasets that include the full set of statuses.
    gdata_keyStatus_sorted_base = gdata_keyStatus_sorted_base.slice()
        .sort(function(a,b){ return order.indexOf(a.key) - order.indexOf(b.key); })
        ;
    // put a copy in filtered array    
    gdata_keyStatus_sorted_filtered = gdata_keyStatus_sorted_base.map(function(d){
        return {
            key: d.key,
            values: d.values.slice(),
            absolute_index: d.absolute_index
        };
    });
    // make keyDateCreated base array for each status
    status_bases = {};
    // add one for all-statuses
    status_bases[selector_allstatus_string] = gdata_keyDateCreated_sorted_base.slice();
    // add one for each individual status
    // currently we only filter by one status at a time
    order.forEach(function(status){
        status_bases[status] = gdata_keyDateCreated_sorted_base.filter(function(d){ 
            return d.values[0].Status == status; 
        });
    });
    status_bases.get_copy = function(status_key){
        return getcopyofnestedarray(status_bases[status_key]);
    }
    // initialize current base and filtered arrays to the all-status base array
    gdata_keyDateCreated_filterStatus_base = status_bases.get_copy(selector_allstatus_string);
    gdata_keyDateCreated_sorted_filtered = status_bases.get_copy(selector_allstatus_string);
    currentindex.push(0);
    currentindex.push(gdata_keyDateCreated_filterStatus_base.length-1);
    // make corresponding arrays that contain only the keys
    // so we can use indexOf() later
    keylists = {};
    var status_labels = [selector_allstatus_string].concat(order);
    status_labels.forEach(function(status){
        keylists[status] = status_bases[status].map(function(d){ return d.key; });
    });
    // initialize pointer to current base
    keylist_filterStatus_base = keylists[selector_allstatus_string];
}//end:setup_data()
//--------------------------------------------------
var update_data = function(){
    
    // "selector" is the Status selector
    if(selector.changed || selector_launchsource.changed){
        
        // turn off the changed flags in the slectors
        selector.changed = false;
        selector_launchsource.changed = false;
        
        // first get the pre-built status-filtered array
        gdata_keyDateCreated_filterStatus_base = status_bases.get_copy(selector.getval());
        keylist_filterStatus_base = keylists[selector.getval()];

        // then filter by LaunchSource if it's not "all"
        if(selector_launchsource.getval() != selector_alllaunchsource_string){
            var filtered = [];
            var filtered_keylist = [];
            gdata_keyDateCreated_filterStatus_base.forEach(function(d,i){
                if(d.values[0].LaunchSource == selector_launchsource.getval() ){
                    filtered.push(d);
                    filtered_keylist.push(keylist_filterStatus_base[i]);
                }
            });
            gdata_keyDateCreated_filterStatus_base = filtered.slice();
            keylist_filterStatus_base = filtered_keylist.slice();
        }

        // move index range to outer indices since we changed to a new status array
        currentindex[0] = 0;
        currentindex[1] = gdata_keyDateCreated_filterStatus_base.length-1;
    }

    // at this point:
    // if the selectors were changed, then 
    // gdata_keyDateCreated_filterStatus_base has been filtered 
    // by status, and by launchsource
    // - next filter it further by the current date range

    var range = [ms(gmindomain),ms(gmaxdomain)];

    // check if there are no sessions in the current slider range
    // adding this to stop a bug where the table populates
    // when there are no sessions in range and you select a status from the dropdown
    // - this and the range assignment should move up top
    var totalsessions_unfiltered = gdata_keyDateCreated_sorted_base.filter(function(d){
        return accessor_key(d).within(range);
    });
    if(totalsessions_unfiltered == 0){
        // all sessions are filtered out by rangeslider alone regardless of status filter
        gdata_keyDateCreated_sorted_filtered = [];
    }


    // check against currently selected status if other than "all"
    if(selector.getval() != selector_allstatus_string){

        var withcurrentstatus = 0;
        totalsessions_unfiltered.forEach(function(d){

            d.values.forEach(function(val){ 
                if(String(val.Status) == String(selector.getval())){ 
                    withcurrentstatus++; 
                } 
            });
        });
        if(withcurrentstatus == 0) gdata_keyDateCreated_sorted_filtered = [];
    }

    // at this point:
    // if a status was selected in the dropdown that has no sessions
    // then gdata_keyDateCreated_filterStatus_base is an empty array
    // so don't update currentindex. Currentindex is the pair of indices
    // in the cumulatively-filtered array that corresponds to the date range
    // that's being set by the rangeslider

    //if(gdata_keyDateCreated_filterStatus_base.length > 0){
    if(gdata_keyDateCreated_filterStatus_base.length > 0  &&  
        totalsessions_unfiltered != 0 ){

        var max_index = gdata_keyDateCreated_filterStatus_base.length-1;    
        var currentrange = [
            ms(gdata_keyDateCreated_filterStatus_base[currentindex[0]].key),
            ms(gdata_keyDateCreated_filterStatus_base[currentindex[1]].key)
        ];
        //--------------------------------------------------
        // handle upper/lower bound changes in range array
        // range lower value:
        if(range[0] < currentrange[0]){                    
            // range bottom was lowered
            // go down from current index
            // reset index until we find one out of range, 
            for(var i=currentindex[0];i>=0;i--){
                var t = ms(gdata_keyDateCreated_filterStatus_base[i].key);
                if(t >= range[0]){
                    currentindex[0] = i;
                }
                else{
                    break;
                }
            }
        }
        else if(range[0] > currentrange[0]){                    
            // range bottom value was raised
            // go up from current index
            // reset index when we encounter the first in-range
            for(var i=currentindex[0];i<=max_index;i++){
                var t = ms(gdata_keyDateCreated_filterStatus_base[i].key);
                if(range[0] <= t){
                    currentindex[0] = i;
                    break;
                }
            }
        }
        // range upper value:
        if(range[1] < currentrange[1]){            
            // range top was lowered
            // go down from current index
            // reset index when we encounter the first in-range
            for(var i=currentindex[1];i>=0;i--){
                var t = ms(gdata_keyDateCreated_filterStatus_base[i].key);
                if(t <= range[1]){
                    currentindex[1] = i;
                    break;
                }
            }
        }
        else if(range[1] > currentrange[1]){            
            // range top value was raised
            // go up from current index
            // reset index until we find one out of range
            for(var i=currentindex[1];i<=max_index;i++){
                var t = ms(gdata_keyDateCreated_filterStatus_base[i].key);
                if(t <= range[1]){
                    currentindex[1] = i;                
                }
                else{
                    break;
                }
            }
        }
        //--------------------------------------------------
        if(currentindex[1] == gdata_keyDateCreated_filterStatus_base.length-1){
            gdata_keyDateCreated_sorted_filtered = 
                gdata_keyDateCreated_filterStatus_base.slice(currentindex[0]);
        }
        else{
            gdata_keyDateCreated_sorted_filtered = 
                gdata_keyDateCreated_filterStatus_base.slice(currentindex[0], currentindex[1]+1);
        }
        g_TotalSize_range = 
            d3.extent(gdata_keyDateCreated_sorted_filtered, accessor_TotalSize);
        g_RunningDuration_range = 
            d3.extent(gdata_keyDateCreated_sorted_filtered, accessor_RunningDuration);    

    }//end: if(gdata_keyDateCreated_filterStatus_base.length > 0)
    else{
        // gdata_keyDateCreated_filterStatus_base is empty,
        // eg we selected a status that has no sessions in this data
        
        gdata_keyDateCreated_sorted_filtered = [];

        g_TotalSize_range = d3.extent(gdata_keyDateCreated_sorted_base, accessor_TotalSize);
        g_RunningDuration_range = d3.extent(gdata_keyDateCreated_sorted_base, accessor_RunningDuration);
    }

    //--------------------------------------------------
    // upate donut if it's visible
    if(selector_launchsource.getval() == selector_alllaunchsource_string){
        // launchsource is not filtered, it's set to "all"
        // so only filter by date range
        if(donut.donut_g.style("visibility") == "visible"){
            gdata_keyStatus_sorted_filtered = gdata_keyStatus_sorted_base.map(function(d){
                return {
                    key: d.key,
                    values: d.values.filter(function(value){ return ms(value.DateCreated).within(range); })
                }
            });
        }        
    }
    else{
        // the LaunchSource dropdown has selected something other than "all"
        if(donut.donut_g.style("visibility") == "visible"){
            gdata_keyStatus_sorted_filtered = gdata_keyStatus_sorted_base.map(function(d){                
                return {
                    key: d.key,
                    values: d.values.filter(function(value){ return ms(value.DateCreated).within(range); })
                }
            });
            // filter by LaunchSource in addition to date range
            // doing it in a separate loop here becasue of an issue with strings not evaulating as equal
            gdata_keyStatus_sorted_filtered.forEach(function(status){
                status.values = status.values.filter(function(d){ return d.LaunchSource == selector_launchsource.getval(); });
            });
        }        
    }

}//end:update_data()
























