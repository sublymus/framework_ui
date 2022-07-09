import BaseComponent from '/views/components/baseComponent/baseComponent.js'
class InputUi extends BaseComponent {
    constructor(data) {
        super({
            type: 'text',
            hint: '',
            icon: null,
            name: 'input'
        }, data);
    }

    elementTree(_, rootName, $, $All) {
        const tree = _('div', rootName,
            _('div', 'icon'),
            _('input'),
            _('div', 'eye'),
        );

        const action = {
            ['.icon']: (elem) => {
                this.when('icon', (icon) => {
                    if (icon == null) {
                        $('.icon').display = 'none';
                    } else {
                        $('.icon').display = 'block';
                        $('.icon').style.background = `no-repeat center/contain url('/views/components/inputUi/img/${icon}.png')`;
                    }
                });
            },
            ['input']: (input) => {

                this.when('name', (name) => {
                    input.name = name;
                });
                this.when('type', (type) => {
                    input.type = type;
                    if (type == 'password') {
                        $('.eye').display = 'block';
                    } else {
                        $('.eye').display = 'none';
                    }
                });
                this.when('hint', (hint) => {
                    input.placeholder = hint;
                });
            },
            ['.eye']: (elem) => {
                $('.eye').addEventListener('click', () => {
                   // $('input').type = $('input').type == 'password' ? 'text' : 'password';
                });

            }
        };
        return { tree, action };
    }
}

export default InputUi;