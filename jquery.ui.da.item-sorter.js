(function() {
  ﻿;  var ItemSorterPresenter;
  ItemSorterPresenter = (function() {
    var settings;
    settings = null;
    function ItemSorterPresenter(settings) {
      this.settings = settings;
    }
    ItemSorterPresenter.prototype.click = function() {
      var sortName, sortOrder;
      sortOrder = "";
      sortName = this.settings.columnName;
      switch (this.settings.sortOrder) {
        case "asc":
          sortOrder = "desc";
          break;
        case "desc":
          sortName = "$reset";
          break;
        default:
          sortOrder = "asc";
      }
      return window.location = "" + this.settings.callbackUrl + "?$orderby=" + sortName + "  " + sortOrder;
    };
    return ItemSorterPresenter;
  })();
  /*
  arguments could be passed through options or attributes:
  data-table-header-sort-name and data-table-header-sort-order
  */
  $.fn.extend({
    itemSorter: function(method) {
      var methods, settings;
      settings = {
        'callbackUrl': null,
        'columnName': null,
        'sortOrder': "none",
        'delay': 3000
      };
      methods = {
        init: function(options) {
          if (options) {
            $.extend(settings, options);
          }
          return this.each(function() {
            var $this, attr, data, s, _ref;
            s = $.extend({}, settings);
            $this = $(this);
            attr = $this.attr("data-table-header-sort-callback-url");
            if (attr) {
              s.callbackUrl = attr;
            }
            (_ref = s.callbackUrl) != null ? _ref : s.callbackUrl = window.location.pathname;
            attr = $this.attr("data-table-header-sort-name");
            if (attr) {
              s.columnName = attr;
            }
            attr = $this.attr("data-table-header-sort-order");
            if (attr) {
              s.sortOrder = attr;
            }
            if (!s.callbackUrl) {
              throw "callbackUrl must be defined";
            }
            if (!s.columnName) {
              throw "columnName must be defined";
            }
            if (!s.sortOrder) {
              throw "sortOrder must be defined";
            }
            switch (s.sortOrder) {
              case "asc":
                $this.text($this.text() + " [asc]");
                break;
              case "desc":
                $this.text($this.text() + " [desc]");
                break;
              case "none":
                break;
              default:
                throw "argument sortOrder must be asc, desc or none";
            }
            data = $this.data("ItemSorter");
            $this.bind("click.ItemSorter", methods.click);
            if (!data) {
              return $this.data("ItemSorter", {
                target: $this,
                presenter: new ItemSorterPresenter(s)
              });
            }
          });
        },
        destroy: function() {
          return this.each(function() {
            var $this, data;
            $this = $(this);
            data = $this.data("ItemSorter");
            $this.unbind(".ItemSorter");
            data.TableHeaderSort.remove();
            return $this.removeData("ItemSorter");
          });
        },
        click: function() {
          return $(this).data("ItemSorter").presenter.click();
        }
      };
      if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      } else if (typeof method === 'object' || !method) {
        return methods.init.apply(this, arguments);
      } else {
        return $.error("Method " + method + " does not exist on jQuery.ItemSorter");
      }
    }
  });
}).call(this);
