define(
  'ephox.alloy.demo.CardMenuDemo',

  [
    'ephox.alloy.api.behaviour.Behaviour',
    'ephox.alloy.api.behaviour.Transitioning',
    'ephox.alloy.api.system.Attachment',
    'ephox.alloy.api.system.Gui',
    'ephox.alloy.api.ui.Menu',
    'ephox.alloy.api.ui.TieredMenu',
    'ephox.alloy.demo.HtmlDisplay',
    'ephox.sugar.api.node.Element',
    'ephox.sugar.api.properties.Class',
    'ephox.sugar.api.properties.Css',
    'ephox.sugar.api.search.SelectorFind',
    'ephox.sugar.api.view.Width'
  ],

  function (Behaviour, Transitioning, Attachment, Gui, Menu, TieredMenu, HtmlDisplay, Element, Class, Css, SelectorFind, Width) {
    return function () {
      var gui = Gui.create();
      var body = Element.fromDom(document.body);
      Class.add(gui.element(), 'gui-root-demo-container');
      Attachment.attachSystem(body, gui);


      var makeBack = function (text) {
        return {
          data: TieredMenu.collapseItem(text),
          type: 'item',
          dom: {
            tag: 'div',
            innerHtml: text
          },
          components: [ ]
        };
      };

      var makeItem = function (value, text) {
        return {
          data: {
            value: value,
            text: text
          },
          type: 'item',
          dom: {
            tag: 'div',
            innerHtml: text
          },
          components: [ ]
        };
      };

      var makeMenu = function (value, items) {
        return {
          value: value,
          dom: {
            tag: 'div'
          },
          components: [
            Menu.parts().items({ })
          ],
          items: items,
          menuBehaviours: Behaviour.derive([
            Transitioning.config({
              initialState: 'after',
              routes: Transitioning.createTristate('before', 'current', 'after', {
                transition: {
                  property: 'transform',
                  transitionClass: 'transitioning'
                }
              })
            })
          ])
        };
      };

      // https://jsfiddle.net/xuto3by2/1/
      var tieredMenu = TieredMenu.sketch({
        dom: {
          tag: 'div',
          classes: [ 'demo-tiered-menu' ],
          styles: {
            outline: '4px solid black',
            // This would make the left 800px somehow get shifted inside the box. Weird.
            overflow: 'hidden',
            width: '100px',
            // 'max-width': '100px',
            // 'box-sizing': 'border-box',
            position: 'relative',
            height: '100px'
          }
        },
        components: [
          
        ],

        // Focus causes issues when the things being focused are offscreen.
        fakeFocus: true,

        onExecute: function () {
          console.log('Executing');
        },
        onEscape: function () {
          console.log('Escaping');
        },
        onOpenMenu: function (container, menu) {
          var w = Width.get(container.element());
          Width.set(menu.element(), w);
          Transitioning.jumpTo(menu, 'current');
        },
        onOpenSubmenu: function (container, item, submenu) {
          var w = Width.get(container.element());
          var menu = SelectorFind.ancestor(item.element(), '[role="menu"]').getOrDie('hacky');
          var menuComp = container.getSystem().getByDom(menu).getOrDie();

          Width.set(submenu.element(), w);

          Transitioning.progressTo(menuComp, 'before');
          Transitioning.jumpTo(submenu, 'after');
          Transitioning.progressTo(submenu, 'current');
        },

        onCollapseMenu: function (container, item, menu) {
          var submenu = SelectorFind.ancestor(item.element(), '[role="menu"]').getOrDie('hacky');
          var submenuComp = container.getSystem().getByDom(submenu).getOrDie();
          Transitioning.progressTo(submenuComp, 'after');
          Transitioning.progressTo(menu, 'current');
        },

        navigateOnHover: false,

        openImmediately: true,
        data: TieredMenu.tieredData(
          'primary',
          {
            'primary': makeMenu('primary', [
              makeItem('alpha', 'Alpha'),
              makeItem('beta', 'Beta')
            ]),

            'secondary': makeMenu('secondary', [
              makeBack('Back'),
              makeItem('animal', 'Animal'),
              makeItem('bear', 'Bear')
            ]),

            'tertiary': makeMenu('secondary', [
              makeBack('Back'),
              makeItem('university', 'University')
            ])
          },
          {
            'beta': 'secondary',
            'alpha': 'tertiary'
          }
        ),

        markers: {
          backgroundMenu: 'background-menu',
          menu: 'menu',
          selectedMenu: 'selected-menu',
          item: 'item',
          selectedItem: 'selected-item'
        }
      });

      var menu = HtmlDisplay.section(
        gui,
        'This menu is a card menu',
        // {
        //   dom: {
        //     tag: 'div',
        //     styles: {
        //       // overflow: 'hidden',
        //       // width: '800px'
        //     }
        //   },
        //   components: [
            tieredMenu
        //   ]
        // }
      );
    };
  }
);
