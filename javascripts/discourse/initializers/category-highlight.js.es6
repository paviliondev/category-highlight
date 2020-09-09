import { withPluginApi } from 'discourse/lib/plugin-api';
import Category from 'discourse/models/category';
import { highlightClass } from '../lib/category-highlight-utilities';
import { default as computed } from 'discourse-common/utils/decorators';
import RawHtml from "discourse/widgets/raw-html";
import { emojiUnescape } from "discourse/lib/text";
import { WidgetDropdownHeaderClass, WidgetDropdownClass } from "discourse/widgets/widget-dropdown";
import hbs from "discourse/widgets/hbs-compiler";
import DiscourseURL from "discourse/lib/url";

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

      WidgetDropdownHeaderClass['template'] = hbs`
        {{#if attrs.icon}}
          {{d-icon attrs.icon}}
        {{/if}}
        <span class="label">
          {{{transformed.label}}}
        </span>
        {{#if attrs.caret}}
          {{d-icon "caret-down"}}
        {{/if}}`;

      WidgetDropdownClass['template'] = hbs`
        {{#if attrs.content}}
        {{attach
          widget="highlighter-dropdown-header"
          attrs=(hash
            icon=attrs.icon
            label=attrs.label
            translatedLabel=attrs.translatedLabel
            class=this.transformed.options.headerClass
            caret=this.transformed.options.caret
          )
        }}
        {{#if this.state.opened}}
          {{attach
            widget="widget-dropdown-body"
            attrs=(hash
              id=attrs.id
              class=this.transformed.options.bodyClass
              content=attrs.content
            )
          }}
        {{/if}}
      {{/if}}`;

    api.createWidget('highlighter-dropdown-header', WidgetDropdownHeaderClass);
    api.createWidget('highlighter-dropdown', WidgetDropdownClass);

      api.decorateWidget('header-buttons:before', helper => {
        let list = settings.highlight_categories.split('|');
        let result = {};
        let final = [];
        if (list.length) {
          for (let item of list) {
            let parts = item.split('~');
            let longText = parts[3];
            let shortText = parts[4];
            let headerText = site.mobileView ? shortText : longText;
            
            if (headerText) {
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

                if(parts[5]) {
                  const contents = [];
                  const parent = Category.findBySlug(parts[5]);
                  if(parent) {
                    let catLink  = parts[6] || category.url;

                    let dropdownItem = {
                      id: Math.floor(Math.random() * 100),
                      html: `<a href=${catLink}>${emojiUnescape(headerText)}</a>`,
                      link: catLink
                    }

                    let parentItem;
                    if(parentItem = result[parent.slug]) {
                      parentItem['contents'].push(dropdownItem);
                    } else {
                      result[parent.slug] = {
                        className,
                        contents: [],
                        category,
                        html: `<span>${emojiUnescape(headerText)}</span>`,
                        attributes: {
                          title: $('<textarea />').html(longText).text()
                        }
                      }
                    }
                   }

                } else {
                  if(!result[category.slug]) {
                    result[category.slug] = {
                      className,
                      contents: [],
                      category,
                      link:parts[6],
                      html: `<span>${emojiUnescape(headerText)}</span>`,
                      attributes: {
                        title: $('<textarea />').html(longText).text()
                      }
                    }
                  }
                }

              }
            }
          }
        }

        for(let item in result) {
          let currentItem = result[item];
          if(currentItem.contents.length) {
            // dropdown
            console.log(currentItem, 'dropdown')
            final.push(helper.attach('highlighter-dropdown', {
                    id: `category-highlighter-${currentItem.category.slug}`,
                    translatedLabel: currentItem.html,
                    content:currentItem.contents,
                    class: 'highlighter-dropdown',
                    options: {
                      headerClass: currentItem.className,
                    },
                    onChange(item){
                      DiscourseURL.routeTo(item.link);
                    }
                  }));
          } else {
            //link
                        console.log(currentItem, 'link')
            final.push(helper.attach('link', {
                    className: currentItem.className,
                    href: currentItem.link || currentItem.category.url,
                    contents: () => new RawHtml({ html: currentItem.html }),
                    attributes: currentItem.attributes
                  }));
          }
        }
        return final;
      })
    });
  }
}