(function() {
  var TableToolboxPresenter;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  TableToolboxPresenter = (function() {
    function TableToolboxPresenter(settings) {
      this.settings = settings;
      settings.addItemButton.click(function() {
        return alert("addItem");
      });
      /*
      $(settings.searchButton).filter
                  marker : "toolbox-search"
                  beforeCallbackUrl : (f)->
                      orderby = @settings.orderByVal()
                      orderby = "$orderby=#{orderby}" if orderby
                      $.grep([filter, orderby], (v) -> v).join '&'
      */
      settings.searchButton.click(__bind(function() {
        var filter, orderby, req, sv;
        orderby = this.settings.orderByVal();
        if (orderby) {
          orderby = "$orderby=" + orderby;
        }
        sv = this.settings.searchVal();
        if (sv.filter != null) {
          filter = sv.filter;
          if (sv.filter) {
            filter = "$filter=" + sv.filter + "&filter_val=" + sv.filterLabels;
          }
        } else {
          if (sv) {
            filter = "$filter=" + sv;
          }
        }
        req = $.grep([filter, orderby], function(v) {
          return v;
        }).join('&');
        return window.location = "" + this.settings.callbackUrl + "?" + req;
      }, this));
      settings.resetButton.click(__bind(function() {
        return window.location = "" + this.settings.callbackUrl + "?$filter=$reset&$orderby=$reset";
      }, this));
    }
    return TableToolboxPresenter;
  })();
  $.fn.extend({
    tableToolbox: function(method) {
      var methods, settings;
      settings = {
        callbackUrl: null,
        addItemButton: null,
        searchButton: null,
        resetButton: null,
        searchVal: null,
        orderByVal: null
      };
      methods = {
        init: function(options) {
          if (!$.filter) {
            throw "ds.filer widget not found! cant' process further";
          }
          if (options) {
            $.extend(settings, options);
          }
          return this.each(function() {
            var $t, data, prr, s, _ref;
            s = $.extend({}, settings);
            $t = $(this);
            if (!s.addItemButton) {
              s.addItemButton = $(".add-item-button", this);
            }
            if (!s.searchButton) {
              s.searchButton = $(".search-button", this);
            }
            if (!s.resetButton) {
              s.resetButton = $(".reset-button", this);
            }
            if (!s.searchVal) {
              s.searchVal = __bind(function() {
                var f;
                if ($.filter) {
                  f = $("input.search-input, .search-input input", this).filter();
                  return f.filter("getFilter");
                } else {
                  return $("select.sort-input, .sort-input select", this).val();
                }
              }, this);
            }
            if (!s.orderByVal) {
              s.orderByVal = __bind(function() {
                return $("select.sort-input, .sort-input select", this).val();
              }, this);
            }
            /*
            #if still not initialized as filer widget
            $("input.search-input, .search-input input", @).attr "data-filter", "toolbox-search"
            */
            (_ref = s.callbackUrl) != null ? _ref : s.callbackUrl = window.location.pathname;
            data = $t.data("TableToolbox");
            if (!data) {
              prr = new TableToolboxPresenter(s);
              return $t.data("TableToolbox", prr);
            }
          });
        },
        destroy: function() {
          return this.each(function() {
            var $t, data;
            $t = $(this);
            data = $t.data("TableToolbox");
            return $t.removeData("TableToolbox");
          });
        }
      };
      if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      } else if (typeof method === 'object' || !method) {
        return methods.init.apply(this, arguments);
      } else {
        return $.error("Method " + method + " does not exist on jQuery.TableToolbox");
      }
    }
  });
}).call(this);
