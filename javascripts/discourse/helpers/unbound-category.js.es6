import { categoryLinkHTML } from "discourse/helpers/category-link";
import { registerUnbound } from "discourse-common/lib/helpers";
import { updateOpts } from '../lib/category-highlight-utilities';

function extendedCategoryLinkHtml(cat, opts) {
  return categoryLinkHTML(cat, updateOpts(cat, opts))
}

registerUnbound("category-badge", function(cat, options) {
  return extendedCategoryLinkHtml(cat, {
    hideParent: options.hideParent,
    allowUncategorized: options.allowUncategorized,
    categoryStyle: options.categoryStyle,
    link: false
  });
});

registerUnbound("category-link", extendedCategoryLinkHtml);