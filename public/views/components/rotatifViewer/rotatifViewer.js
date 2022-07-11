import BaseComponent from '/views/components/baseComponent/baseComponent.js'

class RotatifViewer extends BaseComponent{
    constructor(data){
        super({
            initCss :false,
            viewsHeight : 100,
            viewsWidth : 100,
            views : [],
            direction : 'right',
            camera : {
                x : 0,
                y : 0,
                z : 1000
            },
            radius : 100,
            viewsHeight : 100,
        }, data);
    }
    elementTree(_, rootName, $, $All) {
        const tree = _('div', rootName,...this.views); //root.append(...this.views);
        
        const action = {
            
            [rootName]: (root) => {

                
                const list = [];
                const periode = -Math.PI*2 ;
                let option = 1;
                let b = 0;
                const anim = new this.Anim({
                    duration :10000,
                }).when('progress',(p) =>{
                    list.forEach((f)=>{
                        f(p*periode, option);
                    });
                }).when('onEnd',(p , e) =>{
                    option = 0;
                    b++;
                    if (b==2) {
                        option = -1;
                        anim.remove(e);
                    }
                    anim.start();
                });
                this.when('views', (views) => {
                    views.forEach((view, i)=>{
                        const fase = ( (Math.PI*2)/views.length )*i;
                        list.push((angle,option) => {
                            if (option == 1 &&  Math.abs(angle)<=fase) {
                                view.style.transform =  'translate3d('+(((i/views.length)*2*Math.PI)+angle)*this.radius+'px,'+0+'px,'+this.radius+'px)';
                            }else if (option == -1 &&  Math.abs(angle)>=fase) {
                                view.style.transform =  'translate3d('+(((i/views.length)*2*Math.PI)+angle)*this.radius+'px,'+0+'px,'+this.radius+'px)';
                            }else  {
                                angle +=fase;
                                const x = this.radius*Math.sin(angle);
                                const z = this.radius*(Math.cos(angle));
                                const y = 0;
                                view.style.transform =  'translate3d('+x+'px,'+y+'px,'+z+'px) rotateY('+(angle)+'rad)';
                            }
                        });
                    });
                    console.log('views : ' , list);
                    anim.start();
                });
            }
        };
        return { tree, action };
    }
}

export default RotatifViewer ;