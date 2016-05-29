//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
function render_layout_np(){

	/*
	g.creationdepth_max = 7;
	g.childbearing_creationdepth_min = 3;
	g.compdepth_max = 15;
	g.chooseexisting_depth_min = 2;
	g.gate_chooseexisting.threshold = .5;
	*/
	g.creationdepth_max = 12;
	g.childbearing_creationdepth_min = 5;
	g.compdepth_max = 17;
	g.chooseexisting_depth_min = 3;
	g.gate_chooseexisting.threshold = .5;

	//--------------------------------------------------
	g.prlist = create_prlist();
	g.prlist_2c = g.prlist.filter(function(d){return d.n == 2;});
	g.prlist_1c = g.prlist.filter(function(d){return d.n == 1;});
	g.prlist_terminals = g.prlist.filter(function(d){return d.n == 0;});
	np = new npclass(g.creationdepth_max, evaluate);
	layout = new visualization(np);
	graph = new graphclass(np);
	

	g.mutate_button = add_mutate_button();
	g.mutate_button.set_right(svgrect.get_inrect().right());
	g.mutate_button.set_top(svgrect.get_inrect().top());


	//--------------------------------------------------
	function evaluate( x0, y0 ){
		x = x0;
		y = y0;
		var comp_depth = 0;
		return np.root.evaluate(comp_depth);
	}
	//--------------------------------------------------
	function create_prlist(){
		var pr_x = Object.create(prstruct);
		pr_x.s = "x";
		pr_x.n = 0;
		pr_x.evaluate = function(){ return [x]; }
		var pr_y = Object.create(prstruct);
		pr_y.s = "y";
		pr_y.n = 0;
		pr_y.evaluate = function(){ return [y]; }
		var prlist = [];
		// - - - - - - - - - - 2c
		prlist.push(add);
		prlist.push(sub);
		prlist.push(div);
		prlist.push(mult);
		prlist.push(pow);
		// - - - - - - - - - - 1c
		prlist.push(sq);
		prlist.push(sqrt);
		prlist.push(sin);
		prlist.push(cos);
		prlist.push(tan);
		prlist.push(floor);
		prlist.push(abs);
		prlist.push(neg);
		// - - - - - - - - - - terminals
		prlist.push(num);
		prlist.push(pr_x);
		prlist.push(pr_y);
		//--------------------------------------------------
		return prlist;
	}//end: create_prlist()
	//--------------------------------------------------
}//end: render_layout_np()












