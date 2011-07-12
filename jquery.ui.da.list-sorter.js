(function() {
  var ListSorterPresenter;
  ListSorterPresenter = (function() {
    function ListSorterPresenter(settings) {
      this.settings = settings;
    }
    ListSorterPresenter.prototype.change = function(val) {
      var sortName, sortOrder;
      sortOrder = "";
      if (val && val !== "$reset") {
        sortName = val;
        switch (this.settings.order) {
          case "asc":
            sortOrder = "desc";
            break;
          case "desc":
            sortName = "$reset";
            break;
          default:
            sortOrder = "asc";
        }
      } else {
        sortName = "$reset";
      }
      return window.location = "" + this.settings.callbackUrl + "?$orderby=" + sortName + "  " + sortOrder;
    };
    return ListSorterPresenter;
  })();
  $.fn.extend({
    listSorter: function(method) {
      var methods, settings;
      settings = {
        'callbackUrl': null,
        'order': "none"
      };
      methods = {
        init: function(options) {
          if (options) {
            $.extend(settings, options);
          }
          return this.each(function() {
            var $this, attr, data, prr, s, _ref;
            s = $.extend({}, settings);
            $this = $(this);
            attr = $this.attr("data-sort-callback");
            if (attr) {
              s.callbackUrl = attr;
            }
            (_ref = s.callbackUrl) != null ? _ref : s.callbackUrl = window.location.pathname;
            attr = $this.attr("data-sort-order");
            if (attr) {
              s.order = attr;
            }
            data = $this.data("ListSorter");
            if (!data) {
              prr = new ListSorterPresenter(s);
              $this.bind("change.ListSorter", methods.change);
              return $this.data("ListSorter", {
                target: $this,
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
        change: function() {
          return $(this).data("ListSorter").presenter.change($(this).val());
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
