#dependencies: da.utils

$ = jQuery

class FilterPostPresenter

    settings : null

    inputs : null

    constructor: (@settings, @inputs) ->

    click: ->
        #if expression is function get value of it
        #if not contains @ append @ to start
        #if not started with [ and | or ] insert [ and ]
        #replace @->name
        #glue all with and
        #remove first and | or
        format = (name, expr) ->
             expr = expr() if expr.isFunc()
             expr = "@ " + expr if expr.indexOf("@") == -1
             expr = expr.replace "@", name

        filter = (format i.name, i.expression for i in @inputs)
            .join(" and ")

        filter = filter.trim("or").trim("and")

        window.location =  @settings.callbackUrl + "?$filter=" + filter

$.fn.extend
  FilterPost: (method) ->

    inputSettings =
        "marker" : null

        "name" : null,

        "expression" : null

    settings =
        "marker" : null,

        "callbackUrl" : null

    methods = {
        init: (options) ->

            if options
                $.extend settings, options

            @.each ->
                s = $.extend {}, settings

                $this = $(@)

                attr = $this.attr "data-filter-post"

                if attr
                    s.marker = attr

                attr = $this.attr "data-filter-callback-url"

                if attr
                    s.callbackUrl = attr

                #if !s.marker
                #    throw "marker must be defined"

                if !s.callbackUrl
                    throw "callbackUrl must be defined"

                data = $this.data "FilterPost"

                $this.bind "click.FilterPost", methods.click

                if !data
                   $this.data "FilterPost", {target: $this, presenter : new FilterPostPresenter s, methods.inputs()}

        destroy: ->
            @.each ->
                 $this = $(@)
                 data = $this.data "FilterPost"
                 $this.unbind ".FilterPost"
                 data.TableHeaderSort.remove()
                 $this.removeData "FilterPost"

        click: ->
            $(@).data("FilterPost").presenter.click()

        inputs: ->
            format = ($this, s) ->

                    attr = $this.attr "data-filter-input"

                    if attr
                        s.marker = attr

                    attr = $this.attr "data-filter-name"

                    if attr
                        s.name = attr

                    attr = $this.attr "data-filter-expression"

                    if attr
                        s.expression = attr

                    if !s.name
                        throw "input name must be defined"

                    if !s.expression
                        s.expression = $this.val
                    s

            s = $.extend {}, inputSettings

            format $(e), s for e in $("[data-filter-input#{if settings.marker then "=" + settings.marker else ""}]")

        }

    if  methods[method]
        methods[ method ].apply this, Array.prototype.slice.call( arguments, 1)
    else if typeof method == 'object' || ! method
        methods.init.apply this, arguments
    else
        $.error "Method " +  method + " does not exist on jQuery.TableHeaderSort"