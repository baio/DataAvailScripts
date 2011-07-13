#The usual caveats about CoffeeScript apply — your inline scripts
#will run within a closure wrapper, so if you want to expose global variables or functions,
#attach them to the window object

#return null if null empty, =val otherwise
da_feq = (val) ->
    da_finn val, (x) -> "=#{x}"

window.da_feq = da_feq

#return null if val undefined, func(val) otherwise
da_finn = (val, func) ->
    val = if val then func(val) else null

window.da_finn = da_finn

da_selection = ->
  txt = ""
  if window.getSelection
    txt = window.getSelection()
  else if document.getSelection
    txt = document.getSelection()
  else if document.selection
    txt = document.selection.createRange().text

  txt.toString()

window.da_selection = da_selection

String::da_trim = (str, start)->

    str ?= "\s"

    a = @

    if (start == true || not start?)
        r = new RegExp "^#{str}+"
        a = a.replace r, ""

    if (start == false || not start?)
        r = new RegExp "#{str}+$"
        a = a.replace r, ""
    
    a.toString();

Array::da_joinUrls = (joiner)->
    da_join '/'
###
    s = @[0]?.da_trim '/', false
    for i in @.slice 1
        if i then s += '/' + i.da_trim '/', true

    s
###

Array::da_join = (joiner)->

    s = @[0]?.da_trim joiner, false
    for i in @.slice 1
        if i then s += joiner + i.da_trim joiner, true

    s
