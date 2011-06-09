(function() {
  var da_feq, da_finn, da_isFunc;
  da_feq = function(val) {
    return da_finn(val, da_finn(val, function(val) {
      return "=" + val;
    }));
  };
  window.da_feq = da_feq;
  da_finn = function(val, func) {
    if (val != null) {
      return val = func(val);
    }
  };
  window.da_finn = da_finn;
  String.prototype.da_trim = function() {
    var a;
    a = this.replace(/^\s+/, "");
    return a.replace(/\s+$/, "");
  };
  da_isFunc = function(x) {
    return typeof x === "function";
  };
  window.da_isFunc = da_isFunc;
}).call(this);
