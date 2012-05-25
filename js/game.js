  (function() {
        var $window = $(window),
            $body = $('html,body'),
            height = $('body').height(),
            isScrollingDown = true,
            currentScrollPos = 0,
            prevScrollPos = 0,
            step = 1,
            maxSteps = 55,
            rangeY = d3.scale.linear().range([0, maxSteps]);


        window.rangeY = rangeY;

        var updateOnScroll = function() {
            currentScrollPos = $body.scrollTop();

            if (currentScrollPos > prevScrollPos) {
                isScrollingDown = true;
            } else {
                isScrollingDown = false;
            }


            if ( currentScrollPos < 0 ) {
                //Hey Lion, Suck it. 
                return;
            }
            //target: 14, current: 10 => go(4);
            //target 4, current: 6 => go(-2)

            var percentDownThePage = currentScrollPos / height;

            var targetStep = Math.floor ( rangeY( percentDownThePage ) );


            if ( ! conway.isUpdating ) {
                conway.go( targetStep );
            } else {
                console.log('miss');
            }





            prevScrollPos = currentScrollPos; 

        };

        $window.scroll(_.throttle( updateOnScroll, 1 ));
    })();