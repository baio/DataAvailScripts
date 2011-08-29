###
plugin for tag-it widget.
could handle cases when tag is not just a string but item which following fields:
Key, Name, Value
Value - string which represents a text of the tag and which is shown in widget when user enter or select some item from the list.
Label - string which is shown in drop-down list of widget's autocomplete
Key - the key of the tag (usually number)
###

$.widget 'ui.tagitext',

    options :
        tagIt : null
        valueNode : null
        url : null
        filter : null


    _create: ->
        el = $(@element[0])
        @options.valueNode ?= el.attr "data-value-field"
        @options.valueNode = $(@options.valueNode) if typeof @options.valueNode == "string"
        @options.url ?= el.attr "data-url"
        @options.filter ?= el.attr "data-filter"
        el.tagit
            animate : false
            onTagAdded : @_onTagAdded
            onTagRemoved : @_onTagRemoved
            tagSource : @_tagSource
            ext : @

    _tagSource : (search, showChoices)->

        that = $(@element).data "tagit"
        ext = that.options.ext

        $.ajax
             url :        ext.options.url.replace /$term/, search.term
             dataType :   "json"
             data:        $filter : ext.options.filter.replace(/$term/, search.term) if ext.options.filter
             success:    (data) ->

                   choices = $.map data.d, (element)->
                       value : element.Name
                       label : element.Label
                       key : element.Id

                   that.options.availableTags = choices

                   showChoices ext._expellExistent choices, that.assignedTags()


    _onTagAdded: (event, tag) ->

        that = $(tag).data "tagit"
        ext = that.options.ext

        vn = ext.options.valueNode

        if (vn)
            value = $(":first", tag).text()
            item = $.grep ext._getItems(that.options.availableTags), (element)-> element.value == value
            key = if item.length > 0 then item[0].key else -1
            vn.val "#{if vn.val() then vn.val() + "," else ""}#{key}"

    _onTagRemoved: (event, tag) ->

        that = $(tag).data "tagit"
        ext = that.options.ext

        vn = ext.options.valueNode

        if (vn)
            val = $(":first", tag).text()
            values = $(this).val().split ','
            i = values.indexOf val
            keys = vn.val().split ','
            keys.splice i, 1
            vn.val keys.join ','

    _getItems: (array) ->
        $.map array, (element) ->
            key =  element.key
            key ?= -1
            val = element.value
            val ?= element.label
            label = element.label
            label ?= val
            value : val, label : label, key : key

    _expellExistent: (items, existent) ->
        $.grep items, (element) -> $.inArray existent,  element.value
