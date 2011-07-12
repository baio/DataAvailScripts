#http://raphaeljs.com/icons/
#dependencies da.icons.data.js
#dependencies http://github.com/DmitryBaranovskiy/raphael/raw/master/raphael-min.js

###
$.fn.extend

  settings =
     name : null



  icons: (method) ->

    methods = {
        init: (options) ->


            @.each ->

                if options
                    $.extend settings, options

                @.each ->
                    s = $.extend {}, settings

                    $t = $(@)

                    attr = $t.attr "data-icon"

                    if !attr
                        settings.name = attr

                    for (var name in icon) {
                                var r = Raphael(x + 36, y + 36, 40, 40),
                                    s = r.path(icon[name]).attr(stroke).translate(4, 4),
                                    Icon = r.path(icon[name]).attr(fill).translate(4, 4);
        }
        }

    if  methods[method]
        methods[ method ].apply this, Array.prototype.slice.call( arguments, 1)
    else if typeof method == 'object' || ! method
        methods.init.apply this, arguments
    else
        $.error "Method " +  method + " does not exist on jQuery.Icons"
###