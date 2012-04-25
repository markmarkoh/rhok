d3.xml('/img/rhok-blob.svg', function(data) {
    var svg = $('<div/>', {
        "class": "bg",
        "html": $(data).find('svg')
    })
    $("body").append( svg );
});