import Category from 'discourse/models/category';
import { emojiUnescape } from "discourse/lib/text";

function highlightClass(cat) {
  return Category.slugFor(cat);
}

function updateOpts(cat, opts) {
  const extraClasses = (opts.extraClasses ? `${opts.extraClasses}` : '') + ` ${highlightClass(cat)} `;
  return Object.assign({}, opts, { extraClasses });
}

function pushItemToResult(result, category, parentCategory, headerText, link) {
	if(!result[parentCategory.slug]) {
		result[parentCategory.slug] = {contents: []};
	}

	result[parentCategory.slug]['contents'] = result[parentCategory.slug]['contents'] || [];

		result[parentCategory.slug]['contents'].push({
			 id: Math.floor(Math.random() * 100),
			 html: `<span>${emojiUnescape(headerText)}</span>`,
			 link: link || category.url
			});
	}

function createParentItem(result, category, className, headerText, longText,  link) {
	let object = {
	    className,
	    category,
	    link: link || category.url,
	    html: `<span>${emojiUnescape(headerText)}</span>`,
	    attributes: {
	      title: $('<textarea />').html(longText).text()
	    }
 	}
 	result[category.slug] = result[category.slug] || {};
 	Object.assign(result[category.slug], object);
}

export { updateOpts, highlightClass, pushItemToResult, createParentItem }
