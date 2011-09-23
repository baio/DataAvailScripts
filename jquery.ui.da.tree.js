(function() {
  $.widget('ui.tree', {
    jsTree: null,
    options: {
      baseUrl: null,
      retrieveUrl: null,
      retrieveParam: null,
      updateUrl: null,
      useDataTags: false
    },
    _create: function() {
      var el, m, r, rparam, that, _base, _base2, _ref, _ref2;
      el = $(this.element);
      (_ref = (_base = this.options).retrieveUrl) != null ? _ref : _base.retrieveUrl = el.attr("data-js-tree-retrieve-url");
      (_ref2 = (_base2 = this.options).updateUrl) != null ? _ref2 : _base2.updateUrl = el.attr("data-js-tree-update-url");
      if (el.attr("data-js-tree-use-data-tags") != null) {
        this.options.useDataTags = true;
      }
      if (this.options.baseUrl) {
        this.options.retrieveUrl = [this.options.baseUrl, this.options.retrieveUrl].da_joinUrls();
        this.options.updateUrl = [this.options.baseUrl, this.options.updateUrl].da_joinUrls();
      }
      r = /[&?].(.+)={parid}/;
      m = r.exec(this.options.retrieveUrl);
      that = this;
      if (m !== null) {
        this.options.retrieveParam = m[1];
        this.options.retrieveUrl = this.options.retrieveUrl.replace(r, "");
      }
      rparam = this.options.retrieveParam;
      return el.jstree({
        "plugins": ["themes", "json_data", "ui", "crrm", "dnd", "search", "types", "hotkeys", "contextmenu", "sort"],
        "json_data": {
          "ajax": {
            "url": this.options.retrieveUrl,
            "success": function(data) {
              return $.map(data.d, function(e) {
                return that._parseRetrieve(e);
              });
            },
            "data": function(n) {
              return {
                "$filter": "ParentId eq " + (n.attr ? n.attr("id").replace("node_", "") : "null")
              };
            }
          }
        }
      }).bind("load_node.jstree", function(obj, s_call, e_call) {
        return console.log("loaded");
      }).bind("create.jstree", function(e, data) {
        return that._updateTagNode("create_node", data, null, function(r) {
          return $(data.rslt.obj).attr("id", "node_" + r.Id);
        });
      }).bind("remove.jstree", function(e, data) {
        return data.rslt.obj.each(function() {
          return that._updateTagNode("remove_node", data, $(this).attr("id"), function(r) {
            return data.inst.refresh();
          });
        });
      }).bind("rename.jstree", function(e, data) {
        return that._updateTagNode("rename_node", data);
      }).bind("move_node.jstree", function(e, data) {
        return data.rslt.o.each(function(i) {
          return that._updateTagNode("move_node", data, $(this).attr("id"), function(r) {
            $(data.rslt.oc).attr("id", "node_" + r.id);
            if (data.rslt.cy && $(data.rslt.oc).children("UL").length) {
              return data.inst.refresh(data.inst._get_parent(data.rslt.oc));
            }
          });
        });
      });
    },
    _parseRetrieve: function(data) {
      var val;
      val = {
        attr: {
          id: "node_" + data.Id,
          rel: data.Children && data.Children.length > 0 ? "folder" : "default"
        },
        state: "closed",
        data: data.Name
      };
      if (this.options.useDataTags) {
        val.attr["data-val"] = data.Id;
        val.attr["data-label"] = data.Name;
      }
      return val;
    },
    _updateTagNode: function(oper, data, oid, success) {
      var id, name, parid;
      id = !oid ? data.rslt.obj.attr("id") : oid;
      parid = data.rslt.cr && data.rslt.cr !== -1 ? data.rslt.cr.attr("id") : "";
      name = data.rslt.new_name ? data.rslt.new_name : data.rslt.name;
      id = id ? id.replace("node_", "") : "-1";
      if (!parid && data.rslt.parent && data.rslt.parent !== -1) {
        parid = data.rslt.parent.attr("id");
      }
      if (parid) {
        parid = parid.replace("node_", "");
      }
      return OData.request({
        requestUri: this.options.updateUrl.replace("{id}", id).replace("{parid}", parid).replace("{oper}", oper).replace("{name}", name),
        method: "POST"
      }, function(r) {
        if (!r) {
          return $.jstree.rollback(data.rlbk);
        } else if (success) {
          return success(r);
        }
      });
    }
  });
}).call(this);
