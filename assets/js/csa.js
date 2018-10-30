var SITE = {
    conf: {
	     lastExerciseCount: -1,
	      lastChapterCount: -1
    },
    init: function() {
        SITE.initAssignmentToc();
        SITE.initMaterialToc();
        SITE.initMaterialTocNav();
        SITE.initMaterialLinks();
        SITE.initLogin();
        SITE.initProgress();
        SITE.initBrowserSupport();
    },
    initBrowserSupport: function() {
      var $warning = $('.browser-support-warning');
      var $closeWarning = $('.browser-support-warning__close');
      var chromeOrFirefox = bowser.firefox || bowser.chrome;

      if(!chromeOrFirefox) {
        $warning.show();
      }

      $closeWarning
        .on('click', function(e) {
          e.preventDefault();
          $warning.hide();
        });
    },
    initMaterialLinks: function() {
      var $links = $('.table-of-contents a');

      $links
        .on('click', function(e) {
          e.preventDefault();

          var id = $(this).attr('href');
          var formattedId = id.substring(1, id.length);

          $('html, body').animate({
            scrollTop: $('#' + formattedId).offset().top - 110
          }, 400);
        });
    },
    initProgress: function() {
      var $progress = $('.content-progress');
      var $progressLabel = $('.content-progress__label');
      var $progressBar = $('.content-progress__bar');

      $(window)
        .on('scroll', function() {
          if($(window).scrollTop() + $(window).height() >= $(document).height() || $(window).scrollTop() === 0) {
            $progress.hide();

            return;
          }

          $('body > article > section').each(function(index) {
            var $section = $(this);

            var scrollTop = $(window).scrollTop();
            var top = $section.offset().top;
            var height = $section.outerHeight();

            if(scrollTop > top && scrollTop < top + height) {
              var $heading = $section.find('> header > h1');
              var percentage = (scrollTop - top) / height * 100;

              if($heading.length) {
                $progress.show();
                $progressLabel.text($heading.text());
                $progressBar.css('width', percentage + '%');
              } else {
                $progress.hide();
              }
            }
          });

        });
    },
    initQuiznator: function() {
      var client = new window.TmcClient();

      var init = function() {
        var user = client.getUser();

        window.Quiznator.setUser({
          id: user.username,
          accessToken: user.accessToken
        });
      }

      if(window.Quiznator) {
        init();
      } else {
        document.addEventListener('quiznatorLoaded', init);
      }
    },
    initLogin : function() {
      var $loginTrigger = $('.login-trigger');
      var $loginModal = $('#tmc-login-modal');
      var $loginSubmit = $('#tmc-login-submit');
      var $loginUsername = $('#tmc-login-username');
      var $loginPassword = $('#tmc-login-password');
      var $loginError = $('#tmc-login-error');

      var showError = function(message) {
        $loginError.text(message);
        $loginError.show();
      }

      var client = new window.TmcClient("2d2084443754c26933fa53548177386c8210bff472e8bd157df84033f24cadd5", "34a49ed3d20b8a524889cc64a4668e9fced34ab41b7c74a11689a4602e906a12");

      if(client.getUser()) {
        $loginTrigger.text('Log out ' + client.getUser().username);

        SITE.initQuiznator();
      } else {
        $loginTrigger.text('Log in');
      }

      $loginTrigger
        .on('click', function(e) {
          e.preventDefault();

          if(client.getUser()) {
            client.unauthenticate();

            window.Quiznator.removeUser();

            $loginTrigger.text('Log in');
          } else {
            $loginModal.modal('show');
          }
        });

      $loginSubmit
        .on('click', function(e) {
          e.preventDefault();

          $loginError.hide();

          var username = $loginUsername.val();
          var password = $loginPassword.val();

          if(!username || !password) {
            showError('No username or password provided');
          } else {
            client.authenticate({ username: username, password: password })
              .then(function(response) {


                $loginTrigger.text('Log out');
                $loginModal.modal('hide');

                SITE.initQuiznator();
              })
              .catch(function() {
                var error = 'Invalid username or password.';
                showError(error);
              });
          }
        });
    },
    initMaterialTocNav: function() {
      $('.table-of-contents-layer, .table-of-contents a')
        .on('click', function(e) {
          $('.table-of-contents').removeClass('table-of-contents--visible');
          $('.table-of-contents-layer').removeClass('table-of-contents-layer--visible');
        });

      $('.table-of-contents-trigger')
        .on('click', function(e) {
          e.preventDefault();

          $('.table-of-contents').addClass('table-of-contents--visible');
          $('.table-of-contents-layer').addClass('table-of-contents-layer--visible');
        });
    },
    initAssignmentToc: function() {
	$(".assignment").each(function(index, value) {
	    var exCount = -1;

	    if(SITE.conf.lastExerciseCount < 0) {
		exCount = (index + 1);
		SITE.conf.lastExerciseCount = exCount;
	    } else {
		SITE.conf.lastExerciseCount = SITE.conf.lastExerciseCount + 1;
		exCount = SITE.conf.lastExerciseCount;
	    }

	    if($(value).data("count")) {
		exCount = $(value).data("count");
		SITE.conf.lastExerciseCount = exCount;
	    }

            var exName = "Assignment " + exCount + ": " + $(value).find("h1 a").text();

            // add assignments to toc
            $("#assignments-toc").append("<li><a data-toggle='collapse' href='" + $(value).find("h1 a").attr("href") + "'>" + exName + "</a></li>");

            // add links to assignment names
            $(value).attr("id", $(value).find("h1 a").attr("href").substring(1) + "-ex");

            // relabel assignments
            $(value).find("header h1 a").text(exName);

            // tag subassignments
            $(value).find("div h1").each(function(subIndex, value) {
                $(value).text(exCount + "." + (subIndex + 1) + ": " + $(value).text());
            });
        });

	// link toc to assignments
        $("#assignments-toc a").each(function(index, value) {
            $(value).click(function() {
                $('html, body').animate({
                    scrollTop: $($.attr(this, 'href') + "-ex").offset().top
                }, 400);

                $($.attr(this, 'href')).click();
            });
        });
    },
    initMaterialToc: function() {
        var idx = 1;

        $("section h1").each(function(index, value) {
            if ($(value).parents('.assignment').length
		|| $(value).parents('.no-toc').length) {
                return; //ignore elements related to assignments
            }

	    if ($(value).parents('header').length
		|| $(value).parents('aside').length) {
                return; //ignore elements within header or aside
            }


	    if(SITE.conf.lastChapterCount < 0) {
		idx = 1;
		SITE.conf.lastChapterCount = idx;
	    } else {
		SITE.conf.lastChapterCount = SITE.conf.lastChapterCount + 1;
		idx = SITE.conf.lastChapterCount;
	    }

	    if($(value).data("count")) {
		idx = $(value).data("count");
		SITE.conf.lastChapterCount = idx;
	    }

            var chapterCount = idx;
            var chapterText = chapterCount + ". " + $(value).text();

            $(value).attr("id", "chapter" + chapterCount);
            $(value).text(chapterText);

            // add chapters to toc
            $("#material-toc").append("<li><a href='#chapter" + chapterCount + "'>" + chapterText + "</a></li>");
            idx++;


            // iterate through siblings
            var sibling = $(value).next();
            var count = 1;
            while (sibling) {
                // do not relabel assignments
                if (!$(sibling).prop("tagName") || $(sibling).prop("tagName").toLowerCase() === "h1") {
                    break;
                }

                if ($(sibling).prop("tagName").toLowerCase() === "h2") {
                    var subChapterText = (chapterCount + "." + count + ". " + $(sibling).text());
                    $(sibling).text(subChapterText);
                    var id = "chapter" + chapterCount + "-" + count;
                    $(sibling).attr("id", id);

                    $("#material-toc").append("<li><a href='#" + id + "'>&nbsp;&nbsp;&nbsp;" + subChapterText + "</a></li>");

                    count++;
                }


                sibling = $(sibling).next();

                if(sibling.length <= 0) {
                    break;
                }
            }
        });

    }
};


$(function() {
    SITE.init();
});
