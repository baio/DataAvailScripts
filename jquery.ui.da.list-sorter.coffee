class ListSorterPresenter
    constructor: (@settings)->

    change: (val)->
        sortOrder = ""
        if (val && val != "$reset")
            sortName = val
            switch @settings.order
                when "asc" then sortOrder = "desc"
                when "desc" then sortName = "$reset"
                else sortOrder = "asc"
        else
            sortName = "$reset"

        window.location = "#{@settings.callbackUrl}?$orderby=#{sortName}  #{sortOrder}"

$.fn.extend
  listSorter: (method) ->

    settings =

        'callbackUrl' : null

        'order' : "none"

    methods = {
        init: (options) ->

            if options
                $.extend settings, options

            @.each ->
                s = $.extend {}, settings

                $this = $(@)

                attr = $this.attr "data-sort-callback"

                if attr
                    s.callbackUrl = attr

                s.callbackUrl ?= window.location.pathname

                attr = $this.attr "data-sort-order"

                if attr
                    s.order = attr

                data = $this.data "ListSorter"

                if !data
                   prr = new ListSorterPresenter s

                   $this.bind "change.ListSorter", methods.change

                   $this.data "ListSorter", {target: $this, presenter : prr}

        destroy: ->
            @.each ->
                 $this = $(@)
                 data = $this.data "ListSorter"
                 $this.unbind ".ListSorter"
                 #data.ListSorter.remove()
                 $this.removeData "ListSorter"

        change: ->
            $(@).data("ListSorter").presenter.change $(this).val()

        }

    if  methods[method]
        methods[ method ].apply this, Array.prototype.slice.call( arguments, 1)
    else if typeof method == 'object' || ! method
        methods.init.apply this, arguments
    else
        $.error "Method " +  method + " does not exist on jQuery.ListSorter"