


function aspectratios(){

  function getImageSize(img, callback) {
      var img = $(img);
      var wait = setInterval(function() {
          var w = img[0].naturalWidth,
              h = img[0].naturalHeight;
          if (w && h) {
              clearInterval(wait);
              callback.apply(this, [img, w, h]);
          }
      }, 30);
  }
  
  function usedims(elem, w,h){
    elem = $(elem);
    //console.log("elem: ", elem);
    elem.attr("data-height", h);
    elem.attr("data-width", w);
    var ratio = h/w;
    elem.attr("data-heightperwidth", ratio);
    var effectiveheight = 342*ratio;
    elem.attr("data-effectiveheight", effectiveheight);
    
    // call the layout now that images all have height attribute
    elem.attr("height", effectiveheight);
    $('#myContent li').wookmark({itemWidth: 362});

  }
  var allimages = $("img");
  allimages.each(function(i){
    getImageSize(this, usedims);
  });

}




/*!
  jQuery Wookmark plugin 0.1
  @name jquery.wookmark.js
  @author Christoph Ono (chri@sto.ph or @gbks)
  @version 0.1
  @date 12/14/2011
  @category jQuery plugin
  @copyright (c) 2009-2011 Christoph Ono (www.wookmark.com)
  @license Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
*/
$.fn.wookmark = function(options) {
  // Apply defaults for options if they are not provided.
  if(!options.container) options.container = $(window);
  


  // JL
  // if(!options.offset) options.offset = 2;
  if(!options.offset) options.offset = 10;



  if(!options.itemWidth) {
    options.itemWidth = $(this[0]).width();
  }

  // Calculate basic layout parameters.
  var columnWidth = options.itemWidth + options.offset;
  var containerWidth = options.container.width();

  if(containerWidth < 390) containerWidth = 390;

  var columns = Math.floor((containerWidth+options.offset)/columnWidth);
  columns = Math.min(columns, 4);
  var offset = Math.round((containerWidth - (columns*columnWidth-options.offset))/2);
  
  // Prepare Array to store height of columns.
  var heights = [];
  while(heights.length < columns) heights.push(0);
  
  // Loop over items.
  var item, top, left, i=0, k=0, length=this.length, shortest=null, shortestIndex=null, bottom = 0;
  for(; i<length; i++ ) {
    item = $(this[i]);



    // JL
    //$(".nav").css("width", (columns * columnWidth) + "px");
    // this is now done in the html files to stop nav from jumping after load



    
    // Find the shortest column.
    shortest = null;
    shortestIndex = 0;
    for(k=0; k<columns; k++) {
      if(shortest == null || heights[k] < shortest) {
        shortest = heights[k];
        shortestIndex = k;
      }
    }
    
    // Postion the item.
    item.css({
      position: 'absolute',
      top: shortest+'px',
      left: (shortestIndex*columnWidth + offset)+'px'
    });
    
    // Update column height.
    heights[shortestIndex] = shortest + item.outerHeight() + options.offset;
    bottom = Math.max(bottom, heights[shortestIndex]);
  }
  
  // Set container height to height of the grid.
  options.container.css('height', bottom+'px');
  
  // Display items (if hidden).
  this.show();

  //JL
  $("#myContent").css("visibility", "visible");
  $("body").removeClass("loading");
};
