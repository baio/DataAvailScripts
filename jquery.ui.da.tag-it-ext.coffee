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
        onTagAdded : null
        onCreateTagHtml : null


    _create: ->
        el = $(@element[0])

        @options.url ?= el.attr "data-url"
        @options.filter ?= el.attr "data-filter"

        keys = if  @options.valueNode then @options.valueNode.val().split ',' else []
        vals = el.val().split ','

        availableTags = $.map vals, (val, index) ->
            key : keys[index]
            value : vals[index]
            label : vals[index]

        @options.tagIt =
            el.tagit
                animate : false
                onTagAdded : @_onTagAdded
                onTagRemoved : @_onTagRemoved
                tagSource : @_tagSource
                ext : @
                allowNotInList : false
                availableTags : availableTags
                onCreateTagHtml : @options.onCreateTagHtml

        @options.valueNode ?= el.attr "data-value-field"
        @options.valueNode = $("#"+@options.valueNode) if typeof @options.valueNode == "string"



    _tagSource : (search, showChoices)->

        that = $(@element).data "tagit"
        ext = that.options.ext

        $.ajax
             url :       ext.options.url.replace /\$term/, search.term
             dataType :   "json"
             data:       if ext.options.filter then $filter : ext.options.filter.replace(/\$term/, search.term) else null
             success:    (data) ->

                   choices = $.map data.d, (element)->
                       value : element.Label
                       label : element.Label
                       key : element.Id

                   that.options.availableTags = choices

                   showChoices ext._expellExistent choices, that.assignedTags()


    _onTagAdded: (event, tag) ->

        that = $(tag).data "tagit"
        ext = that.options.ext

        vn = ext.options.valueNode

        value = $(":first", tag).text()

        if ext.options.creating
            key = ext.options.creating.key
            label = ext.options.creating.label
        else
            item = $.grep ext._getItems(that.options.availableTags), (element)-> element.value == value
            key = if item.length > 0 then item[0].key else -1
            label = if item.length > 0 then item[0].label else null

        if (vn)
             vn.val "#{if vn.val() then vn.val() + "," else ""}#{key}"

        ext._trigger "onTagAdded", null, {tag : tag, item : {key : key, value : value, label : label}}

    _onTagRemoved: (event, tag) ->

        that = $(tag).data "tagit"
        ext = that.options.ext

        vn = ext.options.valueNode

        if vn
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
        $.grep items, (element) -> $.inArray(element.value, existent) == -1


    createTag: (key, value, label) ->
        @options.creating = { key : key, value : value, label : label }
        @options.tagIt.tagit "createTag", value
        @options.creating = null
