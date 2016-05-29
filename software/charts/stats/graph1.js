//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
var graphclass1_b = function (graph_parent_sel, rect0, args){
    var that = this;
    var baserect;
    var base_g;
    var datapoint_circle_radius;
    var graphrect;
    var drawrect;
    var datapointsrect;
    var xaxis_g;
    var yaxis_g;
    var interiorlines_g;
    var y0line;
    var datapoints_g;
    var hscale;
    var hscale_old;        
    var domain_RunningDuration;
    var ratio;
    var xaxis;
    var yaxis;
    var xaxis_label;
    var yaxis_label;
    var xdomain;
    var xrange;
    var ydomain;
    var yrange;
    var ydomain_extended;    
    var yrange_extended;
    var ydomain_min_minimum;
    var xdomain_min_minimum;
    var vscale;    
    var vscale_old;    
    var hgridlines;
    var vgridlines;
    var tick = {};
    var data = {};
    var dataset;
    var circlecolor_TotalSize = "rgba(255,50,0, .7)";
    var circlecolor_RunningDuration = "rgba(0,0,150, .7)";
    var circlecolor = "rgba(0,0,0, 1)";
    var expand_button;
    var metric_button;
    var accessor_xdomainmetric;
    var accessor_ydomainmetric;
    var lines;    
    var circles;
    var circles_g;
    var pointlist = [];
    var lines_g;
    var clip;
    var nodata;
    var graph_g;
    var logscale_button;
    var fit_button;
    //--------------------------------------------------
    setup();
    //--------------------------------------------------
    this.base_g = base_g;
    this.drawrect = drawrect;
    this.datapointsrect = datapointsrect;
    this.vscale = vscale;
    this.data = data;
    //--------------------------------------------------
    // these are used in analytics->preset1()
    this.expand_button = expand_button;
    this.metric_button = metric_button;
    this.update = update;
    //--------------------------------------------------
    this.update_tooltips = update_tooltips; // so rangeslider can call when drag finishes
    //--------------------------------------------------
    function setup(){
        ydomain_min_minimum = 0;
        xdomain_min_minimum = 0;
        //--------------------------------------------------
        datapoint_circle_radius = 2;
        var drawrect_bgcolor = "rgba(250,250,250, 1)";
        //--------------------------------------------------
        baserect = rect0.get_copy();
        baserect.x = 0;
        baserect.y = 0;
        base_g = graph_parent_sel.append("g");
        base_g.attr("transform", "translate(" + rect0.left() + "," + rect0.top() + ")");
        graphrect = baserect.get_inrect();
        graphrect.m.set_all(0);
        graphrect.c = "rgba(255,0,0, 0)";
        drawrect = graphrect.get_inrect();
        drawrect.m.set(0,0,60,10);
        drawrect.c = drawrect_bgcolor;
        datapointsrect = drawrect.get_inrect();
        graph_g = base_g.append("g");
        append_rect_fill(graph_g, graphrect);
        drawrect.sel = append_rect_fill(graph_g, drawrect);
        append_rect_stroke(graph_g, drawrect);
        xaxis_g = graph_g.append("g")
            .attr("class", "axis")
            .attr("id", "id_xaxis_g")
            .attr("transform", "translate(0," + drawrect.bottom() + ")")
            ;        
        yaxis_g = graph_g.append("g")
            .attr("class", "axis")
            .attr("id", "id_yaxis_g")
            .attr("transform", "translate(" + drawrect.left() + ",0)")
            ;
        xaxis_label = graph_g.append("text")
            .style("font", "11px sans-serif")
            .attr("fill", "#888")
            .attr("text-anchor", "end")
            .attr("x", datapointsrect.right())
            .attr("y", drawrect.bottom() + 35)
            .text("session number in complete dataset")
            ;
        interiorlines_g = graph_g.append("g");
        y0line = interiorlines_g.append("line")
        apply_style(y0line, style_line_dasheddark);
        data.g = graph_g.append("g");
        vscale = d3.scale.linear();
        //--------------------------------------------------
        yrange = [datapointsrect.bottom(), datapointsrect.top()];
        yrange_extended = [datapointsrect.bottom(), drawrect.top()];
        ratio = size(yrange_extended) / size(yrange);
        ydomain = args.ydomain;
        limit_ydomain();
        ydomain_extended = ydomain.slice();
        ydomain_extended[1] = ydomain_extended[0] + (size(ydomain) * ratio);
        vscale = vscale.domain(ydomain);
        vscale = vscale.range(yrange);        
        vscale_old = vscale.copy();
        //--------------------------------------------------
        tick.y = tick_data;
        tick.x = tick_time;
        //--------------------------------------------------
        dataset = gdata_keyDateCreated_sorted_filtered;
        domain_RunningDuration = d3.extent(dataset, accessor_RunningDuration);
        domain_RunningDuration[0] = 0;
        var range_RunningDuration = [datapointsrect.bottom(), datapointsrect.top()];
        var vscale_extended = vscale.copy().domain(ydomain_extended).range(yrange_extended);
        yaxis = d3.svg.axis()
            .scale(vscale_extended)
            .orient("left")
            .tickFormat(tick.y)
            ;
        xdomain = [moment(gmindomain), moment(gmaxdomain)];
        that.xdomain = xdomain;
        xrange = [datapointsrect.left(), datapointsrect.right()];
        hscale = d3.time.scale();
        hscale = hscale.domain(xdomain);
        hscale = hscale.range(xrange);        
        hscale_old = hscale.copy();
        //--------------------------------------------------
        hgridlines = {};
        var vscale_extended = vscale.copy().domain(ydomain_extended).range(yrange_extended);
        hgridlines.axis = d3.svg.axis()
            .scale(vscale_extended)
            .orient("left")
            .tickSize(-drawrect.w, 0, 0)
            .tickFormat("")
            ;
        hgridlines.g = graph_g.append("g")
            .attr("id","id_hgridlines_g")
            ;
        hgridlines.g.call(hgridlines.axis);
        apply_style(hgridlines.g.selectAll("line"), style_line_dashed);
        hgridlines.g.selectAll("path").hide();
        vgridlines = {};
        vgridlines.axis = d3.svg.axis()
            .scale(hscale)
            .orient("bottom")
            .tickSize(drawrect.h, 0, 0)
            .tickFormat("")
            ;
        vgridlines.g = graph_g.append("g")
            .attr("id","id_vgridlines_g")
            ;
        vgridlines.g.call(vgridlines.axis);
        apply_style(vgridlines.g.selectAll("line"), style_line_dashed);
        vgridlines.g.selectAll("path").hide();
        //--------------------------------------------------
        create_menu();
        function create_menu(){
            var currentpos = point(datapointsrect.right()-7, drawrect.top()+8);
            var sep = g_small_menu_separation_point;
            var b;
            var bg_on = fc(.75,.75,.75, .9);
            var bg_off = fc(.9,.9,.9, .9);
            create_expand_button();
            create_logscale_button();
            logscale_button.changed = false;
            create_metric_button();
            create_fit_button();
            //--------------------------------------------------
            function create_expand_button(){
                var button_text = "expand";
                var button_id = "id";
                var clickhandler_function = expand_button_clickhandler;
                var button_clickhandler_arg = 0;
                var button_parent_sel = graph_g;
                var interiormargin_point = point(6,3);
                var button_class = "slider_button_text2";
                expand_button = new buttonclass(
                    button_text,
                    button_id,
                    clickhandler_function,
                    button_clickhandler_arg,
                    button_parent_sel,
                    interiormargin_point,
                    button_class
                    );
                var text_on = "rgba(0,0,0, .9)";
                var text_off = "rgba(0,0,0, .4)";
                expand_button.colors(bg_on, bg_off, text_on, text_off);
                expand_button.off();
            }
            b = expand_button;
            b.set_right(currentpos.x);
            b.set_top(currentpos.y);
            currentpos.x = b.rectposition.left() - sep.x;
            //--------------------------------------------------
            selector = create_dropdown();
            function create_dropdown(){
                var right = -246;
                var top = 75;
                var width = 110;
                var height = 24;
                var ontop = d3.select("#id_platform").append("div")
                    .style("position", "relative")
                    
                    // 4/13
                    /*
                    .style("width", "0px")
                    */

                    .style("height", "0px")
                    ;
                var dropdown = ontop.append("select")
                    .attr("name", "filter by Status")
                    .style("font-size", "14px")
                    .style("color", totals_valcolor)
                    .style("font-weight", "bold")
                    .style("width", width+"px")
                    .style("height", height+"px")
                    .on("change", change_dropdown)
                    ;
                var divright = right+width;
                var divtop = top-height;
                ontop
                    .style("right", divright+"px")
                    .style("top", divtop+"px")
                    ;
                var a = gdata_keyStatus_sorted_filtered.map(function(d){return d.key;});
                a.unshift(selector_allstatus_string);
                var options = dropdown.selectAll("option")
                    .data(a)
                    .enter().append("option")
                    ;
                options
                    .text(function(d){ return d; })
                    .attr("value", function(d){ return d; })
                    ;
                function change_dropdown(){
                    dropdown.changed = true;
                    g_update_with_transitions();
                    end_event_function();
                }
                dropdown.getval = function(){
                    var index = dropdown.property("selectedIndex");
                    var value = dropdown.node().options[index].value;
                    return value;
                }
                dropdown.changed = false;
                // add as property so it can be moved later in totals
                dropdown.ontop = ontop;
                dropdown.ontop.width = width;
                return dropdown;
            }//end: create_dropdown()
            //--------------------------------------------------
            selector_launchsource = create_selector_launchsource();
            function create_selector_launchsource(){
                var right = -246;
                var top = 75;
                var width = 110;
                var height = 24;
                var ontop = d3.select("#id_platform").append("div")
                    .style("position", "relative")

                    // 4/13
                    /*
                    .style("width", "0px")
                    */

                    .style("height", "0px")
                    ;
                var selector = 
                    ontop.append("select")
                    .attr("name", "filter by Launch Source")
                    .style("font-size", "14px")
                    .style("color", totals_valcolor)
                    .style("font-weight", "bold")
                    .style("width", width+"px")
                    .style("height", height+"px")
                    .on("change", change_selector_launchsource)
                    ;
                var divright = right+width;
                var divtop = top-height;
                ontop
                    .style("right", divright+"px")
                    .style("top", divtop+"px")
                    ;                    
                var a = [
                    selector_alllaunchsource_string,
                    "Developer",
                    "User"
                ];
                var options = selector.selectAll("option")
                    .data(a)
                    .enter().append("option")
                    ;
                options
                    .text(function(d){ return d; })
                    .attr("value", function(d){ return d; })
                    ;

                function change_selector_launchsource(){
                    selector_launchsource.changed = true;                    
                    g_update_with_transitions();
                    end_event_function();
                }

                selector.getval = function(){
                    var index = selector.property("selectedIndex");
                    var value = selector.node().options[index].value;
                    return value;
                }
                selector.changed = false;
                // add as property so it can be moved later in totals
                selector.ontop = ontop;
                selector.ontop.width = width;
                return selector;
            }//end: create_selector_launchsource()
            //--------------------------------------------------
            function create_logscale_button(){
                var text = "log scale";
                var id = "id";
                var clickhandler = logscale_button_clickhandler;
                var clickhandler_arg = 0;
                var parent_sel = graph_g;
                var interiormargin_point = point(6,3);
                var button_class = "slider_button_text2";
                logscale_button = new buttonclass(
                    text,
                    id,
                    clickhandler,
                    clickhandler_arg,
                    parent_sel,
                    interiormargin_point,
                    button_class
                    );
                var text_on = "rgba(0,0,0, .9)";
                var text_off = "rgba(0,0,0, .4)";
                logscale_button.colors(bg_on, bg_off, text_on, text_off);
                logscale_button.off();            
            }
            b = logscale_button;
            b.set_right(currentpos.x);
            b.set_top(currentpos.y);
            currentpos.x = b.rectposition.left() - sep.x;
            //--------------------------------------------------
            function create_fit_button(){
                var text = "fit to data";
                var id = "id";
                var clickhandler = fit_button_clickhandler;
                var clickhandler_arg = 0;
                var parent_sel = graph_g;
                var interiormargin_point = point(6,3);
                var button_class = "slider_button_text2";
                fit_button = new buttonclass(
                    text,
                    id,
                    clickhandler,
                    clickhandler_arg,
                    parent_sel,
                    interiormargin_point,
                    button_class
                    );
                var text_on = "rgba(0,0,0, .9)";
                var text_off = "rgba(0,0,0, .4)";
                fit_button.colors(bg_on, bg_off, text_on, text_off);
                fit_button.off();            
            }
            b = fit_button;
            b.set_right(currentpos.x);
            b.set_top(currentpos.y);
            currentpos.x = b.rectposition.left() - sep.x;
            //--------------------------------------------------
            function create_metric_button(){
                var text = "duration";
                var id = "id";
                var clickhandler = metric_button_clickhandler;        
                var clickhandler_arg = 0;
                var parent_sel = graph_g;
                var interiormargin_point = point(6,3);
                var button_class = "slider_button_text2";
                metric_button = new buttonclass(
                    text,
                    id,
                    clickhandler,
                    clickhandler_arg,
                    parent_sel,
                    interiormargin_point,
                    button_class
                    );
                var text_on = "rgba(0,0,0, .9)";
                var text_off = "rgba(0,0,0, .4)";
                var bg_on = "rgba(0,0,0, .2)";
                var bg_off = "rgba(0,0,0, .1)";
                metric_button.colors(bg_on, bg_off, text_on, text_off);
                metric_button.off();            
            }
            b = metric_button;
            b.set_right(currentpos.x);
            b.set_top(currentpos.y);
            currentpos.x = b.rectposition.left() - sep.x;
        }//end: create_menu()
        //--------------------------------------------------
        circles_g = data.g.append("g");
        lines_g = data.g.append("g");
        lines = lines_g.selectAll("path")
            .attr("fill", "none")
            .attr("stroke", "rgba(0,0,0, .3)")
            ;
        var defs = platform_svg.append("svg:defs");
        clip = defs.append("svg:clipPath")
            .attr("id", "clip")
            .append("svg:rect")
            ;
        clip = drawrect.copy_to(clip);
        data.g.attr("clip-path", "url(#clip)");
        //--------------------------------------------------
        create_nodata_display();
        function create_nodata_display(){
            nodata = {};
            nodata.g = base_g.append("g");                    
            nodata.rect = drawrect.get_copy();
            nodata.rect.append_to(nodata.g);
            nodata.text_g = platform_svg.append("g")
                .attr("class","class_titlebutton")
                .style("fill","rgba(0,0,0, .35)")
                .attr("text-anchor","middle")
                // match donut location
                .translate(450,265)
                ;
            nodata.text_g.append("text")
                .attr("dy", 0)
                .text("No Appsessions")
                ;
            nodata.text_g.append("text")
                .attr("dy", 26)
                .text("")
                ;
            nodata.hide = function(){ 
                nodata.g.hide();
                nodata.text_g.hide();
                nodata.text_g.attr("display", "none");
            }
            nodata.show = function(){ 
                nodata.g.show(); 
                nodata.text_g.show();
                nodata.text_g.attr("display", "inherit");
            }
        }
        that.nodata = nodata;
        //--------------------------------------------------
        //quick fix remove metric button
        metric_button.b.attr("display", "none");
        //--------------------------------------------------
    }//end: setup()
    //--------------------------------------------------
    function update(transition_flag){
        var delay;
        var duration;
        var ease;
        //--------------------------------------------------
        if(gdata_keyDateCreated_sorted_filtered.length > 0){
            nodata.hide();
            graph_g.show();
            update_graph_data();
            set_transition_params();
            update_metrics_view();
            update_gridlines();
            update_pointlist();
            update_plot();
        }
        else{
            nodata.show();
            graph_g.hide();
        }
        that.hscale = hscale;
        //--------------------------------------------------
        function set_transition_params(){
            if(transition_flag  ||  expand_button.state){
                delay = 0;
                duration = g_duration;
                ease = g_ease;
            }
            else{
                delay = 0;
                duration = 0;
                ease = "linear";
            }
        }
        //--------------------------------------------------
        function update_graph_data(){
            dataset = gdata_keyDateCreated_sorted_filtered.slice();
            that.dataset = dataset;// testing
            if(metric_button.state){
                accessor_ydomainmetric = function(d,i){ return accessor_RunningDuration(d,i); }
            }
            else{
                accessor_ydomainmetric = function(d,i){ return accessor_TotalSize(d,i); }
            }

            var keylist = keylist_filterStatus_base;

            function get_baseindex(key){
                return keylist.indexOf(key);
            }
            function get_precedingindex(key){
                var index_in_base = get_baseindex(key);
                if(index_in_base > 0){
                    return index_in_base-1;
                }
                else return -1;
            }
            function get_nextindex(key){
                var index_in_base = get_baseindex(key);
                if(index_in_base < gdata_keyDateCreated_filterStatus_base.length-1){
                    return index_in_base+1;
                }
                else return -1;
            }
            function get_outsideindices(){
                return [get_precedingindex(dataset[0].key), get_nextindex(dataset.last().key)];
            }
            if(dataset.length > 0){
                var pair = get_outsideindices();
                if(pair[0] != -1){
                    dataset.unshift(gdata_keyDateCreated_filterStatus_base[pair[0]]);
                }
                else{
                    //cout("pair[0] was -1");
                }
                if(pair[1] != -1){
                    dataset.push(gdata_keyDateCreated_filterStatus_base[pair[1]]);
                }
                else{
                    //cout("pair[1] was -1");
                }
            }
        }//end: update_graph_data()
        //--------------------------------------------------
        function update_metrics_view(){
            if(expand_button.state){
                xdomain = get_appsessiondomain();
                if( isNaN(xdomain[0]) 
                    || isNaN(xdomain[1]) 
                    || xdomain[0]==undefined 
                    || xdomain[1]==undefined)
                {
                    //cout("get_appsessiondomain() return nan or undefined");
                    xdomain = [0,0];
                }
                limit_xdomain();
                that.xdomain = xdomain;
                accessor_xdomainmetric = function(d,i){ return accessor_absolute_index(d); }
                tick.x = function(arg){ return arg; }
                hscale = d3.scale.linear()
                    .domain(xdomain)
                    .range(xrange)
                    ;
                xaxis_label.text("session number")
            }
            else{                
                xdomain = get_timedomain();
                if( isNaN(xdomain[0]) 
                    || isNaN(xdomain[1])
                    || xdomain[0]==undefined 
                    || xdomain[1]==undefined)
                {
                    //cout("get_timedomain() return nan or undefined, there's nothing here to handle that");
                }
                that.xdomain = xdomain;
                accessor_xdomainmetric = function(d,i){ return accessor_key(d,i); }
                tick.x = tick_time;
                hscale = d3.time.scale()
                    .domain(xdomain)
                    .range(xrange)
                    ;                    
                xaxis_label.text("session date");
            }
            var ydomain_before_extend;
            var yrange_before_extend;
            if(metric_button.state){
                // duration view
                if(logscale_button.state){
                    if(fit_button.state) ydomain = get_durationdomain_excluding_zero();
                    else{
                        ydomain = get_durationdomain_excluding_zero();
                        ydomain[0] = replace_zero_val;
                    }
                    ydomain[0] = Math.max(ydomain[0], replace_zero_val);
                }
                else{
                    if(fit_button.state) ydomain = get_durationdomain();
                    else ydomain = get_durationdomain_fullsize();
                    ydomain[0] = Math.max(ydomain[0], replace_zero_val);
                }


                /*
                if(ydomain[1] < 0){
                    ydomain[1] = get_durationdomain_fullsize()[1];
                }
                */
                var temprange = d3.extent(gdata_keyDateCreated_filterStatus_base, accessor_RunningDuration);
                if(temprange[1] < 0){
                    ydomain[1] = 587798000;
                }



                ydomain_before_extend = ydomain.slice();
                yrange_before_extend = yrange.slice();
                ydomain_extended = ydomain.slice();
                ydomain_extended[1] = ydomain_extended[0] + (size(ydomain) * ratio);
                accessor_ydomainmetric = function(d,i){ return accessor_RunningDuration(d,i); }
                tick.y = tick_duration;
            }
            else{
                // data view
                if(logscale_button.state){
                    if(fit_button.state){
                        ydomain = get_datadomain_excluding_zero();
                        if(ydomain[0] <= 0){
                            ydomain[0] = replace_zero_val;
                        }
                        tick.y = tick_data;
                    }
                    else{
                        ydomain = get_datadomain_excluding_zero();
                        ydomain[0] = replace_zero_val;
                        tick.y = tick_data_scientific;
                    }
                }
                else{
                    if(fit_button.state) ydomain = get_datadomain();
                    else ydomain = get_datadomain_fullsize();
                    if(ydomain[0] <= 0){
                        ydomain[0] = replace_zero_val;
                    }
                    tick.y = tick_data;
                }
                limit_ydomain();
                ydomain_before_extend = ydomain.slice();
                yrange_before_extend = yrange.slice();
                ydomain_extended = ydomain.slice();
                ydomain_extended[1] = ydomain_extended[0] + (size(ydomain) * ratio);
                accessor_ydomainmetric = function(d,i){ return accessor_TotalSize(d,i); }
            }
            that.ydomain = ydomain;
            xaxis = d3.svg.axis()
                .scale(hscale)
                .orient("bottom")
                .tickFormat(tick.x)
                ;
            if(logscale_button.state){
                vscale = 
                    d3.scale.log()
                    .base(logscale_base)                    
                    .domain(ydomain_before_extend)
                    .range(yrange_before_extend)
                    ;
            }
            else{
                vscale = 
                    d3.scale.linear()
                    .domain(ydomain_before_extend)
                    .range(yrange_before_extend)
                    ;
            }
            var vscale_extended = vscale.copy().domain(ydomain_extended).range(yrange_extended);
            yaxis = d3.svg.axis()
                .scale(vscale_extended)
                .orient("left")
                .tickFormat(tick.y)
                ;
            if(logscale_button.state){
                yaxis
                    .tickFormat(function(d){ return log_format(d, tick.y); })
                    .tickSubdivide(9)
                    ;
            }
            // stop errors with axis and gridlines transitions
            // by stop using transition if logscale button was changed
            if(logscale_button.changed){

                // don't turn off the changed flag here, 
                // let gridlines do it below
                //logscale_button.changed = false;

                // logscale was changed, so no transitions                
                xaxis_g.call(xaxis);
                yaxis_g.call(yaxis);
            }
            else{
                if(transition_flag  ||  expand_button.state){
                    xaxis_g
                        .transition()
                        .delay(delay)
                        .duration(duration)
                        .ease(ease)
                        .call(xaxis)
                        ;
                    yaxis_g
                        .transition()
                        .delay(delay)
                        .duration(duration)
                        .ease(ease)
                        .call(yaxis)
                        ;
                }
                else{
                    xaxis_g.call(xaxis);
                    yaxis_g.call(yaxis);
                }
            }
        }//end: update_metrics_view()
        //--------------------------------------------------
        function update_gridlines(){
            var vscale_extended = vscale.copy().domain(ydomain_extended).range(yrange_extended);
            hgridlines.axis = d3.svg.axis()
                .scale(vscale_extended)
                .orient("left")
                .tickSize(-drawrect.w, 0, 0)
                .tickFormat("")
                ;
            hgridlines.g = 
                base_g
                .select("#id_hgridlines_g")
                .transition()
                .delay(delay)
                .duration(duration)
                .ease(ease)                
                .call(hgridlines.axis)                
                ;
            if(logscale_button.state){
                apply_style(hgridlines.g.selectAll("line"), style_line_dashed);
                // darken the lines to make them more visible when in logscale
                //hgridlines.g.selectAll("line").style("stroke", fc(0,0,0, .14));
            }
            else{
                apply_style(hgridlines.g.selectAll("line"), style_line_dashed);
            }
            hgridlines.g.selectAll("path")
                .attr("visibility","hidden")
                ;
            vgridlines.axis = d3.svg.axis()
                .scale(hscale)
                .orient("bottom")
                .tickSize(drawrect.h, 0, 0)
                .tickFormat("")
                ;

            // stop using transitions when logscale changed
            /*
            vgridlines.g = base_g.selectAll("#id_vgridlines_g")
                .transition()
                .delay(delay)
                .duration(duration)
                .ease(ease)
                .call(vgridlines.axis)
                ;
            */

            if(logscale_button.changed){
                logscale_button.changed = false;
                vgridlines.g = base_g.selectAll("#id_vgridlines_g").call(vgridlines.axis);
            }
            else{
                vgridlines.g = base_g.selectAll("#id_vgridlines_g")
                    .transition()
                    .delay(delay)
                    .duration(duration)
                    .ease(ease)
                    .call(vgridlines.axis)
                    ;
            }
            apply_style(vgridlines.g.selectAll("line"), style_line_dashed);
            vgridlines.g.selectAll("path")
                .attr("visibility","hidden")
                ;
        }//end: update_gridlines()
        //--------------------------------------------------
        function update_pointlist(){
            pointlist = [];
            dataset.forEach(function(d,i){
                var val = accessor_ydomainmetric(d,i);
                if(logscale_button.state  &&  val<=0) val = replace_zero_val;
                pointlist.push(
                    {
                        absolute_index: d.absolute_index,
                        p: point(
                            hscale(accessor_xdomainmetric(d,i)),
                            vscale(val)
                        ),
                        p_old: point(                            
                            hscale_old(accessor_xdomainmetric(d,i)),                            
                            vscale_old(val)
                        )
                    }
                );
            });
            hscale_old = hscale.copy();
            vscale_old = vscale.copy();
        }
        //--------------------------------------------------
        function update_plot(){
            var d3line = d3.svg.line()
                .x(function(p){ return p.x; })
                .y(function(p){ return p.y; })
                ;
            var circles_sel = circles_g
                .selectAll("#id_circle_g")
                .data(pointlist, function(d,i){ return d.absolute_index; })
                ;
            var g = circles_sel
                .enter()
                .append("g")
                .id("id_circle_g")
                ;
            lines = 
                lines_g.selectAll("path")
                .data(pointlist, function(d,i){ return d.absolute_index; })
                ;
            lines
                .enter()
                .insert("path")
                .fill("none")
                .stroke(fc(0,0,0, .3))
                .attr("d", function(d,i){                    
                    var p1 = d.p_old;
                    var p2 = (i>0) ? d3.select(circles_sel[0][i-1]).datum().p_old : p1;
                    return d3line([p1,p2]);
                })
                ;
            lines
                .transition()
                .delay(delay)
                .duration(duration)
                .ease(ease)
                .attr("d", function(d,i){
                    var p1 = d.p;
                    var p2 = (i>0) ? d3.select(circles_sel[0][i-1]).datum().p : p1;
                    return d3line([p1,p2]);
                })
                ;
            var crushed = gdata_keyDateCreated_filterStatus_base.map(function(d){return d.absolute_index;});
            var c2 = gdata_keyDateCreated_sorted_base.map(function(d){return d.absolute_index;});
            lines
                .exit()
                .transition()
                .delay(delay)
                .duration(duration)
                .ease(ease)                
                .attr("d", function(d,i){ 
                    // get coords of the point that used to be here in the data
                    // so the lines can transition off screen in sync 
                    // with the rest of the plot before removal
                    var filterStatus_base_index = crushed.indexOf(d.absolute_index);
                    if(filterStatus_base_index < 0){
                        // the index is gone from filterStatus_base,
                        // - simple fix for now
                        var p = point(replace_zero_val,replace_zero_val);
                        return d3line([p,p]);
                    }
                    else{
                        var d1 = gdata_keyDateCreated_filterStatus_base[filterStatus_base_index];
                        var d2 = filterStatus_base_index > 0 ? 
                            gdata_keyDateCreated_filterStatus_base[filterStatus_base_index-1] : d1;
                        var y1 = accessor_ydomainmetric(d1);
                        if(logscale_button.state  &&  y1<=0) y1 = replace_zero_val;                  
                        var y2 = accessor_ydomainmetric(d2);
                        if(logscale_button.state  &&  y2<=0) y2 = replace_zero_val;
                        var p1 = point(
                            hscale(accessor_xdomainmetric(d1)),
                            vscale(y1)
                        );
                        var p2 = point(
                            hscale(accessor_xdomainmetric(d2)),
                            vscale(y2)
                        );
                        return d3line([p1,p2]);
                    }                    
                })
                .remove()
                ;
            //--------------------------------------------------
            g.append("circle")
                .attr("id", "id_visible_circle")
                .attr("r", datapoint_circle_radius)
                .attr("class", "class_graph_endpointcircle")
                .attr("fill", circlecolor)
                ;
            g.append("circle")
                .attr("id", "id_tooltip_circle")
                .attr("r", 6)
                .style("opacity", .06)
                ;
            g.attr("transform", function(d){ return "translate("+d.p_old.x+","+d.p_old.y+")"; });            
            circles_sel
                .transition()
                .delay(delay)
                .duration(duration)
                .ease(ease)
                .attr("transform", function(d){ return "translate("+d.p.x+","+d.p.y+")"; })
                ;
            circles_sel
                .exit()
                .transition()
                .delay(delay)
                .duration(duration)
                .ease(ease)
                .attr("transform", function(d){
                    var d2 = gdata_keyDateCreated_sorted_base[d.absolute_index];
                    var val = accessor_ydomainmetric(d2);
                    if(val <= 0){
                        val = replace_zero_val;
                    }
                    var p = point(
                        hscale(accessor_xdomainmetric(d2)),
                        vscale(val)
                    );
                    return "translate("+p.x+","+p.y+")";
                })
                .remove()
                ;
            circles = circles_sel;
            //testing 
            that.circles_sel = circles_sel;
        }//end: update_plot()
    }//end: update()
    //--------------------------------------------------
    function fit_button_clickhandler(arg){
        fit_button.flip();
        update(true);
    }
    function logscale_button_clickhandler(arg){
        logscale_button.flip();
        logscale_button.changed = true;
        if(logscale_button.state) fit_button.on();        
        var transitions = true;
        update(transitions);
    }
    function metric_button_clickhandler(arg){
        metric_button.flip();
        var transitions = true;
        update(transitions);
    }
    function expand_button_clickhandler(arg){
        expand_button.flip();
        var transitions = true;
        update(transitions);
    }    
    function get_timedomain(){ 
        return [moment(gmindomain), moment(gmaxdomain)]; 
    }
    function get_appsessiondomain(){
        return d3.extent(dataset, function(d){ return d.absolute_index; });
    }
    function get_durationdomain_excluding_zero(){
        var filtered = dataset.filter(function(d){ return accessor_RunningDuration(d) > 0; });
        if(filtered.length > 0){
            return d3.extent(filtered, accessor_RunningDuration);
        }
        else{
            // quick fix: return an arbitrary scale that looks good
            return [331000, 587798000];
        }
    }
    function get_datadomain_excluding_zero(){
        var filtered = dataset.filter(function(d){ return accessor_TotalSize(d) > 0; });
        if(filtered.length > 0){
            return d3.extent(filtered, accessor_TotalSize);
        }
        else{
            return [331000, 587798000];
        }
    }
    function get_durationdomain_fullsize(){
        return d3.extent(gdata_keyDateCreated_sorted_base, accessor_RunningDuration);
    }
    function get_datadomain_fullsize(){
        return d3.extent(gdata_keyDateCreated_sorted_base, accessor_TotalSize); 
    }
    function get_durationdomain(){ 
        return d3.extent(dataset, accessor_RunningDuration);
    }
    function get_datadomain(){ 
        return d3.extent(dataset, accessor_TotalSize); 
    };
    function limit_ydomain(){
        var domain_size_minimum = 1;
        ydomain[0] = Math.max(ydomain[0], ydomain_min_minimum);
        ydomain[1] = Math.max(ydomain[1], ydomain[0] + domain_size_minimum);
    }
    function limit_xdomain(){
        var domain_size_minimum = 1;
        xdomain[0] = Math.max(xdomain[0], xdomain_min_minimum);
        xdomain[1] = Math.max(xdomain[1], xdomain[0] + domain_size_minimum);
    }
    function add_gradient(){
        drawrect.grad = base_g.append("radialGradient")
            .attr("r","70%")
            .attr("cx","40%")
            .attr("cy","40%")
            .attr("spreadMethod","pad")
            .attr("id", "drawrect_grad")
            .attr('gradientUnits', 'userSpaceOnUse')
            ;
        drawrect.grad
            .append("stop")
            .attr("offset","0%")
            .attr("stop-color","rgba(255,255,255, 0)")
            ;
        drawrect.grad
            .append("stop")
            .attr("offset","100%")
            .attr("stop-color","rgba(255,255,255, 1)")
            ;
        base_g.append("rect")
            .attr("x", drawrect.x)
            .attr("y", drawrect.y)
            .attr("width", drawrect.w)
            .attr("height", drawrect.h)
            .attr("fill", "url(#drawrect_grad)")
            .attr("opacity",1)
            ;
    }
    function update_tooltips(){
        circles
            .on("mouseover", function(d,i){
                d = dataset[i];
                valueset = d.values[0];
                var textlines = [];
                var divopen = "<div>";
                var divclose = "</div>";
                var spanoopen = "<span>";
                var spanclose = "</span>";
                var sep = 0;
                function spanright(margin_right){ 
                    return "<span style=\"margin-right:"+margin_right+"px; width:120px; display:inline-block; \">"; 
                }
                var value;
                var notfound = "NOT FOUND";
                //--------------------------------------------------
                textlines.push(divopen+spanright(sep)+"Session Number:"+spanclose+d.absolute_index+divclose);
                //--------------------------------------------------
                if(valueset.hasOwnProperty("Status")){
                    textlines.push(divopen+spanright(sep)+"Status:"+spanclose+valueset.Status+divclose);
                }
                else textlines.push(divopen+spanright(sep)+"Status:"+spanclose+notfound+divclose);
                //--------------------------------------------------
                if(valueset.hasOwnProperty("DateCreated")){
                    textlines.push(divopen+spanright(sep)+"Created:"+spanclose+moment(valueset.DateCreated).format("MMM D, h:mm:ss a")+divclose);
                }
                else textlines.push(divopen+spanright(sep)+"Created:"+spanclose+notfound+divclose);
                //--------------------------------------------------
                if(valueset.hasOwnProperty("TotalSize")){
                    textlines.push(divopen+spanright(sep)+"Data:"+spanclose+d3.format(",.1f")(valueset.TotalSize/onebillion)+" Gb"+divclose);
                }
                else textlines.push(divopen+spanright(sep)+"Data:"+spanclose+notfound+divclose);
                //--------------------------------------------------
                if(valueset.hasOwnProperty("RunningDuration")){
                    value = valueset.RunningDuration;
                }
                else if(valueset.hasOwnProperty("DateCompleted")  &&  valueset.hasOwnProperty("DateCreated")){
                    value = moment(valueset.DateCompleted).diff(valueset.DateCreated);// diff() returns milliseconds
                }
                if(value != undefined || !isNaN(value)){
                    value = Math.floor(moment.duration(value).asHours()) + moment.utc(value).format(":mm:ss");
                    textlines.push(divopen+spanright(sep)+"Duration:"+spanclose+value+divclose);
                }
                else textlines.push(divopen+spanright(sep)+"Duration:"+spanclose+notfound+divclose);
                //--------------------------------------------------
                if(valueset.hasOwnProperty("LaunchSource")){
                    textlines.push(divopen+spanright(sep)+"Launch Source:"+spanclose+valueset.LaunchSource+divclose);
                }
                else textlines.push(divopen+spanright(sep)+"Launch Source:"+spanclose+notfound+divclose);
                //--------------------------------------------------
                d3.select("#tooltip1").html(textlines.join("")).style("class","style_tooltip");
                return tooltip.style("visibility", "visible");
            })
            .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
            .on("mouseout", function(){return tooltip.style("visibility", "hidden");})
            ;
    }//end: update_tooltips()
    //--------------------------------------------------
    this.hide = function(){ base_g.hide(); }
    this.show = function(){ base_g.show(); }
    //--------------------------------------------------
    function size(extent){ return Math.abs(extent[1] - extent[0]); }
}//end:graphclass1_b()







