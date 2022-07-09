import EventEmiter from '/views/lib/event/eventEmiter.js'
import Server from '/views/lib/server/server.js';
import Anim from '/views/lib/anim/Anim.js';
const BASE_LINK = '/views/components';

class BaseComponent extends EventEmiter {
    
    static initialysedList = [];
    /**
     * 
     * @param {Object} model 
     * @param {Object} data 
     */
    
    constructor(model , data){
        super();
        this.Server  = Server;
        this.Anim = Anim;

        if(model.initCss!==false)BaseComponent.initCss(this);
        delete model.initCss;
        
        for (const key in model) {
            if (Object.hasOwnProperty.call(model, key)) {//
        
                Object.defineProperties(this , {
                    [key] : {
                        get : function(){
                             return model[key] 
                            },
                        set : function(value){
                            model[key] = value;
                            this.emite(key ,value);
                        },
                    }
                });
            }
        }
        if (data) {
            for (const key in model) {
                if (Object.hasOwnProperty.call(data, key)) {
                    if (data[key]!=undefined) {
                        this[key] = data[key]; 
                    }
                }
            }
        }
        
        /**
         * 
         */
         const {tree , action}= this.elementTree(this.#create,this.getName(),this.#selector,this.#selectorAll);

         if (!(tree instanceof HTMLElement)) throw new Error("<<tree>> must be HTMLElement");
         tree.component = this;
         this.root = tree;

          
         //TODO when element charged/////////// call all actions /////////////////////////
         
         for (const selector in action) {
            if (Object.hasOwnProperty.call(action, selector)) {
               if(!(action[selector] instanceof Function)) throw new Error(`<<action['${selector}']>> must be Function`);
            }
         }
            for (const selector in action) {
                if (Object.hasOwnProperty.call(action, selector)) {
                    action[selector](this.#selector(selector),this.#selectorAll(selector));
                }
             }    
        
             //////////////  emite all model property ///////////////////
          for (const key in model) {
            if (Object.hasOwnProperty.call(model, key)) {
                this.emite(key,model[key]);
                
            }
        }

    }

   

    /**
     * 
     * @param {String} selector 
     * @returns 
     */
    #selector = (selector) =>{
        let elem = selector == this.getName() ? this.root : this.root.querySelector(selector);
        return elem;
    }
    /**
     * 
     * @param {Array} selector 
     * @returns 
     */
    #selectorAll = (selector) =>{
        let elem = selector == this.getName() ? this.root : this.root.querySelectorAll(selector);
        return elem;
    }

    /**
     * 
     * @returns 
     */
    getView(){
        return this.root;
    }
    /**
     * 
     * @param {BaseComponent} component 
     * @param {String} link 
     */
    static initCss(component , link){
        
        let name = component.constructor.name;
        name = name.substring(0,1).toLocaleLowerCase() + name.substring(1);
        if(!BaseComponent.initialysedList.includes(name)){
            const linkElem = document.createElement('link');
            linkElem.rel="stylesheet" ;
            linkElem.href= link? link : BASE_LINK+'/'+name+'/'+name+".css";
            document.head.prepend(linkElem);
            BaseComponent.initialysedList.push(name);
        }
    }
    /**
     * 
     * @param {String} type 
     * @param {String} className 
     * @param  {...ChildNode} childrens 
     * @returns 
     */
    #create = (type ,class_id , ...childrens )=>{
        const elem = document.createElement(type);
        if(class_id instanceof Array ){
            if(typeof class_id[0]== 'string' )elem.className =  class_id[0];
            if(typeof class_id[1]== 'string' )elem.id =  class_id[1];
        }else{
            if(class_id) elem.className = class_id;
        }
        elem.append(...childrens);
        return elem;
    }

    /**
     * 
     * @returns 
     */
    getName(){
        let name  = this.constructor.name;
        name = name.split('');
        name = name.map( (l , i) =>{
            const lower = l.toLocaleLowerCase();
            return (lower > l)&& i !=0 ? '-'+lower : lower;
        });
        name = name.join('');
        return name;
    }
    /**
     * 
     * @param {Function} createElement  
     * @param {Function} selector 
     * @param {String} rootName 
     * @returns 
     */
    elementTree(_,rootName, $) {
        const tree = _('div', rootName,
            'Create your component',
            _('div', 'btn1', 'Test Translation'),
            _('div', 'btn2', 'Test Rotate')
        );

        const action = {
            ['.btn1'] : (elem)=>{
                this.#basicAnim(elem ,$('.'+rootName), 'translateY', 'px');
            },

            ['.btn2'] : (elem)=>{
                this.#basicAnim(elem ,$('.'+rootName), 'rotateZ', 'deg');
            }
        }

        return { tree , action };
    }

    #basicAnim (elem ,root , type,unit){
        const litleAnim = new this.Anim().when('progress',(p)=>{
            const v = Math.sin(p*Math.PI*2)*300*(1/(1+p*10));
            root.style.transform  = type+'('+v+unit+')';
        }).when('change',(p)=>{
            root.style.background = p.status != 'onEnd' ? '#555' :'#0000' ;
        }).when('onEnd',(p)=>{
            //elem.textContent = 'success';
            })
        elem.addEventListener('click', ()=>{
            litleAnim.start();
        });
    }
    
}

export default BaseComponent;
