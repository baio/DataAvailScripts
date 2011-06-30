Conevntions

jQuery - extension libraries (widgets)

Starts with jquery.ui.da.
The separated worlds in name should be separated with hyphens (-).

The coffee files should end up with .coffee (not js.coffee)

Patterns and designs:

All widgets should provide two options to initialize their settings: 1st  through direct code initialization when widget is created
 and 2nd through the attributes of the initialized tag element. The 2nd prevailed on 1st. Settings and attribute tags
 should have similar names for the same setting options.

ASP.NET MVC Reference with
This widgets can be used as standalone utilities for any client project but more efficiently they can be used along with
MVC HELPERS, through corresponding attributes and helpers, ideally corresponded by name of Attribute (Attribute fields),
, Helper and widget.

How its work:
MVC project define attribute, on the base of this attribute helper (linked with this attribute) generates html tag which
attributes properly initialized from mvc-attribute, on the base of this tag client js widget implements logic of client side
for the tag.

TODO rename classes :

FilterPost -> Filter
TableHeaderSort -> ItemSorter
SortList -> ListSorter

