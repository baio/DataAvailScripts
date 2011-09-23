$.widget 'ui.defValRef',

  _create: ->

    e = @element

    url ?= e.attr "data-def-val-ref-url"

    url = [@options.baseUrl, url].da_joinUrls()

    url = url.replace new RegExp("\\$val"), e.attr("data-def-val-ref-val")

    that = @

    $.ajax
        url : url
        data : {"$format" : "json"}
        success : (d) ->
            e.val that.options.onSuccess(d)