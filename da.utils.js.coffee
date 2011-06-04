String::trim = ->
    a = @replace /^\s+/, ""
    a.replace /\s+$/, ""

Object::isFunc = ->
    @ is null or @ is undefined