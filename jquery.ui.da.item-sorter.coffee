#jQuery plugin example implemented with coffeescript
#http://stackoverflow.com/questions/4533848/writing-a-jquery-plugin-in-coffeescript-how-to-get-function-and-jquery
#https://gist.github.com/909017

#js plugins boilerplates -
#http://docs.jquery.com/Plugins/Authoring
#and http://stefangabos.ro/jquery/jquery-plugin-boilerplate/

class ItemSorterPresenter

    settings = null

    constructor: (@settings) ->

    click: ->

        order = ""
        path = @settings.path

        switch @settings.order
            when "asc" then order = "desc"
            when "desc" then path = "$reset"
            else order = "asc"

        window.location = "#{@settings.url}?$orderby=#{path}  #{order}"

###
arguments could be passed through options or attributes:
data-table-header-sort-name and data-table-header-sort-order
###
$.fn.extend
  itemSorter: (method) ->

    settings =
        'url' : null

        'path' : null

        'order' : "none" # none - not sorted, asc - order by ascend, desc - order by descend

        'delay' : 3000

    methods = {
        init: (options) ->

            if options
                $.extend settings, options

            @.each ->
                s = $.extend {}, settings

                $this = $(@)

                attr = $this.attr "data-item-sorter-url"

                if attr
                    s.url = attr

                s.url ?= window.location.pathname
 
                attr = $this.attr "data-item-sorter-path"
                
                if attr
                    s.path = attr

                attr = $this.attr "data-item-sorter-order"

                if attr
                    s.order = attr

                if !s.url
                    throw "itemSorter.url must be defined"
                if !s.path
                    throw "itemSorter.path must be defined"
                if !s.order
                    throw "itemSorter.order must be defined"

                ###
                switch s.sortOrder
                    when "asc" then $this.text $this.text() + " [asc]"
                    when "desc" then $this.text $this.text() + " [desc]"
                    when "none" then
                    else throw "argument sortOrder must be asc, desc or none"
                ###

                data = $this.data "ItemSorter"

                #bind events here
                $this.bind "click.ItemSorter", methods.click

                if !data
                   $this.data "ItemSorter", {target: $this, presenter : new ItemSorterPresenter s}

                                       
        destroy: ->
            @.each ->

                 $this = $(@)
                 data = $this.data "ItemSorter"

                 #unbind events
                 $this.unbind ".ItemSorter"
                 #remove referenced data
                 data.TableHeaderSort.remove()
                 $this.removeData "ItemSorter"

        click: ->
            $(@).data("ItemSorter").presenter.click()
        }

    if  methods[method]
        methods[ method ].apply this, Array.prototype.slice.call( arguments, 1)
    else if typeof method == 'object' || ! method
        methods.init.apply this, arguments
    else
        $.error "Method " +  method + " does not exist on jQuery.ItemSorter"