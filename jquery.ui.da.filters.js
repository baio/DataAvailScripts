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
      var filter, filterVals, format, getFilterVal, i, r, valExpr;
      valExpr = function(target, expr, val) {
        if (expr.indexOf("$val") !== -1) {
          if (!val) {
            return "";
          }
          if (val.match(/^[0-9a-zA-Zа-яА-Я]+$/)) {
            return expr.replace("$val", val);
          }
          return val;
        }
        return null;
      };
      getFilterVal = function(name, val) {
        if (name && val) {
          return name + ":" + val;
        } else {
          return val;
        }
      };
      format = function(target, name, val, expr) {
        var v;
        if (window.da_isFunc(expr)) {
          expr = expr.call(target);
        }
        if (window.da_isFunc(val)) {
          val = val.call(target);
        }
        if (name) {
          expr = expr.replace("@", name);
        }
        v = valExpr(target, expr, val);
        if (v !== null) {
          return {
            fv: v,
            v: getFilterVal(name, val)
          };
        }
        return {
          fv: expr,
          v: getFilterVal(name, expr.indexOf("$") === 0 ? null : expr)
        };
      };
      r = (function() {
        var _i, _len, _ref, _results;
        _ref = this.inputs;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          _results.push(format(i.target, i.name, i.value, i.expression));
        }
        return _results;
      }).call(this);
      filter = ($.grep((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = r.length; _i < _len; _i++) {
          i = r[_i];
          _results.push(i.fv);
        }
        return _results;
      })(), function(p) {
        return p;
      })).join(" and ");
      filterVals = ($.grep((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = r.length; _i < _len; _i++) {
          i = r[_i];
          _results.push(i.v);
        }
        return _results;
      })(), function(p) {
        return p;
      })).join();
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
          var e, format, _i, _len, _ref, _results;
          format = function($this, settings) {
            var attr, s;
            s = $.extend({}, settings);
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
          _ref = $("[data-filter-input" + (marker ? "=" + marker : "") + "]");
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            e = _ref[_i];
            _results.push(format($(e), inputSettings));
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
