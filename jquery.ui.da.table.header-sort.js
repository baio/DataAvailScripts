(function() {
  var $, TableHeaderSortPresenter;
  $ = jQuery;
  TableHeaderSortPresenter = (function() {
    var settings;
    settings = null;
    function TableHeaderSortPresenter(settings) {
      this.settings = settings;
    }
    TableHeaderSortPresenter.prototype.click = function() {
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
    return TableHeaderSortPresenter;
  })();
  /*
  arguments could be passed through options or attributes:
  data-table-header-sort-name and data-table-header-sort-order
  */
  $.fn.extend({
    TableHeaderSort: function(method) {
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
            var $this, attr, data, s;
            s = $.extend({}, settings);
            $this = $(this);
            attr = $this.attr("data-table-header-sort-callback-url");
            if (attr) {
              s.callbackUrl = attr;
            }
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
            data = $this.data("TableHeaderSort");
            $this.bind("click.TableHeaderSort", methods.click);
            if (!data) {
              return $this.data("TableHeaderSort", {
                target: $this,
                presenter: new TableHeaderSortPresenter(s)
              });
            }
          });
        },
        destroy: function() {
          return this.each(function() {
            var $this, data;
            $this = $(this);
            data = $this.data("TableHeaderSort");
            $this.unbind(".TableHeaderSort");
            data.TableHeaderSort.remove();
            return $this.removeData("TableHeaderSort");
          });
        },
        click: function() {
          return $(this).data("TableHeaderSort").presenter.click();
        }
      };
      if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      } else if (typeof method === 'object' || !method) {
        return methods.init.apply(this, arguments);
      } else {
        return $.error("Method " + method + " does not exist on jQuery.TableHeaderSort");
      }
    }
  });
}).call(this);
