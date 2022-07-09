import BaseComponent from '/views/components/baseComponent/baseComponent.js'
/**
 *   code minimal pour  crer un composant
 */
class Test extends BaseComponent{
    constructor(data){
        super({
           // model information..
        }, data);
    }
    elementTree(_, rootName, $, $All) {
        const tree = _('div', rootName,
            //'childrens'
        );
        
        const action = {
            
            ['SELECTOR']: (elem, elems) => {
                // DO ALL YOU WANT HERE;
            },
            [rootName]: (elem, elems) => {
                 // DO ALL YOU WANT HERE;
                 // AND CATCH ALL YOU WANT;
                 // plus de blabla
            }
        };
        return { tree, action };
    }
}

export default Test ;