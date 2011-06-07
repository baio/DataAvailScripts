(function() {
  var $;
  $ = jQuery;
  $.fn.extend({
    Quotation: function(method) {
      var feq, methods, settings;
      settings = {
        "marker": null,
        "template": "<div><input type='text'/><a href='#' data-quote-remover>remove</a></div>",
        "maxCount": 5
      };
      feq = function(marker) {
        return window.da_feq(marker);
      };
      methods = {
        init: function(options) {
          if (options) {
            $.extend(settings, options);
          }
          return this.each(function() {
            var $dest, $menu, $this, $tmpl, attr, htmlMarker, menuId, s, _ref;
            s = $.extend({}, settings);
            $this = $(this);
            attr = $this.attr("data-quote-source");
            if (attr) {
              s.marker = attr;
            }
            $tmpl = $("[data-quote-template]" + (feq(s.marker)));
            if ($tmpl[0]) {
              s.template = $tmpl.html();
              $tmpl.remove();
            }
            htmlMarker = (_ref = s.marker) != null ? _ref : s.marker = "default";
            $menu = $("[data-quote-menu" + (feq(s.marker)) + "]");
            menuId = $menu.id;
            if (!menuId) {
              menuId = "id_quote_menu_" + htmlMarker;
              $menu.id = menuId;
            }
            $this.contextMenu({
              menu: menuId
            });
            $("a:[href = '#quote']", $menu).attr("data-bind", "click: addQuote");
            $("body").append("<script id='id_quote_template_" + htmlMarker + " type='text/html'>" + s.template + "</script>");
            $dest = $("[data-quote-destination" + (feq(s.marker)) + "]");
            $dest.attr("data-bind", "template: {name : 'quoteTemplate', foreach: quotes, afterAdd: afterAddQuote}'");
            return $("body").append("<script type='text/javascript'>                function quote(text) {                    return {                        text: ko.observable(text),                        remove: function () {                            viewModel.quotes.remove(this);                        }                    };                }                var viewModel = {                    quotes: ko.observableArray([]),                    removeQuote: function (quote) {                        this.quotes.remove(quote);                    },                    addQuote: function () {                        this.quotes.push(new quote(document.selection));                    }                };                ko.applyBindings(viewModel);                function afterAddQuote(element) {                    if (viewModel.quotes().length > 1) {                        $(element).prependTo($(element.parentElement));                    }                }            </script>");
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
