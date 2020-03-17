import RawHtml from "discourse/widgets/raw-html";
import { categoryBadgeHTML } from "discourse/helpers/category-link";
import { updateOpts } from '../lib/category-highlight-utilities';

export default class CategoryLink extends RawHtml {
  constructor(attrs) {
    attrs.html = categoryBadgeHTML(attrs.category, updateOpts(attrs.category, attrs));
    super(attrs);
  }
}
