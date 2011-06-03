(function() {
  var $, FilterPostPresenter;
  $ = jQuery;
  FilterPostPresenter = (function() {
    FilterPostPresenter.prototype.settings = null;
    FilterPostPresenter.prototype.inputs = null;
    function FilterPostPresenter(settings, inputs) {
      this.settings = settings;
      this.inputs = inputs;
    }
    FilterPostPresenter.prototype.click = function() {
      var filter, format, i;
      format = function(name, expr) {
        if (expr.isFunc()) {
          expr = expr();
        }
        if (expr.indexOf("@") === -1) {
          expr = "@ " + expr;
        }
        return expr = expr.replace("@", name);
      };
      filter = ((function() {
        var _i, _len, _ref, _results;
        _ref = this.inputs;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          _results.push(format(i.name, i.expression));
        }
        return _results;
      }).call(this)).join(" and ");
      filter = filter.trim("or").trim("and");
      return window.location = this.settings.callbackUrl + "?$filter=" + filter;
    };
    return FilterPostPresenter;
  })();
  $.fn.extend({
    FilterPost: function(method) {
      var inputSettings, methods, settings;
      inputSettings = {
        "marker": null,
        "name": null,
        "expression": null
      };
      settings = {
        "marker": null,
        "callbackUrl": null
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
            attr = $this.attr("data-filter-post");
            if (attr) {
              s.marker = attr;
            }
            attr = $this.attr("data-filter-callback-url");
            if (attr) {
              s.callbackUrl = attr;
            }
            if (!s.callbackUrl) {
              throw "callbackUrl must be defined";
            }
            data = $this.data("FilterPost");
            $this.bind("click.FilterPost", methods.click);
            if (!data) {
              return $this.data("FilterPost", {
                target: $this,
                presenter: new FilterPostPresenter(s, methods.inputs())
              });
            }
          });
        },
        destroy: function() {
          return this.each(function() {
            var $this, data;
            $this = $(this);
            data = $this.data("FilterPost");
            $this.unbind(".FilterPost");
            data.TableHeaderSort.remove();
            return $this.removeData("FilterPost");
          });
        },
        click: function() {
          return $(this).data("FilterPost").presenter.click();
        },
        inputs: function() {
          var e, format, s, _i, _len, _ref, _results;
          format = function($this, s) {
            var attr;
            attr = $this.attr("data-filter-input");
            if (attr) {
              s.marker = attr;
            }
            attr = $this.attr("data-filter-name");
            if (attr) {
              s.name = attr;
            }
            attr = $this.attr("data-filter-expression");
            if (attr) {
              s.expression = attr;
            }
            if (!s.name) {
              throw "input name must be defined";
            }
            if (!s.expression) {
              s.expression = $this.val;
            }
            return s;
          };
          s = $.extend({}, inputSettings);
          _ref = $("[data-filter-input" + (settings.marker ? "=" + settings.marker : "") + "]");
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            e = _ref[_i];
            _results.push(format($(e), s));
          }
          return _results;
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
