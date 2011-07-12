
class TableToolboxPresenter


    constructor: (@settings)->

        settings.addItemButton.click ->
            alert "addItem"

        settings.searchButton.click =>
            alert @settings.searchVal() + " : " + @settings.orderByVal()

        settings.resetButton.click =>
            alert "reset"



$.fn.extend

  tableToolbox: (method) ->

        settings =

            addItemButton : null

            searchButton : null

            resetButton : null

            searchVal : null

            orderByVal : null

        methods = {
            init: (options) ->

                if options
                    $.extend settings, options

                @.each ->
                    s = $.extend {}, settings

                    $t = $(@)

                    if !s.addItemButton
                        s.addItemButton = $ ".add-item-button", @

                    if !s.searchButton
                        s.searchButton = $ ".search-button", @

                    if !s.resetButton
                        s.resetButton = $ ".reset-button", @

                    if !s.searchVal
                        s.searchVal = =>
                            $("input.search-input, .search-input input", @).val()

                    if !s.orderByVal
                        s.orderByVal = =>
                            $("select.sort-input, .sort-input select", this).val()


                    data = $t.data "TableToolbox"

                    if !data

                        prr = new TableToolboxPresenter s

                        $t.data "TableToolbox", prr

            destroy: ->
                @.each ->
                     $t = $(@)
                     data = $t.data "TableToolbox"
                     #$t.unbind ".TableToolbox"
                     $t.removeData "TableToolbox"
            }

        if  methods[method]
            methods[ method ].apply this, Array.prototype.slice.call( arguments, 1)
        else if typeof method == 'object' || ! method
            methods.init.apply this, arguments
        else
            $.error "Method " +  method + " does not exist on jQuery.TableToolbox"

