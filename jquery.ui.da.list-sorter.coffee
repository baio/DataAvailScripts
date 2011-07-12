class ListSorterPresenter
    constructor: (@settings)->

    update: (val)->
        order = ""
        if (val && val != "$reset")
            path = val
            switch @settings.order
                when "asc" then order = "desc"
                when "desc" then path = "$reset"
                else order = "asc"
        else
            path = "$reset"

        window.location = "#{@settings.url}?$orderby=#{path}  #{order}"

$.fn.extend
  listSorter: (method) ->

    settings =

        url : null

        order : "none"

        autoUpdate : true

    methods = {
        init: (options) ->

            if options
                $.extend settings, options

            @.each ->
                s = $.extend {}, settings

                $t = $(@)

                attr = $t.attr "data-list-sorter-url"

                if attr
                    s.url = attr

                s.url ?= window.location.pathname

                attr = $t.attr "data-list-sorter-order"

                if attr
                    s.order = attr

                attr = $t.attr "data-list-auto-update"

                if attr
                    s.autoUpdate =  new Boolean attr

                data = $t.data "ListSorter"

                if !data

                    prr = new ListSorterPresenter s

                    if s.autoUpdate
                        $t.bind "change.ListSorter", methods.update

                    $t.data "ListSorter", {target: $t, presenter : prr}

        destroy: ->
            @.each ->
                 $this = $(@)
                 data = $this.data "ListSorter"
                 $this.unbind ".ListSorter"
                 #data.ListSorter.remove()
                 $this.removeData "ListSorter"

        update: ->
            $(@).data("ListSorter").presenter.update $(this).val()

        }

    if  methods[method]
        methods[ method ].apply this, Array.prototype.slice.call( arguments, 1)
    else if typeof method == 'object' || ! method
        methods.init.apply this, arguments
    else
        $.error "Method " +  method + " does not exist on jQuery.ListSorter"