#dependencies : knockout.js, jQuery context menu plugin
#http://knockoutjs.com/
#http://abeautifulsite.net/blog/2008/09/jquery-context-menu-plugin/

$ = jQuery

$.fn.extend
  Quotation: (method) ->

    settings =
        "marker" : "default"

        "template" : "<div><input type='text'/><a href='#' data-quote-remover>remove</a></div>"

        "maxCount" : 5

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

                $tmpl = $("[data-quote-template] = #{s.marker}")

                if $tmpl
                    s.template = $tmpl

                #initialize context menu
                menuId = $("[data-quote-menu]=#{s.marker}").id
                menuId = "id_quote_menu_#{s.marker}" ? !menuId
                $this.contextMenu
                    menu : $("[data-quote-menu]=#{s.marker}").id
                $this.contextMenu.child("a:[href] = '#quote'").append "data-bind='click: addQuote'"

                #initialize quote template
                document.scripts.add "<script id='id_quote_template_#{s.marker} type='text/html'>
                #{s.template.html}</script>"
                $template.remove #delete from dom

                #initialize destination area
                $dest = $("[data-quote-destination] = #{s.marker}")
                $dest.append "data-bind='template: {name : 'quoteTemplate', foreach: quotes, afterAdd: afterAddQuote}'"

                #initialize scripts
                document.scripts.add
                "<script type='text/javascript'>
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
                        //move last element to the top
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