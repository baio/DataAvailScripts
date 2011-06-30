(function() {
  $.fn.datePicker = function() {
    return this.each(function() {
      if ($(this).attr("readonly") !== true) {
        return $(this).datepicker();
      }
    });
  };
}).call(this);
