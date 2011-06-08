(function() {
  var da_isFunc;
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
