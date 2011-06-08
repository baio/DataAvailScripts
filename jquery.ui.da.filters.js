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
      var filter, filterVals, format, formatVal, i;
      format = function(target, name, val, expr) {
        if (expr.indexOf("$val") !== -1) {
          if (window.da_isFunc(val)) {
            val = val.call(target);
          }
          return expr.replace("$val", val);
        }
        if (window.da_isFunc(expr)) {
          expr = expr.call(target);
        }
        if (name) {
          if (expr.indexOf("@") === -1 && (" " + expr).indexOf(" " + name + " ") === -1) {
            expr = "@ " + expr;
          }
          return expr = expr.replace("@", name);
        }
      };
      formatVal = function(target, name, val, expr) {
        if (expr.indexOf("$val") !== -1) {
          if (window.da_isFunc(val)) {
            val = val.call(target);
          }
          if (name) {
            val = name + ":" + val;
          }
          return val;
        }
      };
      filter = ((function() {
        var _i, _len, _ref, _results;
        _ref = this.inputs;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          _results.push(format(i.target, i.name, i.value, i.expression));
        }
        return _results;
      }).call(this)).join(" and ");
      filterVals = ((function() {
        var _i, _len, _ref, _results;
        _ref = this.inputs;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          _results.push(formatVal(i.target, i.name, i.value, i.expression));
        }
        return _results;
      }).call(this)).join(",");
      filter = filter.da_trim("or").da_trim("and");
      return window.location = "" + this.settings.callbackUrl + "?$filter=" + filter + "&filter_val=" + filterVals;
    };
    return FilterPostPresenter;
  })();
  $.fn.extend({
    FilterPost: function(method) {
      var inputSettings, methods, settings;
      inputSettings = {
        "marker": null,
        "name": null,
        "expression": null,
        "value": null,
        "target": null
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
                presenter: new FilterPostPresenter(s, methods.inputs(s.marker))
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
          var data;
          data = $(this).data("FilterPost");
          return data.presenter.click();
        },
        inputs: function(marker) {
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
            /*
            if !s.name
                throw "input name must be defined"
            */
            if (!s.expression) {
              s.expression = $this.val;
            }
            if (!s.value) {
              s.value = $this.val;
            }
            s.target = $this;
            return s;
          };
          s = $.extend({}, inputSettings);
          _ref = $("[data-filter-input" + (marker ? "=" + marker : "") + "]");
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
