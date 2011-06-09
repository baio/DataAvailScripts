#The usual caveats about CoffeeScript apply — your inline scripts
#will run within a closure wrapper, so if you want to expose global variables or functions,
#attach them to the window object.

#return null if null empty, =val otherwise
da_feq = (val) ->
    da_finn val, da_finn(val, (val) -> "=#{val}" )

window.da_feq = da_feq

#return null if null empty, func(val) otherwise
da_finn = (val, func) ->
    val = func val if val?

window.da_finn = da_finn

String::da_trim = ->
    a = @replace /^\s+/, ""
    a.replace /\s+$/, ""

##shii can't extend Object jQuery begins throw exceptions WTF?!
da_isFunc = (x)->
    typeof(x) == "function"

window.da_isFunc = da_isFunc
