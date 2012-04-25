/* Author: DiMarco

*/

//return a function with closure access to `section` positions
function updateNavFn() {

    var $window      =   $(window),
        $nav         =   $("nav:first"),
        nav_height   =   $nav.height(),
        section_ids  =   [],
        section_tops =   [],
        num_sections =   0,
        current_pos  =   0,
        scroll_fn
        ;

    //grab all the nav's anchors and throw them into an array
    $nav.find("ul li a").each(function(key, val) {
        var id = $(val).attr('href');

        section_ids.push( id );
        section_tops.push ( $(id).offset().top );
    });

    num_sections = section_ids.length;

    //check if scrollTop is higher than current_pos's height
    //or lower
    //also, doc better
    scroll_fn = function() {
        var scrollTop = $window.scrollTop();

        if (scrollTop >
                ((section_tops[current_pos + 1] || section_tops[num_sections -1]) - nav_height)
            ) {
            current_pos += 1;
                console.log('current pos is', section_ids[current_pos]);
        } else if (scrollTop < (section_tops[current_pos - 1]) || 0) {
            current_pos = current_pos >= 1 ? current_pos - 1 : 0;
                console.log('current pos is', section_ids[current_pos]);
        }
    };

    return scroll_fn;

}

function addNavScrolls() {
   $("nav ul li a").click(function() {
       var $this        = $(this),
           $html        = $("body"),
           target_id    = $this.attr('href'),
           target_top      = $(target_id).offset().top;



        $('body').animate({
            scrollTop: target_top
        });

        return false;
   });
}

$(window).scroll(_.throttle(updateNavFn()));

addNavScrolls();





