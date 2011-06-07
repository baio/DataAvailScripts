String::trim = ->
    a = @replace /^\s+/, ""
    a.replace /\s+$/, ""

Object::isFunc = ->
    typeof(@) == "function"