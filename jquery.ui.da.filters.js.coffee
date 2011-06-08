#dependencies: da.utils

$ = jQuery

class FilterPostPresenter

    settings : null

    inputs : null

    constructor: (@settings, @inputs) ->

    click: ->
        valExpr = (target, expr, val)->
            if expr.indexOf("$val") != -1
                if !val then return ""
                if val.match /^[0-9a-zA-Z]+$/ then return expr.replace "$val", val
                return val
            null

        #if expression contains $val (if expression contains $value it should be full qualified expression)
        #and expression must meet [a-zA-Z0-9]
            #replace $value with value or value() if function
        #else
            #if expression is function get value of it
            #if Name != null
                #if not contains @ and not contains Name - append @ to start
            #if not started with [ and | or ] insert [ and ]
            #replace @->name
            #glue all with and
            #remove first and | or
        format = (target, name, val, expr) ->
             val = val.call(target) if window.da_isFunc val
             v = valExpr target, expr, val
             if v != null
                return  fv : v, v : val

             expr = expr.call(target) if window.da_isFunc expr
             if name
                expr = "@ " + expr if expr.indexOf("@") == -1 && (" " + expr).indexOf(" #{name} ") == -1
                expr = expr.replace "@", name
             fv : expr, v : if expr.indexOf("$") == 0 then null else expr

        r = (format i.target, i.name, i.value, i.expression for i in @inputs)

        filter = (i.fv for i in r).join " and "

        filterVals = (i.v for i in r).join ","

        filter = filter.da_trim("or").da_trim("and")

        window.location =  "#{@settings.callbackUrl}?$filter=#{filter}&filter_val=#{filterVals}"

$.fn.extend
  FilterPost: (method) ->

    inputSettings =
        "marker" : null

        "name" : null

        "expression" : null

        "value" : null

        "target" : null


    settings =
        "marker" : null

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

                if !s.marker
                    throw "marker must be defined"

                if !s.callbackUrl
                    throw "callbackUrl must be defined"

                data = $this.data "FilterPost"

                $this.bind "click.FilterPost", methods.click

                if !data
                   $this.data "FilterPost", {target: $this, presenter : new FilterPostPresenter s, methods.inputs(s.marker)}

        destroy: ->
            @.each ->
                 $this = $(@)
                 data = $this.data "FilterPost"
                 $this.unbind ".FilterPost"
                 data.TableHeaderSort.remove()
                 $this.removeData "FilterPost"

        click: ->
            data = $(@).data "FilterPost"
            data.presenter.click()

        inputs: (marker) ->
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

                    ###
                    if !s.name
                        throw "input name must be defined"
                    ###

                    if !s.expression
                        s.expression = $this.val

                    if !s.value
                        s.value = $this.val

                    s.target = $this

                    s

            s = $.extend {}, inputSettings

            format $(e), s for e in $("[data-filter-input#{if marker then "=" + marker else ""}]")

        }

    if  methods[method]
        methods[ method ].apply this, Array.prototype.slice.call( arguments, 1)
    else if typeof method == 'object' || ! method
        methods.init.apply this, arguments
    else
        $.error "Method " +  method + " does not exist on jQuery.TableHeaderSort"