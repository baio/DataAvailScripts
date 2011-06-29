
###
    serverBaseUrl - will be appended to each serverUrl : serverBaseUrl + "/" + serverUrl

    attributes

    data-autocomplete-srv - server url for ajax request-response (in JSON) [serverUrl]
    data-autocomplete-format - format of server JSON response
        three fields separated by comma : value field name, display field name, [list field name = display field name if not defined].
        Initialize corresponded options : valueField, displayField, listField
    data-autocomplete-response-field
    data-autocomplete-for
    data-autocomplete-min-length
    data-autocomplete-multi

    OR options

    serverBaseUrl -
    serverUrl - data-autocomplete-srv
    forTarget - data-autocomplete-for
    data-autocomplete-format -
        valueField :
        displayField :
        listField :
    responseField - data-autocomplete-response-field
    data : - is / not func
    minLength : data-autocomplete-min-length
    multi : data-autocomplete-multi
###

class autoCompletePresenter

    forcedSearch = false

    $target = null

    $forTarget = null

    settings = null

    constructor: (@$target, @settings) ->
            if @settings.forTarget
                @$forTarget =  $ "#" + @settings.forTarget

            $target.autocomplete @getJQueryAutocompleteOptions()

            $target.focus =>
                if @$forTarget
                    @oldVal = @$forTarget.val()

            $target.change =>
                if $forTarget and @oldVal == @$forTarget.val()
                    #text changed but value not
                    @forcedSearch = true;
                    $target.autocomplete "search"


    getPresenter = (element)->
        $(element).data("autocomplete").presenter

    getRequestTerm: (rawTerm)->
        rawTerm

    getAjaxOptions: (request, response) ->
        s = @settings
        url: s.serverUrl.replace /\$term/gi, @getRequestTerm(request.term)
        dataType: "text json"
        data: if s.data then ( if $.isFunction s.data then s.data request.term else s.data ) else null
        success: (data) ->
            if data
               d = if s.responseField then eval("data.#{s.responseField}") else data
               items = $.map d, (item)->
                            id: eval "item.#{s.valueField}"
                            value: eval "item.#{s.displayField}"
                            label: eval "item.#{s.listField}"

               if @forcedSearch
                   @validateValFromList items
                   response null
               else
                   response items

               @forcedSearch = false

    getJQueryAutocompleteOptions: ->
        autoSelect: true
        selectFirst: true
        minLength: @settings.minLength
        select:  (event, ui) ->
            getPresenter(@).setAutocompleteVal ui.item.id
        source: (request, response) ->
            prr = getPresenter(@element);
            a = getPresenter(@element).getAjaxOptions(request, response)
            $.ajax a



    #Set value to the related id-value control (hidden input)
    setAutocompleteVal: (val) ->
        if @$forTarget
            @$forTarget.val val

    #Check if item exists in the list
    validateValFromList: (items) ->
        if !items
            si = @value == $target.val() for i in items
            if @$forTarget
                setAutocompleteVal si

#--multi

class multiAutoCompletePresenter extends autoCompletePresenter

     constructor: (@$target, @settings) ->

        super @$target, @settings

        $target.keydown (event) =>
            if event.keyCode == $.ui.keyCode.TAB and $target.data("autocomplete").menu?.active
              event.preventDefault()

     split = (val) ->
         val.split /,\s*/

     extractLast = (term) ->
         split(term).pop()

     getRequestTerm: (rawTerm)->
        extractLast rawTerm

     getJQueryAutocompleteOptions: ->
        sup = super()
        $.extend sup,
            search: ->
                term = extractLast @value
                if term.length < 1
                    false
            focus: ->
                false
            select: (event, ui) ->
                terms = split @value
                terms.pop()
                terms.push ui.item.value
                terms.push ""
                this.value = terms.join ", "
                false

     keydown: (event)->
         if event.keyCode == $.ui.keyCode.TAB and $target.data("autocomplete").menu?.active
           event.preventDefault()

$.fn.extend

  autoComplete: (method) ->

    settings =
        serverBaseUrl : null
        serverUrl : null
        forTarget: null
        valueField : null
        displayField : null
        listField : null
        responseField : null
        data : null
        minLength : 2
        multi : false
    methods = {
        init: (options) ->

            if options
                $.extend settings, options

            @.each ->

                s = $.extend {}, settings

                $t = $ @

                attr = $t.attr "data-autocomplete-srv"

                if attr
                    s.serverUrl = attr

                if !s.serverUrl
                    throw "autocomplete.serverUrl must be defined"

                attr = $t.attr "data-autocomplete-response-field"

                if attr
                    s.responseField = attr

                attr = $t.attr "data-autocomplete-for"

                if attr
                    s.forTarget = attr

                attr = $t.attr "data-autocomplete-min-length"

                if attr
                    s.minLength = attr

                attr = $t.attr "data-autocomplete-multi"

                if attr
                    s.multi = attr == "true"

                attr = $t.attr "data-autocomplete-format"

                if attr
                    format = attr.split ","
                    if format[0]
                        s.valueField = format[0]

                    if format[1]
                        s.displayField = format[1]

                    if format[2]
                        s.listField = format[2]

                if !s.valueField
                    throw "autocomplete.valueField must be defined"

                s.serverUrl = [s.serverBaseUrl, s.serverUrl].da_joinUrls();
                    
                if !s.displayField
                    s.displayField = s.valueField

                if !s.listField
                    s.listField = s.displayField

                data = $t.data "autocomplete"

                prr = if !s.multi then new autoCompletePresenter($t, s) else new multiAutoCompletePresenter($t, s)

                if !data
                   $t.data "autocomplete", {target: $t, presenter : prr}
        }

    if  methods[method]
        methods[ method ].apply this, Array.prototype.slice.call( arguments, 1)
    else if typeof method == 'object' || ! method
        methods.init.apply this, arguments
    else
        $.error "Method #{method} does not exist on autocomplete"






