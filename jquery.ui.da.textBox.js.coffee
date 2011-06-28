$ = jQuery

class TextBoxCounterPresenter

    settings = null

    #counter - counter panel - div where information is displayed
    $counter = null

    $target = null

    constructor: (@$target, @settings) ->

        # handle target events
        #@$counter = @createPanel()

        $target.keydown =>
            @updateCounter()

        $target.keyup =>
            @updateCounter()

        $target.focusin =>
            if !@$counter
                @createPanel()
                @$target.focus()
            @checkCaretPos()
            @showCounter()

        $target.focusout =>
             if @$counter
                @hideCounter()

    createPanel: ->

            @$counter = $ "<label />",  for : @$target.attr("id"),  class : " da-counter-label"

            @$counter.insertBefore @$target

            @updatePanelPos()

            @$counter.hide()

    updatePanelPos: ->
            @$counter.position
                  of: @$target
                  my: "left top"
                  at: "right bottom"
                  offset: "-200 0"
                  collision: "none none"

    len: ->
        @$target.val().length

    showCounter: ->
        @updateCounter()
        @$counter.show()

    hideCounter: ->
        @$counter.hide();

    checkCaretPos: ->
        if (!@$target.val().trim())
            @$target.text ""

    updateCounter: ->
            maxLen = @settings.maxLen
            l = @len()
            r = maxLen - l
            if maxLen
                @$counter.removeClass "da-counter-label-err"
                @$counter.removeClass "da-counter-label-warn"
                if r < 0
                    @$counter.addClass "da-counter-label-err"
                else if r < maxLen / 4
                    @$counter.addClass "da-counter-label-warn"
            @$counter.text if maxLen then "осталось #{r} из #{maxLen}" else l

$.fn.extend

  textBox: (method) ->

    settings =
        maxLen : 0

    methods = {
        init: (options) ->

            if options
                $.extend settings, options

            @.each ->
                s = $.extend {}, settings

                $t = $ @
                
                attr = $t.attr "data-val-length-max"

                if attr
                    s.maxLen = attr

                data = $t.data "TextBox"

                if !data
                   $t.data "TextBox", {target: $t, presenter : new TextBoxCounterPresenter $t, s}
        }

    if  methods[method]
        methods[ method ].apply this, Array.prototype.slice.call( arguments, 1)
    else if typeof method == 'object' || ! method
        methods.init.apply this, arguments
    else
        $.error "Method #{method} does not exist on jQuery.TableHeaderSort"


