import { htmlHelper } from "discourse-common/lib/helpers";
import { categoryBadgeHTML } from "discourse/helpers/category-link";
import Category from "discourse/models/category";
import { get } from "@ember/object";
import Site from "discourse/models/site";
import { updateOpts } from '../lib/category-highlight-utilities';

export default htmlHelper(function(category, opts) {
  opts = Object.assign({}, opts, (opts.hash || {}));
  
  if (
    !category ||
    (!opts.allowUncategorized &&
      get(category, "id") === Site.currentProp("uncategorized_category_id") &&
      Discourse.SiteSettings.suppress_uncategorized_badge)
  )
    return "";

  const depth = (opts.depth || 1) + 1;
  if (opts.recursive && depth <= Discourse.SiteSettings.max_category_nesting) {
    const parentCategory = Category.findById(category.parent_category_id);
    opts.depth = depth;
    return categoryBadgeHTML(parentCategory, updateOpts(parentCategory, opts)) + categoryBadgeHTML(category, updateOpts(category, opts));
  }

  return categoryBadgeHTML(category, updateOpts(category, opts));
});
