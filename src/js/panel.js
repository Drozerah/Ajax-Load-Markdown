(function ($) {

    $(document).ready(function () {

        var config = {
            srcFile: "src/markdown.md",
            ElmMarginBottom: 155,
            scrollTopSpeed: 500,
            loadingError: false
        };

        var methods = {
            scrollTop: function () {

                // scroll to top calculate extra top position
                // get title height = outerheight x 2
                $elmHeight = $('.pre-content-title').height();
                $elmHeight += $('.pre-content-title').outerHeight();
                $elmHeight -= 30;
                // scroll to calculate top 
                $('html, body').animate({
                    scrollTop: $('.load').offset().top - $elmHeight
                }, config.scrollTopSpeed);
            },
            PanelResize: function () {

                // Panel resize
                $(window).resize(function () {
                    var $window = $(window).height();
                    var $markdownContentElmEight = $window - config.ElmMarginBottom;
                    $($markdownContentElm).css({
                        "height": $markdownContentElmEight
                    });
                });
            }
        }

        // set loading state
        var $isLoaded = false;

        // create text container element
        var $markdownContentElm = document.createElement('div');
        $markdownContentElm.setAttribute("id", "markdown-content");

        // create loader element
        var $loaderElm = document.createElement('div');
        $loaderElm.setAttribute("id", "loader");
        // create closePanel element
        var $closePanelElm = document.createElement('div');
        $closePanelElm.setAttribute("id", "closePanel");
        $closePanelElm.setAttribute("title", "Fermer");
        $($closePanelElm).css({
            "text-align": "right"
        });
        // create closePanelIcon element
        var $closePanelIconElm = document.createElement('i');
        $closePanelIconElm.setAttribute("class", "material-icons");
        $($closePanelIconElm).text('close');
        // append $closePanelIconElm to $closePanelElm
        $($closePanelIconElm).appendTo($closePanelElm);

        $(".load").click(function (e) {

            e.preventDefault();

            // get window height
            var $window = $(window).height();

            // set $markdownContentElm height minor configured margin bottom
            var $markdownContentElmEight = $window - config.ElmMarginBottom;

            // update panel CSS 
            $($markdownContentElm).css({
                "height": $markdownContentElmEight,
                "background-color": "#f8f8f8"

            });

            if ($isLoaded == false) {
                // not loaded state

                // if loading error don't show $markdownContentElm and $loaderElm on next click
                if (config.loadingError == false) {

                    // append container element to #pre-content-container
                    $($markdownContentElm).appendTo("#pre-content-container");
                    // append loader to $markdownContentElm
                    $($loaderElm).appendTo($markdownContentElm);
                    // show content element

                    
                    $($markdownContentElm).fadeIn("slow", function () {


                        // show and centering loader in parent element
                        var $loaderElmHeight = $($loaderElm).css('height').replace('px','');
                        // divide by 2
                        $loaderElmHeight /= 2;

                        // show loader
                        $($loaderElm).css({
                            "top": $markdownContentElmEight / 2 - $loaderElmHeight, 
                            "display": "block",
                            "left": $loaderElmHeight
                        });
                            

                        // ajax load external content
                        $(this).load(config.srcFile, function (responseTxt, statusTxt,
                            xhr) {


                            $($markdownContentElm).css({
                                "background-color": "white"
                            });

                            // SUCCESS case
                            if (statusTxt == "success") {

                                // update loading state
                                $isLoaded = true;

                                // remove loader
                                $($loaderElm).remove();

                                // Panel resize
                                methods.PanelResize();

                                // insert $closePanelElm after .pre-content-title
                                $($closePanelElm).insertAfter(
                                    ".pre-content-title");

                                // Markdown-it
                                // work with .md file
                                var $md = window.markdownit();
                                var $markdown = $($markdownContentElm).html();
                                var $html = $md.render($markdown);
                                var $result = $html.replace(/XXXXXX/g, "<br />")
                                    .replace(
                                        /<p>¤<\/p>/g,
                                        "<p class='text-center'>¤<\/p>");

                                $($markdownContentElm).html($result);

                                // scroll to top calculate extra top position
                                methods.scrollTop();

                                // hide title
                                $('.pre-content-title').hide();

                                config.loadingError = true;

                            }

                            // ERROR case
                            if (statusTxt == "error") {

                                // Update loaded state
                                $isLoaded == false;

                                //alert("Error: " + xhr.status + ": " + xhr.statusText);

                                // remove loader and parent
                                //$("#loader").remove();
                                $($markdownContentElm).remove();
                                // create loader element
                                $errorElm = document.createElement('div');
                                $errorElm.setAttribute("id", "load-error-msg");
                                // construct error msg
                                $($errorElm).html("Error: " + xhr.status + ": " +
                                    xhr.statusText);
                                // show error msg
                                $($errorElm).css({
                                    "display": "block",
                                    "text-align": "center"
                                });

                                // append error element to content element                             
                                if (config.loadingError == false) {
                                    $($errorElm).appendTo("#pre-content-container");
                                    config.loadingError = true;
                                }

                                

                            }

                        }); // end .load()


                    });

                }

            } else {

                // already loaded
                // scroll to top calculate extra top position
                methods.scrollTop();

                $($markdownContentElm).css({
                    "background-color": "white"
                });

                // hide closePanel
                $("#closePanel").fadeIn("slow");
                // show content
                $("#pre-content-container").fadeIn("slow");
                // hide title
                $('.pre-content-title').hide();
                // Panel resize
                methods.PanelResize();


            } // end else

        }); // click

        // close element
        $($closePanelIconElm).click(function () {
            // scroll to top calculate extra top position

            $('.pre-content-title').fadeIn("fast");
            $('html, body').animate({
                scrollTop: $('.load').offset().top - 28
            }, config.scrollTopSpeed);
            $("#closePanel").fadeOut("fast");
            $("#pre-content-container").fadeOut("fast");
        });

    }); // end ready
})(jQuery);
