function loadimages(urls_array){

    var prefix = "http://lovell.ipage.com/design/images/";
    urls_array.forEach(function(d, i){
        urls_array[i] = prefix+d;
    });

    loaded = [];
    $(urls_array).each(function() {
        var image = $('<img />').attr('src', this);
        loaded.push(image);
    });
}

