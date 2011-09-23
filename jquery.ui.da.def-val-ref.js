(function() {
  $.widget('ui.defValRef', {
    _create: function() {
      var e, that, url;
      e = this.element;
      typeof url != "undefined" && url !== null ? url : url = e.attr("data-def-val-ref-url");
      url = [this.options.baseUrl, url].da_joinUrls();
      url = url.replace(new RegExp("\\$val"), e.attr("data-def-val-ref-val"));
      that = this;
      return $.ajax({
        url: url,
        data: {
          "$format": "json"
        },
        success: function(d) {
          return e.val(that.options.onSuccess(d));
        }
      });
    }
  });
}).call(this);
