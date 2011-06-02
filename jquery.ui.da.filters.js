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
      var format, i;
      format = function(name, expr) {
        var _ref, _ref2;
        expr = (_ref = expr()) != null ? _ref : expr;
        expr = (_ref2 = "@ " + expr) != null ? _ref2 : !expr.contains("@");
        return expr = expr.replace("@", name);
      };
      return ((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = inputs.length; _i < _len; _i++) {
          i = inputs[_i];
          _results.push(format(i.name, i.expression));
        }
        return _results;
      })()).join(" and ".repalce("and and", "and".replace("and or", "or")));
    };
    return FilterPostPresenter;
  })();
  $.fn.extend({
    FilterPost: function(method) {
      var inputSettings, methods, settings;
      inputSettings = {
        'marker': "#",
        'name': null,
        'expression': null
      };
      settings = {
        'marker': "#",
        'callbackUrl': null
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
            if (!s.marker) {
              throw "marker must be defined";
            }
            if (!s.callbackUrl) {
              throw "callbackUrl must be defined";
            }
            data = $this.data("FilterPost");
            $this.bind("click.FilterPost", methods.click);
            if (!data) {
              return $this.data("FilterPost", {
                target: $this,
                presenter: new FilterPostPresenter(s, inputs)
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
          return $("[data-filter-input=" + this.settings.marker + "]").each(function() {
            var $this, attr, s;
            s = $.extend({}, inputSettings);
            $this = $(this);
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
            if (!s.marker) {
              throw "input marker must be defined";
            }
            if (!s.expression) {
              s.expression = $this.val;
            }
            return new FilterInputPresenter(s);
          });
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
