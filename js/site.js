/* Author: DiMarco

*/

//return a function with closure access to `section` positions
function updateNavFn() {

    var $window      =   $(window),
        $body        =   $('body'),
        $nav         =   $("nav:first"),
        nav_height   =   $nav.height(),
        section_ids  =   [],
        section_tops =   [],
        num_sections =   0,
        current_pos  =   0,
        previous_pos =   0,
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

        if (scrollTop >=
                ((section_tops[current_pos + 1] || section_tops[num_sections -1]) - 120)
            ) {


            if (current_pos < num_sections - 1) {
                current_pos += 1;
            }
            //console.log(' + current pos is', section_ids[current_pos]);

        } else if (scrollTop <= ((section_tops[current_pos - 1]) || 0 + 120)) {

            current_pos = current_pos >= 1 ? current_pos - 1 : 0;

            //console.log(' - current pos is', section_ids[current_pos]);
        }

        if (previous_pos !== current_pos) {
            updateNavActiveClass(current_pos);
            previous_pos = current_pos;
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

    return scroll_fn;

}

function addNavClickToScroll() {
   $("nav ul li a").click(function() {
       var $this        = $(this),
           target_id    = $this.attr('href'),
           target_top      = $(target_id).offset().top;

        //we can't use translateY here because it does a literal translate and messes
        //up our scrollTop

        $('body').animate({
            scrollTop: target_top - 120
        });

        return false;
   });
}

$(window).scroll(_.throttle(updateNavFn(), 100));

addNavClickToScroll();





