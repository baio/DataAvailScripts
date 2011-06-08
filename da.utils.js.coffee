String::da_trim = ->
    a = @replace /^\s+/, ""
    a.replace /\s+$/, ""

##shii can't extend Object jQuery begins throw exceptions WTF?!
da_isFunc = (x)->
    typeof(x) == "function"

window.da_isFunc = da_isFunc

