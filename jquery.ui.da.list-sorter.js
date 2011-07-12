(function() {
  var ListSorterPresenter;
  ListSorterPresenter = (function() {
    function ListSorterPresenter(settings) {
      this.settings = settings;
    }
    ListSorterPresenter.prototype.update = function(val) {
      var order, path;
      order = "";
      if (val && val !== "$reset") {
        path = val;
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
      } else {
        path = "$reset";
      }
      return window.location = "" + this.settings.url + "?$orderby=" + path + "  " + order;
    };
    return ListSorterPresenter;
  })();
  $.fn.extend({
    listSorter: function(method) {
      var methods, settings;
      settings = {
        url: null,
        order: "none",
        autoUpdate: true
      };
      methods = {
        init: function(options) {
          if (options) {
            $.extend(settings, options);
          }
          return this.each(function() {
            var $t, attr, data, prr, s, _ref;
            s = $.extend({}, settings);
            $t = $(this);
            attr = $t.attr("data-list-sorter-url");
            if (attr) {
              s.url = attr;
            }
            (_ref = s.url) != null ? _ref : s.url = window.location.pathname;
            attr = $t.attr("data-list-sorter-order");
            if (attr) {
              s.order = attr;
            }
            attr = $t.attr("data-list-auto-update");
            if (attr) {
              s.autoUpdate = new Boolean(attr);
            }
            data = $t.data("ListSorter");
            if (!data) {
              prr = new ListSorterPresenter(s);
              if (s.autoUpdate) {
                $t.bind("change.ListSorter", methods.update);
              }
              return $t.data("ListSorter", {
                target: $t,
                presenter: prr
              });
            }
          });
        },
        destroy: function() {
          return this.each(function() {
            var $this, data;
            $this = $(this);
            data = $this.data("ListSorter");
            $this.unbind(".ListSorter");
            return $this.removeData("ListSorter");
          });
        },
        update: function() {
          return $(this).data("ListSorter").presenter.update($(this).val());
        }
      };
      if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      } else if (typeof method === 'object' || !method) {
        return methods.init.apply(this, arguments);
      } else {
        return $.error("Method " + method + " does not exist on jQuery.ListSorter");
      }
    }
  });
}).call(this);
