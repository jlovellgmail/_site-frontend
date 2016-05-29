//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
var style_line_dashed = [
    ["stroke", "rgba(0,0,0, .1)"],
    ["stroke-dasharray", "5,3"],
    ["d", "M5 20 l215 0"]
];
var style_line_dasheddark = [
    ["stroke", "rgba(0,0,0, .4)"],
    ["stroke-dasharray", "5,3"],
    ["d", "M5 20 l215 0"]
];
var style_line_solid = [
    ["stroke", "rgba(0,0,0, .2)"],
];
var style_circle_complete = [
    ["fill", "rgba(75,150,255, 0.9)"],
];
var style_circle_timedout = [
    ["fill", "rgba(255,0,0, 0.9)"],
];
var style_circle_aborted = [
    ["fill", "rgba(75,75,75, 0.3)"],
];
var style_circle_running = [
    ["fill", "rgba(0,255,0, 0.9)"],
];
//--------------------------------------------------
var graphclass = function (sel0, rect0) {
    var baserect = new rectclass();
    baserect.x = 0;
    baserect.y = 0;
    baserect.w = rect0.w;
    baserect.h = rect0.h;
    var m = rect0.m;
    baserect.m = new marginclass(m.l, m.r, m.t, m.b);
    var graph_g = sel0.append("g");
    this.graph_g = graph_g;
    graph_g.attr("transform", "translate(" + rect0.left() + "," + rect0.top() + ")");
    var graphrect = baserect.get_inrect();
    graphrect.m.set_all(0);
    graphrect.c = "rgba(255,0,0, 0)";
    var drawrect = graphrect.get_inrect();
    drawrect.m.set(0, 2, 20, 10);
    drawrect.c = "rgba(255,255,255, .7)";
    var datapointsrect = drawrect.get_inrect();
    datapointsrect.c = "rgba(255,255,255, .3)";
    append_rect_fill(graph_g, graphrect);
    append_rect_fill(graph_g, drawrect);
    append_rect_stroke(graph_g, drawrect);
    var xaxis_g = graph_g.append("g")
        .attr("class", "axis")
        .attr("id", "id_xaxis_g")
        .attr("transform", "translate(0," + drawrect.bottom() + ")")
    ;
    var yaxis_g = graph_g.append("g")
        .attr("class", "axis")
        .attr("id", "id_yaxis_g")
        .attr("transform", "translate(" + drawrect.left() + ",0)")
    ;
    var interiorlines_g = graph_g.append("g");
    var y0line = interiorlines_g.append("line")
    apply_style(y0line, style_line_dasheddark);
    var datapoints_g = graph_g.append("g");
    var datapoints_path = datapoints_g.append("path")
        .attr("id", "id_datapoints_path")
        .attr("class", "class_graph_verticallines")
    ;
    var xdomain;
    var ydomain = [g_TotalSize_min, g_TotalSize_max];
    var xrange;
    var yrange;
    var hscale;
    var vscale;
    var xaxis;
    var yaxis;
    var y0line;

    // testing, copying this class for graph2
    this.circlecolor = "#f30";

    //--------------------------------------------------
    this.update = function () {
        var xdomainmin = gmindomain;
        var xdomainmax = gmaxdomain;
        xdomain = [moment(xdomainmin), moment(xdomainmax)];
        xrange = [datapointsrect.left(), datapointsrect.right()];
        yrange = [datapointsrect.bottom(), datapointsrect.top()];
        hscale = d3.time.scale();
        hscale.domain(xdomain);
        hscale.range([drawrect.get_inrect().left(), drawrect.get_inrect().right()]);
        vscale = d3.scale.linear();
        vscale.domain(ydomain);
        vscale.range([drawrect.get_inrect().bottom(), drawrect.get_inrect().top()]);
        set_line(y0line, xrange[0], vscale(0), xrange[1], vscale(0));
        xaxis = d3.svg.axis()
            .scale(hscale)
            .orient("bottom")
        ;
        yaxis = d3.svg.axis()
            .scale(vscale)
            .orient("left")
            .tickFormat(function (d) { return d3.format(".0f")(d / 1000000000) + " Gb"; })
        ;
        xaxis_g.call(xaxis);
        yaxis_g.call(yaxis);
        g_array = gdata_keyDateCreated_sorted_filtered.map(function (d) {
            return {
                x: moment(d.key),
                y: d.values[0].TotalSize
            };
        });
        var s = "";
        var vertlines = function (datapointlist) {
            datapointlist.forEach(function (d) {
                s += " M" + hscale(d.x) + "," + vscale(0) + " L" + hscale(d.x) + "," + vscale(d.y);
            });
            return s;
        }
        datapoints_path.attr("d", vertlines(g_array));
        var circles = datapoints_g.selectAll(".class_graph_endpointcircle")
            .data(g_array, function (d) { return d.y; })
        ;
        this.circles = circles;//testing
        circles.enter()
            .append("circle")
            .attr("cx", function (d) { return hscale(d.x) })
            .attr("cy", function (d) { return vscale(d.y) })
            .attr("r", 2)
            .attr("class", "class_graph_endpointcircle")
            ;

        circles.transition()
            .attr("cx", function (d) { return hscale(d.x) })
            .attr("cy", function (d) { return vscale(d.y) })
            .delay(0)
            .duration(0)
        ;
        circles.exit()
            .remove()
        ;

        // testing, copying this class for graph2
        if(this.circlecolor){
            circles.attr("fill", this.circlecolor)
                //.attr("stroke","#000")
                //.attr("r", 6)
                ;
        }

    }//end:update()
    this.update();
    //--------------------------------------------------
    this.hide = function () {
        graph_g.style("visibility", "hidden");
    }
    this.show = function () {
        graph_g.style("visibility", "visible");
    }
    //--------------------------------------------------
}//end:graphclass()




