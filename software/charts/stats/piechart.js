//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
function donutclass(parent_sel, pos, dataset){
    this.hide = function(){
        this.donut_g.hide();
        this.svg_g.hide();
    }
    this.show = function(){
        this.donut_g.show();
        this.svg_g.show();
    }
    var force_parameters = force_parameters_set2;
    this.force_parameters = force_parameters;
    var radius = 130;
    this.radius = radius;
    donutpos = pos;
    donutscale = 1;
    var rexpand = 0;
    var largest = d3.max(gdata_keyStatus_sorted_base, function(d){ return d.values.length; });
    var total = d3.sum(gdata_keyStatus_sorted_base, function(d){ return d.values.length; });
    var c = 2 * Math.PI;
    this.angle = force_parameters.start_angle;
    var angle = this.angle;
    pie = d3.layout.pie()
        .value(function(d){ return d.values.length; })
        .sort(null)
        .startAngle(this.angle)
        .endAngle(this.angle + 2 * Math.PI)
    	;
    this.pie = pie;
    arc = d3.svg.arc()
        .innerRadius(radius - 100)
        .outerRadius(radius - 20)
    	;
    //--------------------------------------------------
    // donut_g contains groups svg_g and empty.g
    // analytics.js updates donut based on donut_g's visibility attribute
    var donut_g = parent_sel.append("g");
    this.donut_g = donut_g;
    svg_g = donut_g.append("g");
    this.svg_g = svg_g;
    svg_g.attr("transform", function(d){
            var s = "";
            s += "translate(" + donutpos.x + "," + donutpos.y + ")";
            s += " scale(" + donutscale + ")";
            return s;
        })
        .datum(gdata_keyStatus_sorted_filtered)
        ;
    arccolors = [
        { key: "Complete", color: color_complete },
        { key: "Running", color: color_running },
        { key: "Initializing", color: color_initializing },
        { key: "TimedOut", color: color_timedout },
        { key: "Aborted", color: color_aborted },
        { key: "Aborting", color: color_aborting },
        { key: "AwaitingAuthorization", color: color_awaitingauthorization },
        { key: "PendingExecution", color: color_pendingexecution }
    ];
    arccolors.push({ key: "NeedsAttention", color: color_NeedsAttention });
    arccolors.push({ key: "PaymentAborted", color: color_PaymentAborted });
    arccolors.push({ key: "PaymentComplete", color: color_PaymentComplete });
    arccolors.push({ key: "PendingPayment", color: color_PendingPayment });
    arccolors.push({ key: "Undefined", color: color_Undefined });

	arcpaths = svg_g.selectAll("path")
		.data(pie)
		.enter()
		.append("path")
		.attr("d",arc)
		.attr("fill",function(d){
            var key = d.data.key;
            return arccolors.filter(function(d){ return d.key == key; })[0].color;
        })
        .each(function(d){ this._current = d; })// store the initial angles
    	;
        
    //--------------------------------------------------
    // force graph data
    aborting_anchor = { "id": "id_anchor_aborting", "key": "Aborting", "type": "anchor" };
    aborting_terminal = { "id": "id_terminal_aborting", "key": "Aborting", "type": "terminal" };
    aborted_anchor = { "id": "id_anchor_aborted", "key": "Aborted", "type": "anchor" };
    aborted_terminal = { "id": "id_terminal_aborted", "key": "Aborted", "type": "terminal" };
    timedout_anchor = { "id": "id_anchor_timedout", "key": "TimedOut", "type": "anchor" };
    timedout_terminal = { "id": "id_terminal_timedout", "key": "TimedOut", "type": "terminal" };
    initializing_anchor = { "id": "id_anchor_initializing", "key": "Initializing", "type": "anchor" };
    initializing_terminal = { "id": "id_terminal_initializing", "key": "Initializing", "type": "terminal" };
    running_anchor = { "id": "id_anchor_running", "key": "Running", "type": "anchor" };
    running_terminal = { "id": "id_terminal_running", "key": "Running", "type": "terminal" };
    complete_anchor = { "id": "id_anchor_complete", "key": "Complete", "type": "anchor" };
    complete_terminal = { "id": "id_terminal_complete", "key": "Complete", "type": "terminal" };
    awaitingauthorization_anchor = { 
        "id": "id_anchor_awaitingauthorization", 
        "key": "AwaitingAuthorization", 
        "type": "anchor" 
    };
    awaitingauthorization_terminal = { 
        "id": "id_terminal_awaitingauthorization", 
        "key": "AwaitingAuthorization", 
        "type": "terminal" 
    };
    pendingexecution_anchor = { 
        "id": "id_anchor_pendingexecution", 
        "key": "PendingExecution",
        "type": "anchor" 
    };
    pendingexecution_terminal = { 
        "id": "id_terminal_pendingexecution", 
        "key": "PendingExecution", 
        "type": "terminal" 
    };
    // late additions
    needsattention_anchor = get_node("NeedsAttention", "anchor");
    needsattention_terminal = get_node("NeedsAttention", "terminal");    
    paymentaborted_anchor = get_node("PaymentAborted", "anchor");
    paymentaborted_terminal = get_node("PaymentAborted", "terminal");    
    paymentcomplete_anchor = get_node("PaymentComplete", "anchor");
    paymentcomplete_terminal = get_node("PaymentComplete", "terminal");    
    pendingpayment_anchor = get_node("PendingPayment", "anchor");
    pendingpayment_terminal = get_node("PendingPayment", "terminal");    
    undefined_anchor = get_node("Undefined", "anchor");
    undefined_terminal = get_node("Undefined", "terminal");
    function get_node(statusval, type){
    	return {
    		"id": "id_"+type+"_"+statusval, 
    		"key": statusval,
    		"type": type 
    	};
    }

    data_labelforcegraph = {
        "nodes": [
            aborting_anchor, aborting_terminal,
            aborted_anchor, aborted_terminal,
            timedout_anchor, timedout_terminal,
            initializing_anchor, initializing_terminal,
            running_anchor, running_terminal,
            pendingexecution_anchor, pendingexecution_terminal,
            complete_anchor, complete_terminal,
            awaitingauthorization_anchor, awaitingauthorization_terminal
        ],
        "edges": [
            { source: aborting_anchor, target: aborting_terminal },
            { source: aborted_anchor, target: aborted_terminal },
            { source: timedout_anchor, target: timedout_terminal },
            { source: initializing_anchor, target: initializing_terminal },
            { source: running_anchor, target: running_terminal },
            { source: pendingexecution_anchor, target: pendingexecution_terminal },
            { source: complete_anchor, target: complete_terminal },
            { source: awaitingauthorization_anchor, target: awaitingauthorization_terminal }
        ]
    };
    // late additions
    data_labelforcegraph.nodes.push(needsattention_anchor, needsattention_terminal);
    data_labelforcegraph.nodes.push(paymentaborted_anchor, paymentaborted_terminal);
    data_labelforcegraph.nodes.push(paymentcomplete_anchor, paymentcomplete_terminal);
    data_labelforcegraph.nodes.push(pendingpayment_anchor, pendingpayment_terminal);
    data_labelforcegraph.nodes.push(undefined_anchor, undefined_terminal);    
    data_labelforcegraph.edges.push({ source: needsattention_anchor, target: needsattention_terminal });
    data_labelforcegraph.edges.push({ source: paymentaborted_anchor, target: paymentaborted_terminal });
    data_labelforcegraph.edges.push({ source: paymentcomplete_anchor, target: paymentcomplete_terminal });
    data_labelforcegraph.edges.push({ source: pendingpayment_anchor, target: pendingpayment_terminal });
    data_labelforcegraph.edges.push({ source: undefined_anchor, target: undefined_terminal });


    //--------------------------------------------------
    function forcegraphclass(dataset){
        var force = d3.layout.force();
        this.force = force;
		force = force.alpha(force_parameters.alpha)
            .charge(force_parameters.charge)
            .linkDistance(force_parameters.linkdistance)
            .gravity(force_parameters.gravity)
            .chargeDistance(force_parameters.chargedistance)
            .linkStrength(force_parameters.linkstrength)
            .friction(force_parameters.friction)
            .theta(force_parameters.theta)
            ;
		force = force.nodes(dataset.nodes);
		force = force.links(dataset.edges);
	    //--------------------------------------------------
        var edges_sel = svg_g.selectAll(".edge_labelforcegraph")
            .data(force.links(), function(d){ return d.source.key; })
            .enter()
            .append("line")
            .attr("class", "edge_labelforcegraph")
            ;
        nodes_sel = svg_g.selectAll(".node_labelforcegraph")
            .data(force.nodes(), function(d){ return d.key + "_" + d.type; })
            .enter()
            .append("g")
            .attr("id", function(d){ return "id_group_" + d.id; })
            ;
        nodes_sel.append("circle")
            .attr("id", function(d){ return d.id; })
            .attr("class", "node_labelforcegraph")
            .attr("r", 2)
            .call(force.drag)
            ;
        anchors_sel = nodes_sel.filter(function(d, i) { return d.type == "anchor"; });
        terminals_sel = nodes_sel.filter(function(d, i) { return d.type == "terminal"; });
        titlegrouplist_nodes = terminals_sel.append("g")
            .attr("id", "id_titlegroup")
            .each(function (d, i) {
                d.key = gdata_keyStatus_sorted_filtered[i].key;
            })
            ;
        // label large text
        labels3 = titlegrouplist_nodes.append("text")
            .attr("id", "id_label3")
            .text(function (d, i) {
                if (d.value == 0) return "";
                else return gdata_keyStatus_sorted_filtered[i].key;
            })
            .attr("class", "pie_label_status")
            .each(function(d){ this._previous = d; })
        	;
        // label small text
        labels4 = titlegrouplist_nodes.append("text")
            .attr("id", "id_label4")
            .text(function (d, i) {
                val = gdata_keyStatus_sorted_filtered[i].values.length;
                if (val == 0) return "";
                if (val == 1) return val + " session";
                else return val + " sessions";
            })
            .attr("dy", 16)
            .attr("class", "pie_label_sessions")
            .each(function(d){ this._previous = d; })
        	;
        //--------------------------------------------------
        // this is my start() function, 
        // it calls force.start() at the end
        this.start = function(){
            edges_sel = edges_sel.data(force.links(), function(d){ return d.source.key; });
            edges_sel
                .enter()
                .append("line")
                .attr("class", "edge_labelforcegraph")
                ;
            edges_sel
                .exit()
                .remove()
                ;
            nodes_sel = nodes_sel.data(force.nodes(), function(d){ return d.key + "_" + d.type; });
            // save the entering nodes in a selection
            // to position them in tick
            g_enteringnodes_sel = nodes_sel.enter();
            g_enteringnodes_sel.append("g")
                .attr("id", function (d) { return "id_group_" + d.id; })
                .append("circle")
                .attr("id", function (d) { return d.id; })
                .attr("class", "node_labelforcegraph")
                .attr("r", 2)
                .call(force.drag)
                ;
            nodes_sel
                .exit()
                .remove()
                ;
            // update selections based on data_labelforcegraph
            anchors_sel =
                nodes_sel.filter(function (d, i) { return d.type == "anchor"; });
            terminals_sel =
                nodes_sel.filter(function (d, i) { return d.type == "terminal"; });
            titlegrouplist_nodes.remove();
            titlegrouplist_nodes = terminals_sel.append("g")
                .attr("id", "id_titlegroup")
                .each(function (d, i) {
                    d.key = terminals_sel[0][i].__data__.key;
                })
            ;
            labels3.remove();
            labels3 = titlegrouplist_nodes.append("text")
                .attr("id", "id_label3")
                .text(function (d, i) {
                    if (d.value == 0) return "";
                    else return d.key;
                })
                .attr("class", "pie_label_status")
                .each(function (d) { this._previous = d; })
            ;
            labels4.remove();
            labels4 = titlegrouplist_nodes.append("text")
                .attr("id", "id_label4")
                .text(function (d, i) {
                    var key = d.key;
                    a = gdata_keyStatus_sorted_filtered.filter(function (d) { return d.key == key; });
                    val = a[0].values.length;
                    if (val == 0) return "";
                    if (val == 1) return val + " session";
                    else return val + " sessions";
                })
                .attr("dy", 16)
                .attr("class", "pie_label_sessions")
                .each(function (d) { this._previous = d; })
            ;
            force.start();
        }//end: my start function
        //--------------------------------------------------
        force.on("tick", function(){
        	// this is for initial terminal positioning when the graph first starts
        	if(g_firsttime){
        		// to do: change to have initial loop adding nodes/terminals
        		// instead of starting with all of them assuming all statuses exist
        		g_enteringnodes_indices = [];
        		dataset.nodes.forEach(function(d,i){
        			if(d.type == "terminal"){
        				g_enteringnodes_indices.push(i);
        			}
        		});
        		g_firsttime = false;
        	}
            // stop the graph if alpha is under a certain threshold.
            // the algorithm actually continues running long after all
            // visually perceptible motion in the nodes has stopped
            // because alpha takes many ticks to decay all the way to zero
            if(force.alpha() < 0.08){
                force.stop();
                return;
            }
            //--------------------------------------------------
            // move anchor nodes to arc centers
            radius_expand = -20;
            for (var i=0;i<dataset.nodes.length;i+=2) {
                // get the right arc to center on
                var key = dataset.nodes[i].key;
                var a = arcpaths.filter(function(d){ return d.data.key == key; });
                var pathdata = a[0][0].__data__;
                var p = get_centerpoint_given_pathradius(pathdata, radius + radius_expand);
                dataset.nodes[i].x = p.x;
                dataset.nodes[i].y = p.y;
            }
            //--------------------------------------------------
            // position entering terminals
            var radius_expand_terminal = 40;
            g_enteringnodes_indices.forEach(function(d){
                // adding a check here because getting an error 
                // "can't read property key of undefined" on this line
                // - it happened again even with the if statments, nothing shows in console
                // - slider drag is maybe doing asynchronous change that messes up this loop
                if (dataset) {
                    if (dataset.nodes) {
                        // this if statment is the only one that's catching stuff
                        if (d < dataset.nodes.length) {                            
                            // get the right arc to center on
                            var key2 = dataset.nodes[d].key;
                            var a2 = arcpaths.filter(function (d) { return d.data.key == key2; });
                            var pathdata2 = a2[0][0].__data__;
                            var p2 = get_centerpoint_given_pathradius(pathdata2, radius + radius_expand_terminal);
                            dataset.nodes[d].x = p2.x;
                            dataset.nodes[d].y = p2.y;
                        }
                        //else cout("force->tick(): d was out of range in dataset.nodes[d]");
                    }
                    //else cout("force->tick(): dataset.nodes is undefined");
                }
                //else cout("force->tick(): dataset is undefined");
            });
            // after going through the array once to position any entering nodes,
            // clear the array and let the force graph control them from here on
            g_enteringnodes_indices = [];
            nodes_sel
                .attr("transform", function(d,i) {
                    var x = dataset.nodes[i].x;
                    var y = dataset.nodes[i].y;
                    return "translate(" + x + "," + y + ")";
                })
                ;
            edges_sel
                .attr("x1", function (d) { return d.source.x; })
                .attr("y1", function (d) { return d.source.y; })
                .attr("x2", function (d) { return d.target.x; })
                .attr("y2", function (d) { return d.target.y; })
                ;
            //--------------------------------------------------
            // move label text further away along stick angle
            titlegrouplist_nodes
                .each(function (d, i) {
                    var panchor = {
                        x: anchors_sel[0][i].__data__.x,
                        y: anchors_sel[0][i].__data__.y
                    };
                    var pterminal = {
                        x: terminals_sel[0][i].__data__.x,
                        y: terminals_sel[0][i].__data__.y
                    };
                    var d0 = {
                        x: pterminal.x - panchor.x,
                        y: pterminal.y - panchor.y
                    };
                    var angle = Math.atan(d0.y / d0.x);
                    var rextend = 16;
                    var translation = {
                        x: Math.cos(angle) * rextend,
                        y: Math.sin(angle) * rextend
                    };
                    if (d0.x < 0) {
                        translation.x *= -1;
                        translation.y *= -1;
                    }
                    d.trans = {};
                    d.trans.translation = translation;
                })
                .attr("transform", function (d, i) {
                    return "translate(" + d.trans.translation.x + "," + d.trans.translation.y + ")";
                })
            	;
            //--------------------------------------------------
            // flip text horizontally based on position relative to donut center
            labels3.attr("text-anchor", function (d, i) {
                if (titlegrouplist_nodes[0][i].__data__.trans.translation.x < 0) return "end";
                else return "start";
            });
            labels4.attr("text-anchor", function (d, i) {
                if (titlegrouplist_nodes[0][i].__data__.trans.translation.x < 0) return "end";
                else return "start";
            });
            //--------------------------------------------------
            // advance ticks manually
            if(!g_run_graph_flag){
            	g_hold_alpha = force.alpha();
            	force.stop();
            }
            //--------------------------------------------------
        });//end: force.on "tick"
	    //--------------------------------------------------
        force.on("end", function(){
	        // check for edges that should have been removed
        	// loop through force layout nodes, look at every other node
            for(var inode=0;inode<data_labelforcegraph.nodes.length; inode += 2){
            	var node = data_labelforcegraph.nodes[inode];
            	// loop through gdata, find element with matching key
				for(var i=0;i<gdata_keyStatus_sorted_filtered.length;i++){
					if(gdata_keyStatus_sorted_filtered[i].key == node.key){
						if(gdata_keyStatus_sorted_filtered[i].values.length < 1){
							// all sessions for this status are filtered out so this arc is invisible
							// but the corresponding nodes and edge were not removed
							update();
						}
						break;
					}
				}
            };
        });//end:force.on "end"
	    //--------------------------------------------------
    };//end:forcegraphclass()
    labelforcegraph = new forcegraphclass(data_labelforcegraph);
    this.labelforcegraph = labelforcegraph;
    //--------------------------------------------------
    function change(){
        var value = this.value;
        arcpaths = arcpaths.data(pie(gdata_keyStatus_sorted_filtered));
        arcpaths.transition()
            .delay(50)
            .duration(300)
            .ease(g_ease)
            .attrTween("d", arcTween)
            ;
        //--------------------------------------------------
        // large text / status
        labels3.transition()
            .text(function (d, i) {
                if (gdata_keyStatus_sorted_filtered[i].values.length == 0) return "";
                else return gdata_keyStatus_sorted_filtered[i].key;
            })
            .delay(50)
            .duration(300)
            //.ease(g_ease)
            ;
        //--------------------------------------------------
        // small text / # sessions
        labels4.transition()
            .text(function (d, i) {
                var val = gdata_keyStatus_sorted_filtered[i].values.length;
                if (val == 0) return "";
                if (val == 1) return val + " session";
                else return val + " sessions";
            })
            .delay(50)
            .duration(300)
            //.ease(g_ease)
            ;
        //--------------------------------------------------
        // add/remove nodes and edges from the force graph dataset        
        g_enteringnodes_indices = [];
        for (var i=0; i<gdata_keyStatus_sorted_filtered.length; i++){
            var key = gdata_keyStatus_sorted_filtered[i].key;
            if(gdata_keyStatus_sorted_filtered[i].values.length == 0){
                // this status is empty, check if nodes exist for it
                var a = titlegrouplist_nodes.filter(function(d){ return d.key == key; });
                if(a[0].length != 0){
                    // there are nodes for this status, remove them
                    var dataset = data_labelforcegraph;
                    for (var j=0;j<dataset.nodes.length;j++){
                        var d = dataset.nodes[j];
                        if (d.key == key){
                            // found the key, remove 2 nodes, 1 edge from force data
                            // start() will remove the corresponding elements from the selections
                            dataset.nodes.splice(j, 2);
                            dataset.edges.splice(j/2, 1);
                        }
                    }
                }
            }
            else{
                // else this status is not empty, 
                // check if need to add nodes back into force graph
                var a = titlegrouplist_nodes.filter(function (d) { return d.key == key; });
                if(a[0].length == 0) {
                    // there are no nodes for this status, add them
                    var dataset = data_labelforcegraph;
                    switch(key){
                        case "Aborting":
                            anchor = aborting_anchor;
                            terminal = aborting_terminal;
                            break;
                        case "Aborted":
                            anchor = aborted_anchor;
                            terminal = aborted_terminal;
                            break;
                        case "TimedOut":
                            anchor = timedout_anchor;
                            terminal = timedout_terminal;
                            break;
                        case "Initializing":
                            anchor = initializing_anchor;
                            terminal = initializing_terminal;
                            break;
                        case "Running":
                            anchor = running_anchor;
                            terminal = running_terminal;
                            break;
                        case "Complete":
                            anchor = complete_anchor;
                            terminal = complete_terminal;
                            break;
                        case "AwaitingAuthorization":
                            anchor = awaitingauthorization_anchor;
                            terminal = awaitingauthorization_terminal;
                            break;
                        case "PendingExecution":
                            anchor = pendingexecution_anchor;
                            terminal = pendingexecution_terminal;
                            break;
                        case "NeedsAttention":
                            anchor = needsattention_anchor;
                            terminal = needsattention_terminal;
                            break;
                        case "PaymentAborted":
                            anchor = paymentaborted_anchor;
                            terminal = paymentaborted_terminal;
                            break;
                        case "PaymentComplete":
                            anchor = paymentcomplete_anchor;
                            terminal = paymentcomplete_terminal;
                            break;
                        case "PendingPayment":
                            anchor = pendingpayment_anchor;
                            terminal = pendingpayment_terminal;
                            break;
                        case "Undefined":
                            anchor = undefined_anchor;
                            terminal = undefined_terminal;
                            break;
                        default:
                            cout("switch statement reached default");
                            break;
                    }
                    // push them into the end of the array, not checking order
                    dataset.nodes.push(anchor, terminal);
                    dataset.edges.push({ source: anchor, target: terminal });
                    // add these terminals into the entering indices array
                    g_enteringnodes_indices.push(dataset.nodes.length - 1);
                }
            }
        }
        //--------------------------------------------------
        // this is calling my start() function, 
        // which calls force.start() when it's done
        labelforcegraph.start();
    }//end:change()
    this.change = change;
    //--------------------------------------------------
    var empty = {};
    this.empty = empty;
    empty.r = 100;
    empty.g = parent_sel.append("g")
    	.attr("transform","translate("+donutpos.x+","+donutpos.y+") scale("+donutscale+")")
    	.attr("visibility", "hidden")
    	;
    empty.circle = empty.g.append("circle")
    	.attr("cx",0)
    	.attr("cy",0)
    	.attr("r",empty.r)
    	.attr("fill","rgba(0,0,0, .04)")
    	.attr("stroke", "rgba(0,0,0, .12)")
    	.attr("stroke-width","2px")
    	.attr("stroke-dasharray", "5,3")
    	;
    empty.text_g = empty.g.append("g")
    	.attr("class","class_titlebutton")
    	.style("fill","rgba(0,0,0, .35)")
    	.attr("text-anchor","middle")
    	;
    empty.text_g.append("text")
    	.attr("dy", 0)
    	.text("No Appsessions")
    	;
    empty.text_g.append("text")
    	.attr("dy", 26)
    	.text("in this range")
    	;
    //--------------------------------------------------
    function update(){
        
        var flag = false;

        gdata_keyStatus_sorted_filtered.forEach(function(status){            
            if(status.values.length > 0){ flag = true; }
        });

        if(flag){
            // not all appsessions have been filtered out
            // hide the "no data" sign, display and update the donut
            empty.g.hide();
            svg_g.show();
            change();
        }
        else{
            // all sessions have been filtered out
            // hide the donut and show the "no data" sign
            svg_g.hide();
            empty.g.show();
        }
    };
    this.update = update;
    // call this initially to remove nodes that shouldn't 
    // be there because their arcs are invisible
    update();
    //--------------------------------------------------
    function tween2(a){
        var i = d3.interpolate(this._previous, a);
        this._previous = i(0);
        return function (t) {
            return arc(i(t));
        };
    };
    function arcTween(a){
        var i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function (t) {
            return arc(i(t));
        };
    };
    //--------------------------------------------------
};//end:donutclass()











