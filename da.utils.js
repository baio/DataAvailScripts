(function() {
  String.prototype.trim = function() {
    var a;
    a = this.replace(/^\s+/, "");
    return a.replace(/\s+$/, "");
  };
  Object.prototype.isFunc = function() {
    return this === null || this === void 0;
  };
}).call(this);
