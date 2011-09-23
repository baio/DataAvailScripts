
$.widget 'ui.tree',

    jsTree : null

    options :
        baseUrl : null
        retrieveUrl : null
        retrieveParam : null
        updateUrl : null
        useDataTags : false

    _create: ->(

        el = $ this.element

        @options.retrieveUrl ?= el.attr "data-js-tree-retrieve-url"
        @options.updateUrl ?= el.attr "data-js-tree-update-url"
        if el.attr("data-js-tree-use-data-tags")?
            @options.useDataTags = true

        if @options.baseUrl
            @options.retrieveUrl = [@options.baseUrl, @options.retrieveUrl].da_joinUrls()
            @options.updateUrl = [@options.baseUrl, @options.updateUrl].da_joinUrls()

        r = /[&?].(.+)={parid}/

        m = r.exec @options.retrieveUrl

        that = @

        if m != null
            @options.retrieveParam = m[1]
            @options.retrieveUrl = @options.retrieveUrl.replace r, ""

        rparam = @options.retrieveParam

        el.jstree
            "plugins" : ["themes","json_data","ui","crrm","dnd","search","types","hotkeys","contextmenu","sort"]
            "json_data" :
                "ajax" :
                    "url" : @options.retrieveUrl
                    "success" :  (data) -> $.map data.d, (e) -> that._parseRetrieve(e)
                    "data" : (n) ->
                        "$filter" : "ParentId eq #{if n.attr then n.attr("id").replace("node_" , "") else "null"}"

        .bind "load_node.jstree", (obj, s_call, e_call) ->
            console.log "loaded"
        .bind "create.jstree", (e, data) ->
            that._updateTagNode "create_node", data, null, (r) -> $(data.rslt.obj).attr "id", "node_" + r.Id
        .bind "remove.jstree", (e, data) ->
    	    data.rslt.obj.each -> that._updateTagNode "remove_node", data, $(this).attr("id"), (r) ->
    	        data.inst.refresh()
        .bind "rename.jstree", (e, data) ->
            that._updateTagNode "rename_node", data
        .bind "move_node.jstree", (e, data) ->
            data.rslt.o.each (i) ->
                that._updateTagNode "move_node", data, $(this).attr("id"), (r) ->
                    $(data.rslt.oc).attr "id", "node_" + r.id
                    if data.rslt.cy and $(data.rslt.oc).children("UL").length
                        data.inst.refresh data.inst._get_parent data.rslt.oc
    )
    _parseRetrieve: (data) ->
        val =
            attr :
                id : "node_#{data.Id}"
                rel : if data.Children and data.Children.length > 0 then "folder" else "default"
            state : "closed"
            data : data.Name

        if @options.useDataTags
                val.attr["data-val"] = data.Id
                val.attr["data-label"] = data.Name

        #val.children = (@_parseRetrieve c, true for c in data.Children)

        val

    _updateTagNode: (oper, data, oid, success) ->
        id = if !oid then data.rslt.obj.attr("id") else oid
        parid = if data.rslt.cr and data.rslt.cr != -1 then data.rslt.cr.attr("id") else ""
        name = if data.rslt.new_name then data.rslt.new_name else data.rslt.name

        id = if id then id.replace "node_","" else "-1"
        if !parid and data.rslt.parent and data.rslt.parent != -1 then parid = data.rslt.parent.attr "id"
        parid = parid.replace "node_","" if parid

        OData.request

            requestUri: @options.updateUrl.replace("{id}",id).replace("{parid}",parid).replace("{oper}",oper).replace("{name}",name)

            method: "POST"

            (r) ->
                if !r
                    $.jstree.rollback data.rlbk
                else if success
                    success r