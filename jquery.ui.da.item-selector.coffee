
###
    dependencies http://www.ericmmartin.com/projects/simplemodal/

    baseUrl/url?reqLableName=reqLabelField

    server must return web-page by url with table from where selection could be done
    table from server should mark all rows with data-val and label-val attributes
    data-val - PK of list items, label-val - value of field defined in labelField request parameter
    parentValField, parentLabelField - the ids of element of the parent page to set selected values (from data-val & label-val of selected row)

    client link is clicked -> request to the server url?anyParamNameRecognizedByServer=$label ($label is replaced with labelField)->
    server returns page with table where all rows contain data-val, data-label attributes with values initialized by their PK and label (label field name (labelField) from the request)->
    page is shown im modal window -> row of table is clicked -> the values of fields with ids parentValFieldId and parentLabelFieldId of the parent page are initialized
    by values from data-val, data-label attributes correspondengly of clicked row->child window is closed

    child table from where select could by doing must be marked with  id="item-selector-list"
###
$ = jQuery

class itemSelectorPresenter

    settings = null

    dlg = null

    widget = null

    wnd = null

    constructor: (@settings)->

    click: ->
        src = @settings.url
        window.itemSelector = @

        @dlg = null

        @wnd = window

        if window.parent != window.self
               $jParent = window.parent.jQuery.noConflict();
               @dlg = $jParent("<iframe src='#{src}'></iframe>");
               $ = jQuery
            else
               @dlg = $("<iframe src='#{src}'></iframe>");

        that = @

        @dlg.dialog
            modal : true
            autoOpen : true
            width : 900
            height : 700
            open : ->
                $(@).css "width" , "100%"
                $(@).load ->
                    that.rebind()
    rebind: ->
        that = @
        d = @dlg
        
        $("[data-val][data-label]", d[0].contentDocument).unbind ".item-selector"
        $("[data-val][data-label] > .row_opers", d[0].contentDocument).unbind ".item-selector"

        $("[data-val][data-label] > .row_opers", d[0].contentDocument).bind "click.item-selector", (e, ui)->
            e.stopPropagation()
        $("[data-val][data-label]", d[0].contentDocument).bind "dblclick.item-selector", (e, ui)->
            e.stopPropagation()
            val = $(@).attr "data-val"
            label = $(@).attr "data-label"
            con = true

            window.parent.$ = window.parent.jQuery

            if that.settings.onSelected
                con = !(that.settings.onSelected(that, val, label) == false)

            if con
                that.wnd.$("[id='#{that.settings.parentValFieldId}']").val val
                that.wnd.$("[id='#{that.settings.parentLabelFieldId}']").val label

            setTimeout ->
                    d.dialog "close"
                    that.wnd.itemSelector = null
                , 10

$.fn.extend
  itemSelector: (method) ->

    settings =

        baseUrl : null

        url : null #data-url

        reqLabelName : null #data-req-label-name

        reqLabelValue : null #data-req-label-value

        parentValFieldId : null #data-parent-val-field-id

        parentLabelFieldId : null #data-parent-label-field-id

        onSelected : null

    methods = {
        init: (options) ->

            if options
                $.extend settings, options

            @.each ->
                s = $.extend {}, settings

                $t = $(@)

                attr = $t.attr "data-url"

                if attr
                    s.url = attr

                attr = $t.attr "data-req-label-name"

                if attr
                    s.reqLabelName = attr

                attr = $t.attr "data-req-label-value"

                if attr
                    s.reqLabelValue = attr

                attr = $t.attr "data-parent-val-field-id"

                if attr
                    s.parentValFieldId = attr

                attr = $t.attr "data-parent-label-field-id"

                if attr
                    s.parentLabelFieldId = attr

                s.url = [s.baseUrl, s.url].da_joinUrls()

                if !s.url
                    throw "url must be defined"

                if s.reqLabelName and s.reqLabelValue
                    s.url = s.url.da_joinUrlParam "#{s.reqLabelName}=#{s.reqLabelValue}"#"#{s.url}?#{s.reqLabelName}=#{s.reqLabelValue}"

                $t.bind "click.ItemSelector", methods.click

                $t.data "ItemSelector", presenter : new itemSelectorPresenter(s)

        destroy: ->
            @.each ->
                 $this = $(@)
                 data = $this.data "ItemSelector"
                 $this.unbind ".ItemSelector"
                 data.ItemSelector.remove()
                 $this.removeData "ItemSelector"

        click: (event)->
            event.preventDefault()
            $(@).data("ItemSelector").presenter.click()
            false

        }

    if  methods[method]
        methods[ method ].apply this, Array.prototype.slice.call( arguments, 1)
    else if typeof method == 'object' || ! method
        methods.init.apply this, arguments
    else
        $.error "Method " +  method + " does not exist on jQuery.SortList"