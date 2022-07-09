
/*************************************************************************************
 * 
 *      composant utilisant 'BaseComponent' qui fournit un 
 *      partern M(model) V(view) C(controller)
 * 
 *      convention de nommage :
 *          -Component
 *          -Layout
 *          -Model
 *          -Data  
 *          -Tree
 *          -View
 *          -Action
 *          -Conntroller
 * 
*************************************************************************************/
import BaseComponent from '/views/components/baseComponent/baseComponent.js'
import InputUi from '/views/components/inputUi/inputUi.js'

class Login extends BaseComponent { // ce composant peut etre concideré comme un Layout..
    constructor(data) {
        /**
         * le 1er argument est le < Model >:
         *      - c'est lui qui contion les information qui definise l'etat actuel du composant
         *      - il contient les valeurs par defaut 
         *      - on peut le comparrer au 'state' en React 
         * 
         *  le 2eme argument est le < Data >:
         *      - c'est lui qui contient les donner qui vont actualiser le model
         *      - on peut le comparer au 'props' en React 
         */
        super({
             // information sur le status du Login
             // on  veut 'creat' un user ou le 'connect'
            status: 'create',
            //liste des liens d'authentification
            authList: [],
        }, data);
    }
    /**
     * 
     * @param {Function} _ permet de creer des ElementHTML : _('type', 'class' , children)
     * @param {String} rootName le nom du composant formater pour le css : nom de class = 'MyBestComponent' , rootName = 'my-best-component'
     * @param {Function} $ cette fonction renplace le 'querySelector' retourn le ElementHTML qui convient;
     * @param {Function} $All  cette fonction renplace le 'querySelectorAll' retourn lesElemen tHTML qui correspondent;
     * @returns  //{ tree , action}  => {< View' >, < Conntroller >}
     * 
     * NB : la fonction < _ > ne prend pas les Id en compte juste les class
     * 
     * RAISON : si on a plusieurs Composant dans sur la meme page, il y aura aussi plusieurs Id sur la meme page.
     * 
     * SOLUTION : L'arboressance du composants ( du root au enfant ) ne dois pas contenir d'ID...
     * 
     * SAUF :  si vous gére un layout, Un < Layout  >etant ici Un composant qui dispose d'autre Composant ou elementHTML
     *          ce dernier peut alors definir des ID a ses enfant ou lui meme,
     *          puis qu'il n'ya qu'un Layout par page. a moin d'utilier les Frame pour en avoir plusieurs sans concurence Id
     */
    elementTree(_, rootName, $, $All) {
        // tree est la < View' >
        const tree = _('div', rootName,
            _('div', 'logo', _('div', 'icon'), 'Login by N.G'),
            _('div', 'info-page',
                _('div', 'page-title'),
                _('div', 'auth-list'),
                _('div', 'message', 'or use your email for registration'),
                // des composants dont le getView() est utiliser comme enfant de '.info-page'
                new InputUi({ type: 'text', icon: 'user', hint: 'Name', name: 'name' }).getView(),
                new InputUi({ type: 'email', icon: 'email', hint: 'Email', name: 'email' }).getView(),
                new InputUi({ type: 'password', icon: 'padlock', hint: 'Password', name: 'password' }).getView(),
                _('div', 'forget-btn', 'Forget your password?'),
                _('div', 'submit-button', "SINGN IN")
            ),
            _('div', 'prompt-page',
                _('div', 'prompt-cotainer',
                    _('div', 'prompt-sign',
                        _('div', 'title'),
                        _('div', 'message'),
                    )
                ),
                _('div', 'sign-button', "SINGN UP")
            ),
        );
        // action est objet qui contien les fonctions a appeler pour chaque elementHTML que l'on veut gerer
        //        il est sous la form  KEY 'un query selector'  = VALUE 'une fonction(elementHTML => { do here All you want})'
        const action = {

            ['.sign-button']: (elem) => {
                // ici on peut faire tout le control necessaire sur 'elem'
                // on peut aussi acceder a d'autre elementHTML : $('.info-page')
                elem.addEventListener('click', (e) => {
                    //  this.status est une property
                    // en outre un getter(qui retourn la valeur de la key 'staus' du < Model >)
                    // setter (qui modifie la valeur de la key 'staus' du < Model >)
                    // la property du < Model > fait aussi un :  this.emite(Key, model[Key]);  
                    // une emition d'evernement nommé selon la Key du model
                    this.status = this.status == 'create' ? 'connect' : 'create';
                });
            },
            ['.submit-button']: (elem) => {
                elem.addEventListener('click', () => {
                    const data = {
                        name: $('input[name^="name"]').value,
                        email: $('input[name^="email"]').value,
                        password: $('input[name^="password"]').value,
                        status: this.status,
                    };
                    // on emet un event nommer 'submit' qui propage la valeur 'data'
                    this.emite('submit', data);
                });
            },
            [rootName]: (elem, elems) => {
                // dans le cette fonction on gere tout ce qui est capture d'event

                // Anim est propriété de la classe BaseComponent
                // un Objet très pratique pour gere simpelent des Animations très complexe
                const anim = new this.Anim({
                    // option d'animation..
                    duration: 700
                }).when('progress', (p) => {
                    // p varie de 0 à 1
                    $('.prompt-sign .title').textContent = p >= 0.5 ? 'Hello, Friend!' : 'Welcome Back!';
                    $('.prompt-sign .message').innerHTML = p >= 0.5 ? 'Enter your personnal details<br/>and start journey with us' : 'To keeep connected with us please <br/>login with your personal info';
                    $('.page-title').textContent = p >= 0.5 ? 'Sign in to Diprella' : 'Create Account';
                    $('input[name^="name"]').parentNode.style.display = p >= 0.5 ? 'none' : 'inherit'
                    $('.forget-btn').style.display = p >= 0.5 ? 'inherit' : 'none'
                    $('.prompt-page').style.left = p * 60 + '%';
                    $('.info-page').style.right = 5 + (p * 40) + '%';
                    $('.prompt-page').style.width = 40 + 10 * Math.sin(Math.PI * p) + '%';
                    let a = p < 0.5 ? p * 2 : (1 - p) * 2;
                    let w = $('.prompt-page').style.width;
                    w = w.substring(0, w.length - 1)
                    const val = p < 0.5 ? (-a * 150) : (a * 150);
                    $('.prompt-sign').style.transform = 'translateX(' + (val) + '%)';
                });
                anim.emite('progress', 0);// on initialise l'animation;

                const submitedAnim = new this.Anim({
                    duration: 700
                }).when('progress', (p) => {
                    $('.prompt-page').style.top = -(p * 100) + '%';
                    $('.info-page').style.top = (p * 100) + '%';
                });

                /**
                 * la fonction this.when permert de capturer des evernement...
                 * exemple capture de plusieurs event : this.when( Event= 'E1 E2 E3 E4' , Listener = (value, détaille)=>{} , ChangeRequire )
                 * 
                 * parametre : 
                 *      - Event : un string enumerant les event que l'on veut gére.
                 *      - Listener : prend deux parametres :
                 *                 + Value 'la valeur emise'
                 *                 + Detaille 'un objet contenant':
                 *                      ~ 'value' la meme valeur capturer
                 *                      ~ 'lastValue' la valeur precedent
                 *                      ~ 'event' le nom de l'event : exemple 'E3'
                 *                      ~ 'uid' un ID_UNIQUE lié au listener 
                 *                      ~ 'count' le nombre d'appel au listener
                 */
                ///////////// status ////////////////
                this.when('status', (status, e) => {
                    
                    if (e.count > 0){ anim.toggle();}
                    //if(e.count ==3) this.remove(e)
                });

                ////////// submit /////////
                this.when('submit', (data) => {
                    const tab = []
                    for (const key in data) {
                        if (Object.hasOwnProperty.call(data, key)) {
                            const element = data[key];
                            tab.push(key, element);
                        }
                    }
                    //this.Server.send({ url : 'http://' , logic : (formData)=>{ /**send code */}})
                    
                    submitedAnim.start();
                    submitedAnim.when('onEnd', () => {
                        this.emite('finish', tab);
                    });
                });

                //////////// authList ////////////////
                
                this.when('authList', (list) => {
                    list.forEach(auth => {
                        const icon = _('div', 'icon');
                        icon.addEventListener('click', (e) =>{
                            this.emite(auth.name , auth.name);
                            auth.onClick(e)
                        });
                        icon.style.background = `no-repeat center/60% url('${auth.urlIcon}')`;
                        $('.auth-list').append(icon);
                    });
                });

            },

        }
    
        return { tree, action };
    }
}

/******** NB GENERAL*********
 * 
 * le model emet un event pour chacune des ses KEY après appel  a la fonction 'elementTree'
 */

export default Login;