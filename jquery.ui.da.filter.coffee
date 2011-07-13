#dependencies: da.utils
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

#controls considered to work in 2 modes - first like a button to which search controls are linked through the marker attribute and second as search control itself

class FilterPresenter

    settings : null

    inputs : null

    constructor: (@settings, @inputs) ->

    click: ->

        f = @getFilter()

        if @settings.beforeCallbackUrl
            f.filer = @settings.beforeCallbackUrl f.filter

        window.location =  "#{@settings.callbackUrl}?$filter=#{f.filter}&filter_val=#{f.filterLabel}"

    getFilter: ->

            valExpr = (expr, val)->
                if !expr then return val
                if expr.indexOf("$val") != -1
                    if !val then return ""
                    if val.match /^[0-9a-zA-Zа-яА-Я]+$/ then return expr.replace /\$val/gi, val
                    return val
                null

            getFilterVal = (name, val)->
                if name and val then name+":"+val else val

            format = (target, name, val, expr) ->
                 expr = expr.call(target) if $.isFunction expr
                 val = val.call(target) if $.isFunction val
                 expr = expr.replace(/@/gi, name) if name
                 v = valExpr expr, val
                 if v != null
                    v = v.replace(/@/gi, name) if name
                    return  fv : v, v : getFilterVal name, val
                 fv : expr, v : getFilterVal(name, if !expr or expr.indexOf("$") == 0 then null else expr)

            r = (format i.target, i.name, i.value, i.expression for i in @inputs)

            filter = ($.grep (i.fv for i in r), (p) -> p).join " and "

            filterVals = ($.grep (i.v for i in r), (p) -> p).join()

            filter = filter.da_trim("or").da_trim("and")

            return {filter : filter, filterLabels : filterVals }

$.fn.extend

  filter: (method) ->

    inputSettings =

        marker : null

        name : null

        expression : null

        value : null

        target : null

    settings =

        marker : null

        callbackUrl : null

        beforeCallbackUrl : null

    methods = {
        init: (options) ->

            if options
                $.extend settings, options

            @.each ->
                s = $.extend {}, settings

                $t = $(@)

                attr = $t.attr "data-filter"

                if attr
                    s.marker = attr

                attr = $t.attr "data-filter-callback-url"

                if attr
                    s.callbackUrl = attr

                s.callbackUrl ?= window.location.pathname

                ###
                if !s.marker
                    throw "marker must be defined"
                ###

                data = $t.data "FilterPost"

                if s.marker
                    $t.bind "click.FilterPost", methods.click

                if !data
                   $t.data "FilterPost", {target : $t, presenter : new FilterPresenter(s, if s.marker then methods.inputs(s.marker) else [ @ ])}

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


        getFilter: ()->
             data = $(@).data "FilterPost"
             data.presenter.getFilter()

        inputs: (marker) ->
            format = ($this, settings) ->

                    s = $.extend {}, settings

                    attr = $this.attr "data-filter-input"

                    if attr
                        s.marker = attr

                    attr = $this.attr "data-filter-name"

                    if attr
                        s.name = attr

                    attr = $this.attr "data-filter-expression"

                    if attr
                        s.expression = attr

                    if !s.expression
                        s.expression = $this.val

                    if !s.value
                        s.value = $this.val

                    s.target = $this

                    s

            format $(e), inputSettings for e in $("[data-filter-input#{if marker then "=" + marker else ""}]")

        }

    if  methods[method]
        methods[ method ].apply this, Array.prototype.slice.call( arguments, 1)
    else if typeof method == 'object' || ! method
        methods.init.apply this, arguments
    else
        $.error "Method " +  method + " does not exist on jQuery.TableHeaderSort"