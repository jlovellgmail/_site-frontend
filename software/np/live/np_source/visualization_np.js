//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
function visualization(gp0){

	// jan16
	/*
	div = d3.select("#id_div1")
	*/
	html_div = d3.select("#id_div1")

		.append("div")
		.id("outer_container")
		.attr("align", "center")
		;
	svgrect = new rectclass();
	svgrect.set(0,0,900,1000);
	
	// jan16
	/*
	svg = div.append("svg")
	*/
	svg = html_div.append("svg")

		.width(svgrect.w)
		.height(svgrect.h)
		;
	svg.append("svg:defs")
		.append("marker")
	    .attr("id", "arrowhead")
	    .attr("refX", 22)
	    .attr("refY", 3)
	    .attr("markerWidth", 10)
	    .attr("markerHeight", 6)
	    .attr("orient", "auto")
	    .append("path")
		.attr("d", "M 10,3 L 0,6 L 0,0 Z")
		;
	svgrect.append_to(svg)

		// jan16
		/*
		.fill("rgba(0,0,0, .05)")
		*/
		.fill("white")

		;
	g_networkdata = gp0.get_networkdata();
	var linkstrength = 10;
	var linkdistance = 70;
	var charge = -800;
	var force = d3.layout.force()
		.charge(-800)	    
	    .linkDistance(70)
	    .linkStrength(10)
	    .size([0, 0])
	    ;
	this.force = force;
	//--------------------------------------------------
	var xpos = 20;
	var ypos = 20;
	var yseparation = 50;
	var slider_linkstrength = create_slider(
		linkstrength,
		"linkstrength",
		[1,20],
		point(xpos,ypos),
		function(val){
			linkstrength = val;
			force.linkStrength(val);
			force.start();
		}
	);
	ypos += yseparation;
	var slider_linkdistance = create_slider(
		linkdistance,
		"linkdistance",
		[1,100],
		point(xpos,ypos),
		function(val){
			linkdistance = val;
			force.linkDistance(val);
			force.start();
		}
	);
	ypos += yseparation;
	var slider_charge = create_slider(
		charge,
		"charge",
		[-2000,-100],
		point(xpos,ypos),
		function(val){
			charge = val;
			force.charge(val);
			force.start();
		}
	);
	function create_slider(linkvar, linktext, range, pos, handler){
		var slider;
        slider = new sliderclass(svg, pos, handler, linktext);
        slider.range = range;
        slider.scale.range(range);
        slider.update_axis();
        slider.setsliderfromval(linkvar);
	    return slider;
	}
	//--------------------------------------------------
    force
        .nodes(g_networkdata.nodes)
        .links(g_networkdata.links)
        .start()
        ;
    var force_g = svg.append("g").translate(svgrect.center().x, svgrect.center().y/1.5);
	var link = 
		force_g
		.selectAll(".link")
        .data(g_networkdata.links)
      	.enter()
      	.append("line")
        .attr("class", "link")
        .attr("marker-end", "url(#arrowhead)")
        ;
    var drag = 
    	force.drag()
    	.on('dragstart', function(){
    		d3.event.sourceEvent.stopPropagation();
    	})
    	;
	// node_g the css class has no properties, just using it as selector
    var node = force_g.selectAll(".node_g")
        .data(g_networkdata.nodes)
      	.enter().append("g").attr("class", "node_g")
      	.call(drag)
      	;
	node
      	.append("circle")
      	// remove this because it seems to override fill attribute set below
        //.attr("class", "node")
        .attr("r", 12)
        .fill(function(d){ 
        	if(d == root) return fc(0,.5,0, 1); 
        	else return fc(0,0,0, 1);
        })
        ;
    node
    	.append("text")
        .text(function(d){ 
        	if(d.s=="num") return d3.format(".2f")(d.val);
        	else return d.s; 
        })
        .class(function(d){
        	if(d.s=="+") return "node_text_plus";
        	else if(d.s=="*" || d.s=="-" || d.s=="/") return "node_text_larger";        
        	else return "node_text";
        })
        .attr("text-anchor", "middle")
        .attr("dy", function(d){return d3.select(this).node().getBBox().height/4})
        ;
    var compleaf = 
    	node
    	.append("g")
    	.translate(12+8,0)
    	;
    compleaf
    	.append("circle")
    	.r(8)
    	.fill(fc(.5,0,0,.3))
    	;
    compleaf
    	.append("text")
    	.text(function(d){
    		d = d.compleaf;
    		if(d.s=="num") return d3.format(".2f")(d.val);
    		else return d.s; 
    	})
    	.class(function(d){
    		d = d.compleaf;
    		if(d.s=="+") return "node_text_plus";
    		else if(d.s=="*" || d.s=="-" || d.s=="/") return "node_text_larger";        
    		else return "node_text";
    	})
    	.attr("text-anchor", "middle")
    	.attr("dy", function(d){return d3.select(this).node().getBBox().height/4})
    	;
    force.on("tick", function() {
      link.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });
      node.attr("transform", function(d){return "translate("+d.x+","+d.y+")";});
    });


    // for quick test during initial setup of mutate
    g.node = node;



}//end: visualization()
//--------------------------------------------------
function graphclass(gp0){
	var that = this;
	var g;
	var graphrect;
	var drawrect;
	var xdomain;
	var xrange;
	var hscale;
	var xaxis;
	var xaxis_g;
	var xvals;
	var slider;
	var ydomain;
	var yrange;
	var vscale;
	var yaxis;
	var yaxis_g;
	var plot_g;
	var plot;


	var dx_graph;
	var dy_graph;


	//--------------------------------------------------
	setup();
	update();
	//--------------------------------------------------

	
	// for positioning button relative to graph
	//this.graphrect = graphrect;
	// not necessary, graphrect is at zero
	/*
	this.dx_graph = dx_graph;
	this.dy_graph = dy_graph;
	*/
	// - not using graph for button position any more

	//--------------------------------------------------
	function setup(){
		dx = .01;
		g = svg.append("g");
		graphrect = new rectclass();
		graphrect.set(0,0,svgrect.get_inrect().w,300);
		graphrect.sel =
			 graphrect.append_to(g)
			 .fill("rgba(0,0,0, .05)")
			 ;


		// these should be moved out of graphclass
		// into render_layout_np
		/*
		var dx_graph = svgrect.get_inrect().center().x - graphrect.w/2;
		var dy_graph = svgrect.get_inrect().bottom() - graphrect.bottom();
		*/
		dx_graph = svgrect.get_inrect().center().x - graphrect.w/2;
		dy_graph = svgrect.get_inrect().bottom() - graphrect.bottom();



		g.translate(dx_graph,dy_graph);
		graphrect.m.set(50,4,4,30);
		drawrect = graphrect.get_inrect();
		drawrect.sel =
			 drawrect.append_to(g)
			 .fill("rgba(255,255,255, .95)")
			 ;
		xdomain = [-10,10];
		xrange = [drawrect.left(), drawrect.right()];
		hscale = d3.scale.linear().domain(xdomain).range(xrange);
		xaxis = d3.svg.axis().scale(hscale).orient("bottom");
		xaxis_g = g.append("g").class("axis").translate(0,drawrect.bottom()).call(xaxis);
		xvals = d3.range(xdomain[0], xdomain[1], dx);
		data = xvals.map(function(d){
			return point(d, gp0.evaluate(d,1));
		});
		ydomain = d3.extent(data, function(d){return d.y;});
		yrange = [drawrect.bottom(), drawrect.top()];
		vscale = d3.scale.linear().domain(ydomain).range(yrange);
		yaxis = d3.svg.axis().scale(vscale).orient("left");
		yaxis_g = g.append("g").class("axis").translate(drawrect.left(),0).call(yaxis);
		plot_g = g.append("g");
		plot = plot_g.selectAll("#id_datapoint_circle")		
			g.data(data)
			.enter()
			.append("circle")
			.id("id_datapoint_circle")
			.r(1)
			.cx(function(d){return hscale(d.x)})
			.cy(function(d){return vscale(d.y)})
			;
		create_slider();
		function create_slider(){
		    var linktext = "dx";
		    var pos = point(20,20);
		    var handler = function(val){
		        dx = val;
		        update();
		    }
		    slider = new sliderclass(g, pos, handler, linktext);
		    slider.g.translate(0,-40);
		    slider.range = [.01, .5];
		    slider.scale.range(slider.range);
		    slider.update_axis();
		    slider.setsliderfromval(dx);
		}
	}//end: setup()
	//--------------------------------------------------
	function update(){
		xvals = d3.range(xdomain[0], xdomain[1], dx);
		yval_lists = xvals.map(function(d){
			return gp0.evaluate(d,1);
		});
		// now yval_lists is an array where each element 
		// is an array of y values corresponding to one x value
		var data = [];
		yval_lists.forEach(function(valuelist, i){
			var xval = xvals[i];
			valuelist.forEach(function(yval){
				data.push(point( check(xval), check(yval) ));

			});
		});
		that.data = data;
		ydomain = d3.extent(data, function(d){return d.y;});
		vscale = d3.scale.linear().domain(ydomain).range(yrange);
		yaxis = d3.svg.axis().scale(vscale).orient("left");



			/*
		yaxis_g
			.transition()
			.delay(0)
			.duration(300)
			.ease("cubic-out")

			//.call(yaxis)
			// the above line is giving errors			

			;
			*/



			// testing
			that.ydomain = ydomain;
			that.yrange = yrange;
			that.vscale = vscale;
			that.yaxis = yaxis;
			that.yaxis_g = yaxis_g;





		plot = plot_g.selectAll("#id_datapoint_circle")		
			.data(data)
			;
		plot.enter()
			.insert("circle")
			.id("id_datapoint_circle")
			.r(1)
			;
		plot.transition()
			.delay(0)
			.duration(300)
			.ease("cubic-out")
			.cx(function(d){return hscale(d.x)})
			.cy(function(d){return vscale(d.y)})
			;
		plot.exit()
			.remove()
			;
	}//end: update()
}//end: graphclass()
//--------------------------------------------------
function add_mutate_button(){
	var text = "regenerate";
	var id = "mutate_button";
	var handler = g.mutate;
	var handler_val = 0;
	var parent_sel = svg;
	var margin_point = point(6,3);
	var cssclass = "class_titlebutton";
	var button = new buttonclass( text, id, handler, handler_val, parent_sel, margin_point, cssclass );
	return button;
}






