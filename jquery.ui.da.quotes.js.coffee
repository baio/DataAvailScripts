#dependencies : da.utils.js, knockout.js, jQuery context menu plugin
#http://knockoutjs.com/
#http://abeautifulsite.net/blog/2008/09/jquery-context-menu-plugin/

$ = jQuery

$.fn.extend
  Quotation: (method) ->

    settings =
        "marker" : null

        "template" : "<div><input type='text'/><a href='#' data-quote-remover>remove</a></div>"

        "maxCount" : 5

    feq = (marker) ->
        window.da_feq(marker)

    methods = {
        init: (options) ->

            if options
                $.extend settings, options

            @.each ->
                s = $.extend {}, settings
                $this = $(@)

                attr = $this.attr "data-quote-source"
                if attr
                    s.marker = attr

                $tmpl = $("[data-quote-template]#{feq(s.marker)}")
                if $tmpl[0]
                    s.template = $tmpl.html()
                    $tmpl.remove()

                htmlMarker = s.marker ?= "default"

                #initialize context menu
                $menu = $("[data-quote-menu#{feq(s.marker)}]")
                menuId = $menu.id
                if !menuId
                    menuId = "id_quote_menu_#{htmlMarker}"
                    $menu.id = menuId

                $this.contextMenu  menu : menuId
                $("a:[href = '#quote']", $menu).attr "data-bind", "click: addQuote"#??

                #initialize quote template
                $("body").append "<script id='id_quote_template_#{htmlMarker} type='text/html'>#{s.template}</script>"#?

                #initialize destination area
                $dest = $("[data-quote-destination#{feq(s.marker)}]")
                $dest.attr "data-bind", "template: {name : 'quoteTemplate', foreach: quotes, afterAdd: afterAddQuote}'"#?

                #initialize scripts
                $("body").append "<script type='text/javascript'>
                function quote(text) {
                    return {
                        text: ko.observable(text),
                        remove: function () {
                            viewModel.quotes.remove(this);
                        }

                    };
                }

                var viewModel = {
                    quotes: ko.observableArray([]),
                    removeQuote: function (quote) {
                        this.quotes.remove(quote);
                    },
                    addQuote: function () {
                        this.quotes.push(new quote(document.selection));
                    }
                };

                ko.applyBindings(viewModel);

                function afterAddQuote(element) {
                    if (viewModel.quotes().length > 1) {
                        $(element).prependTo($(element.parentElement));
                    }
                }

            </script>"
        }

    if  methods[method]
        methods[ method ].apply this, Array.prototype.slice.call( arguments, 1)
    else if typeof method == 'object' || !method
        methods.init.apply this, arguments
    else
        $.error "Method " +  method + " does not exist on jQuery.TableHeaderSort"