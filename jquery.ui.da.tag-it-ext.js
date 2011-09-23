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
      filter: null,
      onTagAdded: null,
      onCreateTagHtml: null
    },
    _create: function() {
      var availableTags, el, keys, vals, _base, _base2, _base3, _ref, _ref2, _ref3;
      el = $(this.element[0]);
      (_ref = (_base = this.options).url) != null ? _ref : _base.url = el.attr("data-url");
      (_ref2 = (_base2 = this.options).filter) != null ? _ref2 : _base2.filter = el.attr("data-filter");
      keys = this.options.valueNode ? this.options.valueNode.val().split(',') : [];
      vals = el.val().split(',');
      availableTags = $.map(vals, function(val, index) {
        return {
          key: keys[index],
          value: vals[index],
          label: vals[index]
        };
      });
      this.options.tagIt = el.tagit({
        animate: false,
        onTagAdded: this._onTagAdded,
        onTagRemoved: this._onTagRemoved,
        tagSource: this._tagSource,
        ext: this,
        allowNotInList: false,
        availableTags: availableTags,
        onCreateTagHtml: this.options.onCreateTagHtml
      });
      (_ref3 = (_base3 = this.options).valueNode) != null ? _ref3 : _base3.valueNode = el.attr("data-value-field");
      if (typeof this.options.valueNode === "string") {
        return this.options.valueNode = $("#" + this.options.valueNode);
      }
    },
    _tagSource: function(search, showChoices) {
      var ext, that;
      that = $(this.element).data("tagit");
      ext = that.options.ext;
      return $.ajax({
        url: ext.options.url.replace(/\$term/, search.term),
        dataType: "json",
        data: ext.options.filter ? {
          $filter: ext.options.filter.replace(/\$term/, search.term)
        } : null,
        success: function(data) {
          var choices;
          choices = $.map(data.d, function(element) {
            return {
              value: element.Label,
              label: element.Label,
              key: element.Id
            };
          });
          that.options.availableTags = choices;
          return showChoices(ext._expellExistent(choices, that.assignedTags()));
        }
      });
    },
    _onTagAdded: function(event, tag) {
      var ext, item, key, label, that, value, vn;
      that = $(tag).data("tagit");
      ext = that.options.ext;
      vn = ext.options.valueNode;
      value = $(":first", tag).text();
      if (ext.options.creating) {
        key = ext.options.creating.key;
        label = ext.options.creating.label;
      } else {
        item = $.grep(ext._getItems(that.options.availableTags), function(element) {
          return element.value === value;
        });
        key = item.length > 0 ? item[0].key : -1;
        label = item.length > 0 ? item[0].label : null;
      }
      if (vn) {
        vn.val("" + (vn.val() ? vn.val() + "," : "") + key);
      }
      return ext._trigger("onTagAdded", null, {
        tag: tag,
        item: {
          key: key,
          value: value,
          label: label
        }
      });
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
        return $.inArray(element.value, existent) === -1;
      });
    },
    createTag: function(key, value, label) {
      this.options.creating = {
        key: key,
        value: value,
        label: label
      };
      this.options.tagIt.tagit("createTag", value);
      return this.options.creating = null;
    }
  });
}).call(this);
