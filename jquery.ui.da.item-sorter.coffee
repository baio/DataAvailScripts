#jQuery plugin example implemented with coffeescript
#http://stackoverflow.com/questions/4533848/writing-a-jquery-plugin-in-coffeescript-how-to-get-function-and-jquery
#https://gist.github.com/909017

#js plugins boilerplates -
#http://docs.jquery.com/Plugins/Authoring
#and http://stefangabos.ro/jquery/jquery-plugin-boilerplate/

$ = jQuery

class TableHeaderSortPresenter

    settings = null

    constructor: (@settings) ->

    click: ->

        sortOrder = ""
        sortName = @settings.columnName

        switch @settings.sortOrder
            when "asc" then sortOrder = "desc"
            when "desc" then sortName = "$reset"
            else sortOrder = "asc"

        window.location = "#{@settings.callbackUrl}?$orderby=#{sortName}  #{sortOrder}"

###
arguments could be passed through options or attributes:
data-table-header-sort-name and data-table-header-sort-order
###
$.fn.extend
  TableHeaderSort: (method) ->

    settings = {
        'callbackUrl' : null,

        'columnName' : null,

        'sortOrder' : "none", # none - not sorted, asc - order by ascend, desc - order by descend

        'delay' : 3000
    }

    methods = {
        init: (options) ->

            if options
                $.extend settings, options

            @.each ->
                s = $.extend {}, settings

                $this = $(@)

                attr = $this.attr "data-table-header-sort-callback-url"

                if attr
                    s.callbackUrl = attr

                attr = $this.attr "data-table-header-sort-name"
                
                if attr
                    s.columnName = attr

                attr = $this.attr "data-table-header-sort-order"

                if attr
                    s.sortOrder = attr

                if !s.callbackUrl
                    throw "callbackUrl must be defined"
                if !s.columnName
                    throw "columnName must be defined"
                if !s.sortOrder
                    throw "sortOrder must be defined"

                switch s.sortOrder
                    when "asc" then $this.text $this.text() + " [asc]"
                    when "desc" then $this.text $this.text() + " [desc]"
                    when "none" then
                    else throw "argument sortOrder must be asc, desc or none"

                data = $this.data "TableHeaderSort"

                #bind events here
                $this.bind "click.TableHeaderSort", methods.click

                if !data
                   $this.data "TableHeaderSort", {target: $this, presenter : new TableHeaderSortPresenter s}

                                       
        destroy: ->
            @.each ->

                 $this = $(@)
                 data = $this.data "TableHeaderSort"

                 #unbind events
                 $this.unbind ".TableHeaderSort"
                 #remove referenced data
                 data.TableHeaderSort.remove()
                 $this.removeData "TableHeaderSort"

        click: ->
            $(@).data("TableHeaderSort").presenter.click()
        }

    if  methods[method]
        methods[ method ].apply this, Array.prototype.slice.call( arguments, 1)
    else if typeof method == 'object' || ! method
        methods.init.apply this, arguments
    else
        $.error "Method " +  method + " does not exist on jQuery.TableHeaderSort"