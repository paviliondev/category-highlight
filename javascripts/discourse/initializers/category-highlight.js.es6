import { withPluginApi } from 'discourse/lib/plugin-api';
import Category from 'discourse/models/category';
import { highlightClass } from '../lib/category-highlight-utilities';
import { default as computed } from 'discourse-common/utils/decorators';

export default {
  name: 'category-highlight',
  initialize(container) {
    const currenUser = container.lookup('current-user:main');
    const site = container.lookup('site:main');
    
    withPluginApi('0.8.32', api => {
      api.modifyClass('component:category-title-link', {
        classNameBindings: [':category-title-link-component', 'highlightClass'],
        
        @computed('category')
        highlightClass: (category) => highlightClass(category)
      });
      
      api.modifyClass('component:category-drop/category-drop-header', {
        classNameBindings: ["categoryStyleClass", "highlightClass"],
        
        @computed('selectedContent')
        highlightClass: (selectedContent) => highlightClass(selectedContent)
      });
      
      api.modifyClass('component:category-row', {
        classNameBindings: ["highlightClass"],
        
        @computed('category')
        highlightClass: (category) => highlightClass(category)
      });
      
      api.decorateWidget('header-buttons:before', helper => {
        let list = settings.highlight_categories.split('|');
        let result;
        
        if (list.length) {
          for (let item of list) {
            let parts = item.split(':');
            let enabled = parts[3];
            
            if (enabled) {
              let slugParts = parts[0].split('/');
              let slug = slugParts[0];
              
              let parentSlug = null;
              if (slugParts.length > 1) {
                parentSlug = slug;
                slug = slugParts[1];
              }
                          
              const category = Category.findBySlug(slug, parentSlug);
                          
              if (category) {
                let className = `btn highlight-category-button ${highlightClass(category)} `;
                
                result = helper.attach('link', {
                  className,
                  href: category.url,
                  rawLabel: category.name 
                });
                
                break;
              }
            }
          }
        }
        
        return result;
      })
    });
  }
}