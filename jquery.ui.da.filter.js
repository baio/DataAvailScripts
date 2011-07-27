(function() {
  /*
  controls considered to work in 2 modes - first like a button to which search controls are linked through the marker attribute and second as search control itself
  if for button mode :
  inputs can consist from number of controls each of condition will be contantinated by and operand
  */  var FilterPresenter;
  FilterPresenter = (function() {
    FilterPresenter.prototype.settings = null;
    FilterPresenter.prototype.inputs = null;
    function FilterPresenter(settings, inputs) {
      this.settings = settings;
      this.inputs = inputs;
    }
    FilterPresenter.prototype.click = function() {
      var f;
      f = this.getFilter();
      if (this.settings.beforeCallbackUrl) {
        f.filer = this.settings.beforeCallbackUrl(f.filter);
      }
      return window.location = "" + this.settings.callbackUrl + "?$filter=" + f.filter + "&filter_val=" + f.filterLabel;
    };
    FilterPresenter.prototype.getFilter = function() {
      var filter, filterVals, format, getFilterVal, i, r, valExpr;
      valExpr = function(expr, val) {
        if (!expr) {
          return val;
        }
        if (expr.indexOf("$val") !== -1) {
          if (!val) {
            return "";
          }
          if (val.match(/^[0-9a-zA-Zа-яА-Я]+$/)) {
            return expr.replace(/\$val/gi, val);
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
        if ($.isFunction(expr)) {
          expr = expr.call(target);
        }
        if ($.isFunction(val)) {
          val = val.call(target);
        }
        if (name) {
          expr = expr.replace(/@/gi, name);
        }
        v = valExpr(expr, val);
        if (v !== null) {
          if (name) {
            v = v.replace(/@/gi, name);
          }
          return {
            fv: v,
            v: getFilterVal(name, val)
          };
        }
        return {
          fv: expr,
          v: getFilterVal(name, !expr || expr.indexOf("$") === 0 ? null : expr)
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
      return {
        filter: filter,
        filterLabels: filterVals
      };
    };
    return FilterPresenter;
  })();
  $.fn.extend({
    filter: function(method) {
      var inputSettings, methods, settings;
      inputSettings = {
        marker: null,
        name: null,
        expression: null,
        value: null,
        target: null
      };
      settings = {
        marker: null,
        callbackUrl: null,
        beforeCallbackUrl: null
      };
      methods = {
        init: function(options) {
          if (options) {
            $.extend(settings, options);
          }
          return this.each(function() {
            var $t, attr, data, s, _ref;
            s = $.extend({}, settings);
            $t = $(this);
            attr = $t.attr("data-filter");
            if (attr) {
              s.marker = attr;
            }
            attr = $t.attr("data-filter-callback-url");
            if (attr) {
              s.callbackUrl = attr;
            }
            (_ref = s.callbackUrl) != null ? _ref : s.callbackUrl = window.location.pathname;
            /*
            if !s.marker
                throw "marker must be defined"
            */
            data = $t.data("FilterPost");
            if (s.marker) {
              $t.bind("click.FilterPost", methods.click);
            }
            if (!data) {
              return $t.data("FilterPost", {
                target: $t,
                presenter: new FilterPresenter(s, methods.inputs(s.marker ? s.marker : [this]))
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
        getFilter: function() {
          var data;
          data = $(this).data("FilterPost");
          return data.presenter.getFilter();
        },
        inputs: function(marker) {
          var e, format, ipts, _i, _len, _results;
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
            if (!s.expression) {
              s.expression = $this.val;
            }
            if (!s.value) {
              s.value = $this.val;
            }
            s.target = $this;
            return s;
          };
          if (typeof marker === "string") {
            ipts = $("[data-filter-input" + (marker ? "=" + marker : "") + "]");
          } else {
            ipts = [$(marker)];
          }
          _results = [];
          for (_i = 0, _len = ipts.length; _i < _len; _i++) {
            e = ipts[_i];
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
