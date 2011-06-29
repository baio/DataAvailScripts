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
  String.prototype.da_trim = function(str, start) {
    var a, r;
    str != null ? str : str = "\s";
    a = this;
    if (start === true || !(start != null)) {
      r = new RegExp("^" + str + "+");
      a = a.replace(r, "");
    }
    if (start === false || !(start != null)) {
      r = new RegExp("" + str + "+$");
      a = a.replace(r, "");
    }
    return a.toString();
  };
  Array.prototype.da_joinUrls = function(joiner) {
    var i, s, _i, _len, _ref, _ref2;
    s = (_ref = this[0]) != null ? _ref.da_trim('/', false) : void 0;
    _ref2 = this.slice(1);
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      i = _ref2[_i];
      if (i) {
        s += '/' + i.da_trim('/', true);
      }
    }
    return s;
  };
}).call(this);
