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
        {title: 'младенцы', img: 'images/categories2/1.jpg'},
        {title: 'дети 1-3', img: 'images/categories2/2.jpg'},
        {title: 'дети 1-7', img: 'images/categories2/3.jpg'},
        {title: 'дети 7-13', img: 'images/categories2/4.jpg'}
    ],

    choose: function(id) {
        this.setState({selected: id, isFadeOut: true});
    },

    fadeOut: function() {
        this.setState({
            isFadeOut: true
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
                    if (this.state.selected===i)
                        st = {transformOrigin: transformOrigins[i]};

                    return (
                        <div onClick={this.choose.bind(this,i)} style={st} className={className}>
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