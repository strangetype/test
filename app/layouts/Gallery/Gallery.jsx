var React = require('react');
var cx = require('classnames');
var _ = require('lodash');

var Component = React.createClass({

    getInitialState: function() {
        return {
            selected: false
        }
    },

    categories: [
        {title: 'Младенцы', img: 'images/categories/1.jpg'},
        {title: 'Дети', img: 'images/categories/2.jpg'},
        {title: 'Семейные', img: 'images/categories/3.jpg'},
        {title: 'Фотокниги', img: 'images/categories/4.jpg'}
    ],

    choose: function(id) {
        this.setState({selected: id});
        if (typeof(this.props.onSelect)==='function') {
            this.props.onSelect(id);
        }
    },

    render: function() {

        var layoutClass = cx('layout-gallery',{
            'layout-gallery--fade-out': this.state.selected!==false
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

                    var st = {transformOrigin: transformOrigins[i]};

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