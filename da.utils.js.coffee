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

String::da_trim = ->
    a = @replace /^\s+/, ""
    a.replace /\s+$/, ""
