(function() {
  Window.prototype.da_feq = function(val) {
    return da_finn(val, da_finn(val, function(val) {
      return "=" + val;
    }));
  };
  Window.prototype.da_finn = function(val, func) {
    if (val != null) {
      return val = func(val);
    }
  };
  String.prototype.trim = function() {
    var a;
    a = this.replace(/^\s+/, "");
    return a.replace(/\s+$/, "");
  };
  Object.prototype.isFunc = function() {
    return this === null || this === void 0;
  };
}).call(this);
