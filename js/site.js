/* Author: DiMarco

*/

//return a function with closure access to `section` positions
function updateNavFn() {

    var $window      =   $(window),
        $body = $.browser.safari ? $('body') : $('html'),
        $nav         =   $("nav:first"),
        nav_height   =   $nav.height(),
        section_ids  =   [],
        section_tops =   [],
        nav_tops     =   [],
        num_sections =   0,
        current_pos  =   0,
        previous_pos =   0,
        scroll_fn
        ;

    //grab all the nav's anchors and throw them into an array
    $nav.find("ul li a").each(function(key, val) {
        var id = $(val).attr('href');

        section_ids.push( id );

        //hacky. this fly at the coffee shop has it out for me. that's my excuse.
        nav_tops.push ( key === 0 ? 0 : $(val).offset().top );

        section_tops.push ( $(id).offset().top );
    });

    num_sections = section_ids.length;

    //check if scrollTop is higher than current_pos's height
    //or lower
    //also, doc better
    scroll_fn = function() {

        var scrollTop = $body.scrollTop();

        if (scrollTop < 10) {
            updateNavActiveClass(0);
            return;
        }

        scrollTop -= 100;

        for(var i = 0; i < section_tops.length; i++) {
            if ((scrollTop >= section_tops[i]) && (scrollTop < (section_tops[i + 1]) || 10000)) {
                updateNavActiveClass(i + 1);
            }
        }
    };


    function updateNavActiveClass(current_pos) {
        $(".active").removeClass("active");
        $nav.find("a[href='" + section_ids[current_pos] + "']").parent().addClass('active');
        $(section_ids[current_pos]).addClass('active');
    }

    //initialize
    updateNavActiveClass(0);
    scroll_fn();

    (function addNavClickToScroll() {
       $("nav ul li a").click(function() {
           var $this        = $(this),
               target_id    = $this.attr('href'),
               target_top   = $(target_id).offset().top;


            //we can't use translateY here because it does a literal translate and messes
            //up our scrollTop
            $body.animate({
                scrollTop: target_id === "#first" ? 0 : target_top - (nav_tops[$this.parent().index()])
            }, function() {
                updateNavActiveClass( section_ids.indexOf(target_id));
            });

            return false;
       });
    })();

    return scroll_fn;

}


$(function() {
    $(window).scroll(_.throttle(updateNavFn(), 250));
});





