  $(function() {

    var attendeeTmpl = '<li class="user-block"> <div class="image"><img alt=""></div> <dl class="info"> <dt class="name"></dt> <dd class="handle"><a href=""></a></dd> </dl> </li>';

    (function() {

    var $list = $('.participants');

    $.get('attendees.php', function(data) {
        if (!data || !$.isArray(data)) return;
        for(var i = 0; i < data.length; i++) {
            var att = data[i];
            $(attendeeTmpl)
                .find('.image img').attr("src", att.img).end()
                .find('.info .name').text(att.name || '').end()
                .find('.handle a').text("@" + att.handle).attr('href','http://twitter.com/#/' + att.handle).end()
                .appendTo($list);
        }
    });
    })();

    twttr.anywhere(function (T) {

      var user;

      if ( T.isConnected() ) {
        handleLoggedInUser( T.currentUser );
      }

      T("#login").connectButton({
        size: "xlarge",
        authComplete: function(user) {
          $.post('twitter.php', {"handle": user.screenName, "name": user.name, "url": user.url, "img": user.profileImageUrl}, function(data) {
          handleLoggedInUser(user, data['new']);
      });
    }
      });

    });

    var handleLoggedInUser = function(user, isNewSignup) {
      if (isNewSignup) {
          $(attendeeTmpl)
            .find('.name').text(user.name).end()
            .find('.handle a').text('@' + user.screenName).attr('href', user.url).end()
            .find('.image img').attr('src', user.profileImageUrl).end()
            .prependTo( $('.participants') );
      }
      twttr.anywhere(function (T) {
        T("#tbox").tweetBox({
          label: "Help spread the word!",
          defaultContent: "I'm hacking at RHoK Austin! You should too! http://rhokaustin.org"
        });
      });
    };
  });