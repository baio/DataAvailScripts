(function() {
  /*
  plugin for tag-it widget.
  could handle cases when tag is not just a string but item which following fields:
  Key, Name, Value
  Value - string which represents a text of the tag and which is shown in widget when user enter or select some item from the list.
  Label - string which is shown in drop-down list of widget's autocomplete
  Key - the key of the tag (usually number)
  */  $.widget('ui.tagitext', {
    options: {
      tagIt: null,
      valueNode: null,
      url: null,
      filter: null
    },
    _create: function() {
      var el, _base, _base2, _base3, _ref, _ref2, _ref3;
      el = $(this.element[0]);
      (_ref = (_base = this.options).valueNode) != null ? _ref : _base.valueNode = el.attr("data-value-field");
      if (typeof this.options.valueNode === "string") {
        this.options.valueNode = $(this.options.valueNode);
      }
      (_ref2 = (_base2 = this.options).url) != null ? _ref2 : _base2.url = el.attr("data-url");
      (_ref3 = (_base3 = this.options).filter) != null ? _ref3 : _base3.filter = el.attr("data-filter");
      return el.tagit({
        animate: false,
        onTagAdded: this._onTagAdded,
        onTagRemoved: this._onTagRemoved,
        tagSource: this._tagSource,
        ext: this
      });
    },
    _tagSource: function(search, showChoices) {
      var ext, that;
      that = $(this.element).data("tagit");
      ext = that.options.ext;
      return $.ajax({
        url: ext.options.url.replace(/$term/, search.term),
        dataType: "json",
        data: {
          $filter: ext.options.filter ? ext.options.filter.replace(/$term/, search.term) : void 0,
          success: function(data) {
            var choices;
            choices = $.map(data.d, function(element) {
              return {
                value: element.Name,
                label: element.Label,
                key: element.Id
              };
            });
            that.options.availableTags = choices;
            return showChoices(ext._expellExistent(choices, that.assignedTags()));
          }
        }
      });
    },
    _onTagAdded: function(event, tag) {
      var ext, item, key, that, value, vn;
      that = $(tag).data("tagit");
      ext = that.options.ext;
      vn = ext.options.valueNode;
      if (vn) {
        value = $(":first", tag).text();
        item = $.grep(ext._getItems(that.options.availableTags), function(element) {
          return element.value === value;
        });
        key = item.length > 0 ? item[0].key : -1;
        return vn.val("" + (vn.val() ? vn.val() + "," : "") + key);
      }
    },
    _onTagRemoved: function(event, tag) {
      var ext, i, keys, that, val, values, vn;
      that = $(tag).data("tagit");
      ext = that.options.ext;
      vn = ext.options.valueNode;
      if (vn) {
        val = $(":first", tag).text();
        values = $(this).val().split(',');
        i = values.indexOf(val);
        keys = vn.val().split(',');
        keys.splice(i, 1);
        return vn.val(keys.join(','));
      }
    },
    _getItems: function(array) {
      return $.map(array, function(element) {
        var key, label, val;
        key = element.key;
        key != null ? key : key = -1;
        val = element.value;
        val != null ? val : val = element.label;
        label = element.label;
        label != null ? label : label = val;
        return {
          value: val,
          label: label,
          key: key
        };
      });
    },
    _expellExistent: function(items, existent) {
      return $.grep(items, function(element) {
        return $.inArray(existent, element.value);
      });
    }
  });
}).call(this);
