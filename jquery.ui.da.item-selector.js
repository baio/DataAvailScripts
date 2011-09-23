(function() {
  /*
      dependencies http://www.ericmmartin.com/projects/simplemodal/

      baseUrl/url?reqLableName=reqLabelField

      server must return web-page by url with table from where selection could be done
      table from server should mark all rows with data-val and label-val attributes
      data-val - PK of list items, label-val - value of field defined in labelField request parameter
      parentValField, parentLabelField - the ids of element of the parent page to set selected values (from data-val & label-val of selected row)

      client link is clicked -> request to the server url?anyParamNameRecognizedByServer=$label ($label is replaced with labelField)->
      server returns page with table where all rows contain data-val, data-label attributes with values initialized by their PK and label (label field name (labelField) from the request)->
      page is shown im modal window -> row of table is clicked -> the values of fields with ids parentValFieldId and parentLabelFieldId of the parent page are initialized
      by values from data-val, data-label attributes correspondengly of clicked row->child window is closed

      child table from where select could by doing must be marked with  id="item-selector-list"
  */  var $, itemSelectorPresenter;
  $ = jQuery;
  itemSelectorPresenter = (function() {
    var dlg, settings, widget, wnd;
    settings = null;
    dlg = null;
    widget = null;
    wnd = null;
    function itemSelectorPresenter(settings) {
      this.settings = settings;
    }
    itemSelectorPresenter.prototype.click = function() {
      var $jParent, src, that;
      src = this.settings.url;
      window.itemSelector = this;
      this.dlg = null;
      this.wnd = window;
      if (window.parent !== window.self) {
        $jParent = window.parent.jQuery.noConflict();
        this.dlg = $jParent("<iframe src='" + src + "'></iframe>");
        $ = jQuery;
      } else {
        this.dlg = $("<iframe src='" + src + "'></iframe>");
      }
      that = this;
      return this.dlg.dialog({
        modal: true,
        autoOpen: true,
        width: 900,
        height: 700,
        open: function() {
          $(this).css("width", "100%");
          return $(this).load(function() {
            return that.rebind();
          });
        }
      });
    };
    itemSelectorPresenter.prototype.rebind = function() {
      var d, that;
      that = this;
      d = this.dlg;
      $("[data-val][data-label]", d[0].contentDocument).unbind(".item-selector");
      $("[data-val][data-label] > .row_opers", d[0].contentDocument).unbind(".item-selector");
      $("[data-val][data-label] > .row_opers", d[0].contentDocument).bind("click.item-selector", function(e, ui) {
        return e.stopPropagation();
      });
      return $("[data-val][data-label]", d[0].contentDocument).bind("dblclick.item-selector", function(e, ui) {
        var con, label, val;
        e.stopPropagation();
        val = $(this).attr("data-val");
        label = $(this).attr("data-label");
        con = true;
        window.parent.$ = window.parent.jQuery;
        if (that.settings.onSelected) {
          con = !(that.settings.onSelected(that, val, label) === false);
        }
        if (con) {
          that.wnd.$("[id='" + that.settings.parentValFieldId + "']").val(val);
          that.wnd.$("[id='" + that.settings.parentLabelFieldId + "']").val(label);
        }
        return setTimeout(function() {
          d.dialog("close");
          return that.wnd.itemSelector = null;
        }, 10);
      });
    };
    return itemSelectorPresenter;
  })();
  $.fn.extend({
    itemSelector: function(method) {
      var methods, settings;
      settings = {
        baseUrl: null,
        url: null,
        reqLabelName: null,
        reqLabelValue: null,
        parentValFieldId: null,
        parentLabelFieldId: null,
        onSelected: null
      };
      methods = {
        init: function(options) {
          if (options) {
            $.extend(settings, options);
          }
          return this.each(function() {
            var $t, attr, s;
            s = $.extend({}, settings);
            $t = $(this);
            attr = $t.attr("data-url");
            if (attr) {
              s.url = attr;
            }
            attr = $t.attr("data-req-label-name");
            if (attr) {
              s.reqLabelName = attr;
            }
            attr = $t.attr("data-req-label-value");
            if (attr) {
              s.reqLabelValue = attr;
            }
            attr = $t.attr("data-parent-val-field-id");
            if (attr) {
              s.parentValFieldId = attr;
            }
            attr = $t.attr("data-parent-label-field-id");
            if (attr) {
              s.parentLabelFieldId = attr;
            }
            s.url = [s.baseUrl, s.url].da_joinUrls();
            if (!s.url) {
              throw "url must be defined";
            }
            if (s.reqLabelName && s.reqLabelValue) {
              s.url = s.url.da_joinUrlParam("" + s.reqLabelName + "=" + s.reqLabelValue);
            }
            $t.bind("click.ItemSelector", methods.click);
            return $t.data("ItemSelector", {
              presenter: new itemSelectorPresenter(s)
            });
          });
        },
        destroy: function() {
          return this.each(function() {
            var $this, data;
            $this = $(this);
            data = $this.data("ItemSelector");
            $this.unbind(".ItemSelector");
            data.ItemSelector.remove();
            return $this.removeData("ItemSelector");
          });
        },
        click: function(event) {
          event.preventDefault();
          $(this).data("ItemSelector").presenter.click();
          return false;
        }
      };
      if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      } else if (typeof method === 'object' || !method) {
        return methods.init.apply(this, arguments);
      } else {
        return $.error("Method " + method + " does not exist on jQuery.SortList");
      }
    }
  });
}).call(this);
