var React = require('react');
var cx = require('classnames');
var _ = require('lodash');

var Component = React.createClass({

    getInitialState: function() {
        return {
            selected: false,
            isFadeOut: false
        }
    },

    categories: [
        {title: 'Младенцы', name: 'babies', img: 'images/categories/1.jpg'},
        {title: 'Дети', name: 'childs', img: 'images/categories/2.jpg'},
        {title: 'Семейные', name: 'family', img: 'images/categories/3.jpg'},
        {title: 'Фотокниги', name: 'books', img: 'images/categories/4.jpg'}
    ],

    fadeIn: function() {
        this.setState({isFadeOut: false});
    },

    fadeOut: function() {
        this.setState({isFadeOut: true});
    },

    choose: function(id,name) {
        this.setState({selected: id, isFadeOut: true},()=>{
            if (typeof(this.props.onSelect)==='function') {
                this.props.onSelect(name);
            }
        });
    },

    render: function() {

        var layoutClass = cx('layout-categories',{
            'layout-categories--fade-out': this.state.isFadeOut!==false
        });

        var transformOrigins = [
            '0 0', '100% 0', '0 100%', '100% 100%'
        ];

        return (
            <div className={layoutClass}>
                {this.categories.map((c,i)=>{
                    var className = cx('category',{
                        'category--active': this.state.selected === i
                    });

                    var st = {};
                    if (i===this.state.selected)
                        st = {transformOrigin: transformOrigins[i]};

                    return (
                        <div onClick={this.choose.bind(this,i,c.name)} style={st} className={className}>
                            <img className="category-image" src={c.img} />
                            <h2 className="category-title">
                                {c.title}
                            </h2>
                        </div>
                    );
                })}
            </div>
        );
    }
});

module.exports = Component;