import Category from 'discourse/models/category';

function highlightClass(cat) {
  return Category.slugFor(cat);
}

function updateOpts(cat, opts) {
  const extraClasses = (opts.extraClasses ? `${opts.extraClasses}` : '') + ` ${highlightClass(cat)} `;
  return Object.assign({}, opts, { extraClasses });
}

export { updateOpts, highlightClass }