$.fn.datePicker = ->
    return this.each ->
        if $(@).attr("readonly") != true
            $(@).datepicker()
