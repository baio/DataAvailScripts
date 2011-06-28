(function() {
  var $, TextBoxCounterPresenter;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  $ = jQuery;
  TextBoxCounterPresenter = (function() {
    var $counter, $target, settings;
    settings = null;
    $counter = null;
    $target = null;
    function TextBoxCounterPresenter($target, settings) {
      this.$target = $target;
      this.settings = settings;
      $target.keydown(__bind(function() {
        return this.updateCounter();
      }, this));
      $target.keyup(__bind(function() {
        return this.updateCounter();
      }, this));
      $target.focusin(__bind(function() {
        if (!this.$counter) {
          this.createPanel();
          this.$target.focus();
        }
        this.checkCaretPos();
        return this.showCounter();
      }, this));
      $target.focusout(__bind(function() {
        if (this.$counter) {
          return this.hideCounter();
        }
      }, this));
    }
    TextBoxCounterPresenter.prototype.createPanel = function() {
      /*
      $s = @$target.parent ".da-dyn-editor-span"
      if !$s[0]
          $s = $ "<span/>",  class : "da-dyn-editor-span"
          @$target.after($s).appendTo($s)
      */      this.$counter = $("<label />", {
        "for": this.$target.attr("id"),
        "class": " da-counter-label"
      });
      this.$counter.insertBefore(this.$target);
      this.updatePanelPos();
      return this.$counter.hide();
    };
    TextBoxCounterPresenter.prototype.updatePanelPos = function() {
      return this.$counter.position({
        of: this.$target,
        my: "left top",
        at: "right bottom",
        offset: "-200 0",
        collision: "none none"
      });
    };
    TextBoxCounterPresenter.prototype.len = function() {
      return this.$target.val().length;
    };
    TextBoxCounterPresenter.prototype.showCounter = function() {
      this.updateCounter();
      return this.$counter.show();
    };
    TextBoxCounterPresenter.prototype.hideCounter = function() {
      return this.$counter.hide();
    };
    TextBoxCounterPresenter.prototype.checkCaretPos = function() {
      if (!this.$target.val().trim()) {
        return this.$target.text("");
      }
    };
    TextBoxCounterPresenter.prototype.updateCounter = function() {
      var l, maxLen, r;
      maxLen = this.settings.maxLen;
      l = this.len();
      r = maxLen - l;
      if (maxLen) {
        this.$counter.removeClass("da-counter-label-err");
        this.$counter.removeClass("da-counter-label-warn");
        if (r < 0) {
          this.$counter.addClass("da-counter-label-err");
        } else if (r < maxLen / 4) {
          this.$counter.addClass("da-counter-label-warn");
        }
      }
      return this.$counter.text(maxLen ? "осталось " + r + " из " + maxLen : l);
    };
    return TextBoxCounterPresenter;
  })();
  $.fn.extend({
    textBox: function(method) {
      var methods, settings;
      settings = {
        maxLen: 0
      };
      methods = {
        init: function(options) {
          if (options) {
            $.extend(settings, options);
          }
          return this.each(function() {
            var $t, attr, data, s;
            s = $.extend({}, settings);
            $t = $(this);
            attr = $t.attr("data-val-length-max");
            if (attr) {
              s.maxLen = attr;
            }
            data = $t.data("TextBox");
            if (!data) {
              return $t.data("TextBox", {
                target: $t,
                presenter: new TextBoxCounterPresenter($t, s)
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
        return $.error("Method " + method + " does not exist on jQuery.TableHeaderSort");
      }
    }
  });
}).call(this);
