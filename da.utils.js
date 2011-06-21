(function() {
  var da_feq, da_finn, da_selection;
  da_feq = function(val) {
    return da_finn(val, function(x) {
      return "=" + x;
    });
  };
  window.da_feq = da_feq;
  da_finn = function(val, func) {
    return val = val ? func(val) : null;
  };
  window.da_finn = da_finn;
  da_selection = function() {
    var txt;
    txt = "";
    if (window.getSelection) {
      txt = window.getSelection();
    } else if (document.getSelection) {
      txt = document.getSelection();
    } else if (document.selection) {
      txt = document.selection.createRange().text;
    }
    return txt.toString();
  };
  window.da_selection = da_selection;
  String.prototype.da_trim = function() {
    var a;
    a = this.replace(/^\s+/, "");
    return a.replace(/\s+$/, "");
  };
}).call(this);
