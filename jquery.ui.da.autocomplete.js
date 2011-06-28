(function() {
  /*
      serverBaseUrl - will be appended to each serverUrl : serverBaseUrl + "/" + serverUrl

      attributes

      data-autocomplete-srv - server url for ajax request-response (in JSON) [serverUrl]
      data-autocomplete-format - format of server JSON response
          three fields separated by comma : value field name, display field name, [list field name = display field name if not defined].
          Initialize corresponded options : valueField, displayField, listField
      data-autocomplete-response-field
      data-autocomplete-for
      data-autocomplete-min-length
      data-autocomplete-multi

      OR options

      serverBaseUrl -
      serverUrl - data-autocomplete-srv
      forTarget - data-autocomplete-for
      data-autocomplete-format -
          valueField :
          displayField :
          listField :
      responseField - data-autocomplete-response-field
      data : - is / not func
      minLength : data-autocomplete-min-length
      multi : data-autocomplete-multi
  */  var autoCompletePresenter, multiAutoCompletePresenter;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  autoCompletePresenter = (function() {
    var $forTarget, $target, forcedSearch, getPresenter, settings;
    forcedSearch = false;
    $target = null;
    $forTarget = null;
    settings = null;
    getPresenter = function(element) {
      return $(element).data("autocomplete").presenter;
    };
    autoCompletePresenter.prototype.getRequestTerm = function(rawTerm) {
      return rawTerm;
    };
    autoCompletePresenter.prototype.getAjaxOptions = function(request, response) {
      var s;
      s = this.settings;
      return {
        url: s.serverUrl.replace(/\$term/gi, this.getRequestTerm(request.term)),
        dataType: "text json",
        data: s.data ? ($.isFunction(s.data) ? s.data(request.term) : s.data) : null,
        success: function(data) {
          var d, items;
          if (data) {
            d = s.responseField ? eval("data." + s.responseField) : data;
            items = $.map(d, function(item) {
              return {
                id: eval("item." + s.valueField),
                value: eval("item." + s.displayField),
                label: eval("item." + s.listField)
              };
            });
            if (this.forcedSearch) {
              this.validateValFromList(items);
              response(null);
            } else {
              response(items);
            }
            return this.forcedSearch = false;
          }
        }
      };
    };
    autoCompletePresenter.prototype.getJQueryAutocompleteOptions = function() {
      return {
        autoSelect: true,
        selectFirst: true,
        minLength: this.settings.minLength,
        select: function(event, ui) {
          return getPresenter(this).setAutocompleteVal(ui.item.id);
        },
        source: function(request, response) {
          var a, prr;
          prr = getPresenter(this.element);
          a = getPresenter(this.element).getAjaxOptions(request, response);
          return $.ajax(a);
        }
      };
    };
    function autoCompletePresenter($target, settings) {
      this.$target = $target;
      this.settings = settings;
      if (this.settings.forTarget) {
        this.$forTarget = $("#" + this.settings.forTarget);
      }
      $target.autocomplete(this.getJQueryAutocompleteOptions());
      $target.focus(__bind(function() {
        if (this.$forTarget) {
          return this.oldVal = this.$forTarget.val();
        }
      }, this));
      $target.change(__bind(function() {
        if ($forTarget && this.oldVal === this.$forTarget.val()) {
          this.forcedSearch = true;
          return $target.autocomplete("search");
        }
      }, this));
    }
    autoCompletePresenter.prototype.setAutocompleteVal = function(val) {
      if (this.$forTarget) {
        return this.$forTarget.val(val);
      }
    };
    autoCompletePresenter.prototype.validateValFromList = function(items) {
      var i, si, _i, _len;
      if (!items) {
        for (_i = 0, _len = items.length; _i < _len; _i++) {
          i = items[_i];
          si = this.value === $target.val();
        }
        if (this.$forTarget) {
          return setAutocompleteVal(si);
        }
      }
    };
    return autoCompletePresenter;
  })();
  multiAutoCompletePresenter = (function() {
    var extractLast, split;
    __extends(multiAutoCompletePresenter, autoCompletePresenter);
    function multiAutoCompletePresenter($target, settings) {
      this.$target = $target;
      this.settings = settings;
      multiAutoCompletePresenter.__super__.constructor.call(this, this.$target, this.settings);
      $target.keydown(__bind(function(event) {
        var _ref;
        if (event.keyCode === $.ui.keyCode.TAB && ((_ref = $target.data("autocomplete").menu) != null ? _ref.active : void 0)) {
          return event.preventDefault();
        }
      }, this));
    }
    split = function(val) {
      return val.split(/,\s*/);
    };
    extractLast = function(term) {
      return split(term).pop();
    };
    multiAutoCompletePresenter.prototype.getRequestTerm = function(rawTerm) {
      return extractLast(rawTerm);
    };
    multiAutoCompletePresenter.prototype.getJQueryAutocompleteOptions = function() {
      var sup;
      sup = multiAutoCompletePresenter.__super__.getJQueryAutocompleteOptions.call(this);
      return $.extend(sup, {
        search: function() {
          var term;
          term = extractLast(this.value);
          if (term.length < 1) {
            return false;
          }
        },
        focus: function() {
          return false;
        },
        select: function(event, ui) {
          var terms;
          terms = split(this.value);
          terms.pop();
          terms.push(ui.item.value);
          terms.push("");
          this.value = terms.join(", ");
          return false;
        }
      });
    };
    multiAutoCompletePresenter.prototype.keydown = function(event) {
      var _ref;
      if (event.keyCode === $.ui.keyCode.TAB && ((_ref = $target.data("autocomplete").menu) != null ? _ref.active : void 0)) {
        return event.preventDefault();
      }
    };
    return multiAutoCompletePresenter;
  })();
  $.fn.extend({
    autoComplete: function(method) {
      var methods, settings;
      settings = {
        serverBaseUrl: null,
        serverUrl: null,
        forTarget: null,
        valueField: null,
        displayField: null,
        listField: null,
        responseField: null,
        data: null,
        minLength: 2,
        multi: false
      };
      methods = {
        init: function(options) {
          if (options) {
            $.extend(settings, options);
          }
          return this.each(function() {
            var $t, attr, data, format, prr, s;
            s = $.extend({}, settings);
            $t = $(this);
            attr = $t.attr("data-autocomplete-srv");
            if (attr) {
              s.serverUrl = attr;
            }
            if (!s.serverUrl) {
              throw "autocomplete.serverUrl must be defined";
            }
            attr = $t.attr("data-autocomplete-response-field");
            if (attr) {
              s.responseField = attr;
            }
            attr = $t.attr("data-autocomplete-for");
            if (attr) {
              s.forTarget = attr;
            }
            attr = $t.attr("data-autocomplete-min-length");
            if (attr) {
              s.minLength = attr;
            }
            attr = $t.attr("data-autocomplete-multi");
            if (attr) {
              s.multi = attr === "true";
            }
            attr = $t.attr("data-autocomplete-format");
            if (attr) {
              format = attr.split(",");
              if (format[0]) {
                s.valueField = format[0];
              }
              if (format[1]) {
                s.displayField = format[1];
              }
              if (format[2]) {
                s.listField = format[2];
              }
            }
            if (!s.valueField) {
              throw "autocomplete.valueField must be defined";
            }
            if (s.serverBaseUrl) {
              s.serverUrl = "" + s.serverBaseUrl + "/" + s.serverUrl;
            }
            if (!s.displayField) {
              s.displayField = s.valueField;
            }
            if (!s.listField) {
              s.listField = s.displayField;
            }
            data = $t.data("autocomplete");
            prr = !s.multi ? new autoCompletePresenter($t, s) : new multiAutoCompletePresenter($t, s);
            if (!data) {
              return $t.data("autocomplete", {
                target: $t,
                presenter: prr
              });
            }
          });
        }
      };
      if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      } else if (typeof method === 'object' || !method) {
        return methods.init.apply(this, arguments);
      } else {
        return $.error("Method " + method + " does not exist on autocomplete");
      }
    }
  });
}).call(this);
