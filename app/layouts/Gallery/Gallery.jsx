var React = require('react');

var _ = require('lodash');

var Component = React.createClass({

    componentDidMount: function() {

    },

    categories: [
        {title: 'Младенцы', img: 'images/categories/1.jpg'},
        {title: 'Дети', img: 'images/categories/2.jpg'},
        {title: 'Семейные', img: 'images/categories/3.jpg'},
        {title: 'Фотокниги', img: 'images/categories/4.jpg'}
    ],

    render: function() {

        return (
            <div className="layout-gallery">
                {this.categories.map((c)=>{
                    return (
                        <div className="category">
                            <img className="category-image" src={c.img} />
                            <h2 className="category-title">
                                {c.title}
                            </h2>
                            <div className="category-border"></div>
                        </div>
                    );
                })}
            </div>
        );
    }
});

module.exports = Component;