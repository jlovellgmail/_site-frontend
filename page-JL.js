jQuery(document).ready(function($) {



	function JL_resizer(){
		if( $("#slide img").height() <  $('#slide').height() ) {
			$("#slide img").load(function(){
				var margin = ($('#slide').height() - $("#slide img").height())/2;
				$('#slide img').css('margin-top', margin);
			});
			var margin = ($('#slide').height() - $("#slide img").height())/2;
			$('#slide img').css('margin-top', margin);
		}
	}
	function resizer_iframe() {
		// set aspect ratio from width/height attributes
		var iframe = $('#slide iframe');
		var widthoverheight;
		if(iframe[0].hasAttribute("widthoverheight")){
			widthoverheight = iframe.attr("widthoverheight");
		}
		else {
			iframe.attr("width-original", iframe.attr("width"));
			iframe.attr("height-original", iframe.attr("height"));
			widthoverheight = iframe.attr("width") / iframe.attr("height");
			iframe.attr("widthoverheight", widthoverheight);
		}

		var slide = $('#slide');
		var widthoverheight_slide = slide.width() / slide.height();
		if(widthoverheight_slide < widthoverheight){
			// resize based on width
			var targetwidth = $('#slide').width() - 200;
			if( iframe.width() > targetwidth) {
				var width_new = targetwidth;
				var height_new = (1.0 / widthoverheight) * width_new;
				iframe.attr("width", width_new);
				iframe.attr("height", height_new);
			}
			else if( iframe.width() < targetwidth && iframe.width() < iframe.attr("width-original") ) {
				var width_new = targetwidth;
				var height_new = (1.0 / widthoverheight) * width_new;
				iframe.attr("width", width_new);
				iframe.attr("height", height_new);
			}
		}
		else {
			// resize based on height
			var targetheight = $('#slide').height() - 100;
			if( iframe.height() > targetheight) {
				var height_new = targetheight;
				var width_new = widthoverheight * height_new;
				iframe.attr("width", width_new);
				iframe.attr("height", height_new);
			}
			else if( iframe.height() < targetheight && iframe.height() < iframe.attr("height-original") ) {
				var height_new = targetheight;
				var width_new = widthoverheight * height_new;
				iframe.attr("width", width_new);
				iframe.attr("height", height_new);
			}
		}
		// recenter in window
		var margin = ($('#slide').height() - $("#slide iframe").height())/2;
		$('#slide iframe').css('margin-top', margin);
	}
	$( window ).resize(function() {
		JL_resizer();
		resizer_iframe();
	});


	var prefix = "http://lovell.ipage.com/design/images/";
	$(".contentcontainer").each(function(){
		$(this).parents('li').attr('data-order', $(this).parents('li').index());
	});
	$(".contentcontainer").click(function(e){
		e.preventDefault();
		var src= $(this).data('image');
		var num = $(this).parent("li").index();
		$("#slide").hide();
		if(src == "iframe"){
			var iframe = $(this).find("#iframe").html();
			$("#slide").html(iframe);
			$("#slide").data('slide',num);
			$('#slideshow').show();
			$("#slide").show();
			resizer_iframe();
		}
		else {
			$("#slide").html("<img src='" + prefix + src + "'/>");
			$("#slide").data('slide',num);
			$("#slide").data('height',$(this).data('height'));
			$("#slide").data('width',$(this).data('width'));
			$("#caption").html($(this).data('caption'));
			$('#slideshow').show();
			$("#slide img").load(function(){
				$("#slide").show();
				JL_resizer();
			});
		}
	});
	var current = 0;
	var next = 0;
	var prev = 0;


	function JL_do_previous(){		
		current = $('#slide').data('slide');
		total = $('.contentcontainer').length -1;
		prev = current-1;
		if (current == 0){
			prev = total;
		}
		src = $('.contentcontainer').eq(prev).data('image');
		caption = $('.contentcontainer').eq(prev).data('caption');
		width = $('.contentcontainer').eq(prev).data('width');
		height = $('.contentcontainer').eq(prev).data('height');
		$("#slide").hide();
		if(src == "iframe"){
			var iframe = $('.contentcontainer').eq(prev).find("#iframe").html();
			$("#slide").html(iframe);
			$("#slide").data('slide',prev);
			$('#slideshow').show();
			$("#slide").show();
			resizer_iframe();
		}
		else {
			$("#slide").html("<img src='" + prefix + src + "'/>");
			$("#caption").html(caption);
			$("#slide").data('slide',prev);
			$("#slide").data('height',height);
			$("#slide").data('width',width);
			$("#slide img").load(function(){
				$("#slide").show();
				JL_resizer();
			});
		}
	}
	function JL_do_next(){
		current = $('#slide').data('slide');
		total = $('.contentcontainer').length -1;
		next = 0;
		if (current < total){
			next = current+1;
		}
		src = $('.contentcontainer').eq(next).data('image');
		caption = $('.contentcontainer').eq(next).data('caption');
		width = $('.contentcontainer').eq(next).data('width');
		height = $('.contentcontainer').eq(next).data('height');
		$("#slide").hide();
		if(src == "iframe"){
			var iframe = $('.contentcontainer').eq(next).find("#iframe").html();
			$("#slide").html(iframe);
			$("#slide").data('slide',next);
			$('#slideshow').show();
			$("#slide").show();
			resizer_iframe();
		}
		else {
			$("#slide").html("<img src='" + prefix + src + "'/>");
			$("#caption").html(caption);
			$("#slide").data('slide',next);
			$("#slide").data('height',height);
			$("#slide").data('width',width);
			$("#slide img").load(function(){
				$("#slide").show();
				JL_resizer();
			});
		}
	}


	document.getElementsByTagName('body')[0].onkeyup = function(e) { 
		var ev = e || event;
		if($("#slideshow").is(":visible")) {
			// left arrow
			if(ev.keyCode == 37) {
				JL_do_previous();
			}
			// right arrow
			if(ev.keyCode == 39) {
				JL_do_next();
			}
			// escape key
			if(ev.keyCode == 27) {
				$("#slideshow").hide();
			}
		}
	}
	$("#next").click(function(e){
		e.preventDefault();
		JL_do_next();
	});
	$("#previous").click(function(e){
		e.preventDefault();
		JL_do_previous();
	});
	$("#close").click(function(){
		$("#slideshow").hide();
	});

	$("#slide").css("user-select", "none");
	$("#slide").css("cursor", "pointer");
	$("#slide").click(function(e){
		e.preventDefault();
		JL_do_next();
	});
});
