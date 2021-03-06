  (function() {
        var $window = $(window),
            $body = $.browser.safari ? $('body') : $('html'),
            height = $('body').height(),
            isScrollingDown = true,
            currentScrollPos = 0,
            prevScrollPos = 0,
            step = 1,
            isMobile = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/),
            maxSteps = isMobile ? 15 : 55,
            rangeY = d3.scale.linear().range([0, maxSteps]);


        window.rangeY = rangeY;

        var updateOnScroll = function() {
            currentScrollPos = $body.scrollTop() || document.documentElement.scrollTop;

            if (currentScrollPos > prevScrollPos) {
                isScrollingDown = true;
            } else {
                isScrollingDown = false;
            }


            if ( currentScrollPos < 0 ) {
                //Hey Lion, Suck it.
                return;
            }

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
