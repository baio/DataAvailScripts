(function() {
  ﻿;  var ItemSorterPresenter;
  ItemSorterPresenter = (function() {
    var settings;
    settings = null;
    function ItemSorterPresenter(settings) {
      this.settings = settings;
    }
    ItemSorterPresenter.prototype.click = function() {
      var order, path;
      order = "";
      path = this.settings.path;
      switch (this.settings.order) {
        case "asc":
          order = "desc";
          break;
        case "desc":
          path = "$reset";
          break;
        default:
          order = "asc";
      }
      return window.location = "" + this.settings.url + "?$orderby=" + path + "  " + order;
    };
    return ItemSorterPresenter;
  })();
  $.fn.extend({
    itemSorter: function(method) {
      var methods, settings;
      settings = {
        'url': null,
        'path': null,
        'order': "none",
        'delay': 3000
      };
      methods = {
        init: function(options) {
          if (options) {
            $.extend(settings, options);
          }
          return this.each(function() {
            var $this, attr, data, s, _ref, _ref2;
            s = $.extend({}, settings);
            $this = $(this);
            attr = $this.attr("data-item-sorter-url");
            if (attr) {
              s.url = attr;
            }
            (_ref = s.url) != null ? _ref : s.url = window.location.pathname;
            attr = $this.attr("data-item-sorter-path");
            if (attr) {
              s.path = attr;
            }
            (_ref2 = s.path) != null ? _ref2 : s.path = $this.text();
            attr = $this.attr("data-item-sorter-order");
            if (attr) {
              s.order = attr;
            }
            if (!s.url) {
              throw "itemSorter.url must be defined";
            }
            if (!s.path) {
              throw "itemSorter.path must be defined";
            }
            if (!s.order) {
              throw "itemSorter.order must be defined";
            }
            /*
            switch s.sortOrder
                when "asc" then $this.text $this.text() + " [asc]"
                when "desc" then $this.text $this.text() + " [desc]"
                when "none" then
                else throw "argument sortOrder must be asc, desc or none"
            */
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
