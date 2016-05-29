//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
function npclass(depth_max0, evaluate_function0, recursion_flag0){
	var that = this;
	var creationdepth_max;
	var computation_depth_max;
	var network;
	var evaluate;
	var prlist;
	var prlist_2c;
	var prlist_1c;
	var prlist_terminals;
	var prlist_nonterminals;
	var gate_chooseexisting;
	//--------------------------------------------------
	this.get_networkdata = get_networkdata;
	//--------------------------------------------------
	setup();
	//--------------------------------------------------
	function setup(){
		creationdepth_max = depth_max0 ? depth_max0 : g.creationdepth_max;
		computation_depth_max = g.compdepth_max;
		prlist = g.prlist;
		prlist_2c = g.prlist_2c;
		prlist_1c = g.prlist_1c;
		prlist_terminals = g.prlist_terminals;
		prlist_nonterminals = prlist_2c.concat(prlist_1c);
		gate_chooseexisting = g.gate_chooseexisting;
		evaluate = evaluate_function0 ? evaluate_function0 : evaluate_function_default;
		that.evaluate = evaluate;
		//--------------------------------------------------
		// select for root a primitive with at least 1 child
		var pr_root;
		do{pr_root = prlist.chooserandom();} while(pr_root.n < 1);
		root = new nodestruct(pr_root);
		// add computation depth terminal
		var pr_compleaf = prlist_terminals.chooserandom();
		root.compleaf = new nodestruct(pr_compleaf);
		root.compleaf.leaf_flag = true;
		nodelist = [];
		var obj = {};
		obj.node = root;
		obj.visited = false;
		nodelist.push(obj);
		network = create_network(root, 0);
		that.network = network;
		that.root = root;
	}//end: setup()
	//--------------------------------------------------
	function create_network(node, depth){
		// now that we might be at an already-created node
		// with already-existing children, only add children if we have yet to
		// match the array length to the node's n property
		//----------
		// another possibility is that we were in the middle of adding children,
		// then one of the descendents of this node linked back to it while it was still
		// waiting for the rest of its children to be created. In that case, did it fill the remaining
		// children, becuase then we get back here and the local i in the for-loop
		// still thinks we need to add more children
		// two options are:
		// 1. don't add children when we choose an existing node, but this 
		// might make for boring behavior
		// 2. check the length of the children every time we begin a new pass of this loop
		// - - start with the simple way, not filling any children if we choose an
		// - - existing node, since they should be filled as we resurface through the layers
		for(var i=0;i<node.n;i++){
			var child;
			if(depth < g.childbearing_creationdepth_min){				
				// must create child-bearing children if we create children
				// check if we also have the option to choose existing
				if(depth > g.chooseexisting_depth_min){
					// we can choose an existing node or create a new child-bearing child
					if(gate_chooseexisting.trial()){
						// choose existing
						// - don't allow self-loops for now
						do{child = nodelist.chooserandom().node;} while(child == node);
					}
					else{
						// create new child-bearing child
						child = new nodestruct(prlist_nonterminals.chooserandom());
						handle_new_child();
					}
				}
				else{
					// we're not past the choose existing threshold
					// must create child-bearing child
					child = new nodestruct(prlist_nonterminals.chooserandom());
					handle_new_child();
				}
			}
			else{
				// we've passed the threshold depth for creating terminals
				// check if we're above max creation depth
				if(depth < creationdepth_max){
					// we can create any kind of child: existing, terminal, or child-bearing
					if(gate_chooseexisting.trial()){
						// choose existing
						// - don't allow self-loops for now
						do{child = nodelist.chooserandom().node;} while(child == node);
					}
					else{
						// create a new child of any kind (children or terminal)
						child = new nodestruct(prlist.chooserandom());
						handle_new_child();
					}
				}
				else{
					// we're at the max creation depth, 
					// must create a terminal or choose existing
					if(gate_chooseexisting.trial()){
						// choose existing
						// - don't allow self-loops for now
						do{child = nodelist.chooserandom().node;} while(child == node);
					}
					else{
						// create a terminal
						child = new nodestruct(prlist_terminals.chooserandom());
						handle_new_child();
					}
				}
			}
			//--------------------------------------------------
			function handle_new_child(){
				add_compleaf();
				// continue down into the children
				child = create_network(child, depth+1);
			}
			//--------------------------------------------------
			function add_compleaf(){
				// add computation depth terminal
				var pr_compleaf = prlist_terminals.chooserandom();
				child.compleaf = new nodestruct(pr_compleaf);
				child.compleaf.leaf_flag = true;
				var obj = {};
				obj.node = child;
				obj.visited = false;
				nodelist.push(obj);
			}
			node.c.push(child);
			//--------------------------------------------------
		}
		return node;
	}//end: create_network()
	//--------------------------------------------------
	function evaluate_function_default(){
		return root.evaluate();
	}
	//--------------------------------------------------
	function get_networkdata(){
		var nodes = [];
		var links = [];
		var nodelistflat = nodelist.map(function(d){return d.node;});
		nodelist.forEach(function(d,i){			
			nodes.push(d.node);
			d.node.c.forEach(function(child){
				var child_index = nodelistflat.indexOf(child);
				links.push({source:i, target:child_index});
			});
		});
		return {nodes:nodes, links:links};
	}//end: get_networkdata()
	//--------------------------------------------------
	this.mutate = function(){

		g.mutenode = nodelist.chooserandom();
		var index = g_networkdata.nodes.indexOf(g.mutenode.node);
		
		/*
		g_networkdata.nodes.splice(index, 1);
		// move this into a visualization.update() function
		force.nodes();
		*/
		g.node.each(cout("yes"));



	}	
	//--------------------------------------------------
}//end: gpclass()

















