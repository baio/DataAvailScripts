
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

class itemSelectorPresenter

    settings = null

    constructor: (@settings)->

    click: ->
        src = @settings.url
        window.da_md_cr_prr =  s : @settings, d : null
        $.modal "<iframe src='#{src}' height='100%' width='100%' style='border:0'>",
                containerCss :

                    height:"90%"

                    width:"90%"

                    opacity:20

                overlayClose : true

                overlayCss: {backgroundColor: "blue"}

                onShow: (dialog) ->
                    window.da_md_cr_prr.d = @
                    dialog.data.find(">:first-child").load ->
                        $("table.item-selector-list > :not(thead) > tr", this.contentDocument).click (e, ui)->
                            wp = window.parent
                            $t = $ @
                            s = window.da_md_cr_prr.s
                            wp.$("#" + s.parentValFieldId).val $t.attr("data-val")
                            wp.$("#" + s.parentLabelFieldId).val $t.attr("data-label")
                            window.da_md_cr_prr.d.close()
                            window.da_md_cr_prr = null

$.fn.extend
  itemSelector: (method) ->

    settings =

        baseUrl : null

        url : null #data-url

        reqLabelName : null #data-req-label-name

        reqLabelValue : null #data-req-label-value

        parentValFieldId : null #data-parent-val-field-id

        parentLabelFieldId : null #data-parent-label-field-id

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
                    s.url = "#{s.url}?#{s.reqLabelName}=#{s.reqLabelValue}"

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