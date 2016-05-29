//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
var test = [];
//--------------------------------------------------

var currentindex = [];

var gdata_base = [];
var gdata_keyStatus_sorted_base = [];
var gdata_keyStatus_sorted_filtered = [];
var gdata_keyDateCreated_sorted_base = [];
var gdata_keyDateCreated_sorted_filtered = [];
var status_bases;
var gdata_keyDateCreated_filterStatus_base;

var keylists;
var keylist_filterStatus_base;

var g_averages_interval = 10;//days
var gdata_keyStatus_intervals = [];
var g_DateCreated_min;
var g_DateCreated_max;
var g_slidervalleft;
var g_slidervalright;
var gmindomain;
var gmaxdomain;
var g_TotalSize_range;
var g_RunningDuration_range;
var platform_svg;
var slider;
var donut;
var graph1;
var graph2;
var rangeslidermenu;
var titlebutton_bgcolor_on = "rgba(0,0,0, .2)";
var titlebutton_bgcolor_off = "rgba(0,0,0, .1)";
var titlebutton_textcolor_on = "rgba(0,0,0, 1)";
var titlebutton_textcolor_off = "rgba(0,0,0, .3)";
var gminseparation_slider_range = 10;
var g_reloaded = 0;
// made these because of the problem where the slider's 
// slider.dxleft and slider.dxright values were not being updated, did not figure out why
var g_dxleft = 0;
var g_dxright = 0;
// buttons under slider
var g_buttonmenu = [];
// for positioning terminals in tick
// - this isn't working, 
var g_enteringnodes_sel;
// keep a list of entering nodes, their indices in the dataset.nodes array
var g_enteringnodes_indices = [];
var g_array = [];
var g_array2 = [];
var gtransition_duration = 1200;
var g_clickedbutton;
var newdomainmin;
var g_testcontrols_svg;
var g_sliderlist = [];
var force_parameters_set1 = {
    charge: -400,
    linkdistance: 16,
    gravity: -.14,
    chargedistance: 150,
    linkstrength: 2,
    friction: .8,
    theta: .1,
    start_angle: 1.10
}
// got these values from slider testing
var force_parameters_set2 = {
    alpha: 0.1,//the d3 default
    charge: -1600,
    linkdistance: 42.1,
    gravity: -0.46,
    
    //chargedistance: 150,
    chargedistance: 900,

    linkstrength: 9.5,
    friction: 0.54,
    theta: 1.1,
    start_angle: 0.87
}
var rangeslider;
var rdonut_g;
// from mockup 2, version 4.1.14b
var tooltip = d3.select("body")
    .append("div")
    .attr("id","tooltip1")
    .attr("class","style_tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    ;
var g_delay = 50;
var g_duration = 300;
var g_delay_graph2 = 0;
var g_duration_graph2 = 400;
var g_ease = "cubic-out";
var g_bigdx;
var style_hidden = [
    ["visibility", "hidden"]
];
var style_line_dashed = [
    ["stroke", "rgba(0,0,0, .1)"],
    ["stroke-width", "1px"],
    ["stroke-dasharray", "5,3"],
    ["shape-rendering", "crispEdges"],
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
var g_graph_testing_tick_controls_flag = false;
var g_hold_alpha;
var g_run_graph_flag = true;
var g_firsttime = true;
var g_lockdown = false;
var msperday = 1000*60*60*24;
var g_n_intervals = 20;
var g_ratioflag = true;
var g_interval_list;
var g_small_menu_separation_point = point(4,0);
var table_svg;
var table;
var g_totaldata;
var g_totalduration;
var g_totalappsessions;
var g_totals;
var selector;
var selector_allstatus_string = "All";

var selector_launchsource;
var selector_alllaunchsource_string = "All";
var g_totals_header_fontsize = 17;
var g_totals_val_fontsize = 30;

var color_complete = "#59bff8";
var color_aborted = "#878787";
var color_aborting = "#ff0d34";
var color_running = "#59ff4e";
var color_timedout = "#a3a3a3";
var color_initializing = "#ff9f1e";
var color_awaitingauthorization = "#ffef59";
var color_pendingexecution = "#e3f6af";
var color_NeedsAttention = "#880022";
var color_PaymentAborted = "#555555";
var color_PaymentComplete = "#000066";
var color_PendingPayment = "#555588";
var color_Undefined = "#222222";

var totals_valcolor = fc(0,0,0, 1);
var totals_allstatus_string = "All";
var color_selector = {};

color_selector.Complete = color_complete;
color_selector.Aborted = color_aborted;
color_selector.Aborting = color_aborting;
color_selector.Running = color_running;
color_selector.TimedOut = color_timedout;
color_selector.Initializing = color_initializing;
color_selector.AwaitingAuthorization = color_awaitingauthorization;
color_selector.PendingExecution = color_pendingexecution;
color_selector.NeedsAttention = color_NeedsAttention;
color_selector.PaymentAborted = color_PaymentAborted;
color_selector.PaymentComplete = color_PaymentComplete;
color_selector.PendingPayment = color_PendingPayment;
color_selector.Undefined = color_Undefined;

var g_formatdays_flag = true;

var order = [];
order.push("Aborting");
order.push("Aborted");
order.push("TimedOut");
order.push("Initializing");
order.push("Running");
order.push("PendingExecution");
order.push("Complete");
order.push("AwaitingAuthorization");
order.push("NeedsAttention");
order.push("PaymentAborted");
order.push("PaymentComplete");
order.push("PendingPayment");
order.push("Undefined");

var max_sessions = 5000;










