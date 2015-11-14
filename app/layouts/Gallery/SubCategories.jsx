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

    _getWindowHeight: function()  {
        return window.innerHeight || document.body.clientHeight;
    },

    _getWindowWidth: function()  {
        return window.innerWidth || document.body.clientWidth;
    },

    choose: function(category,id) {
        var el = this.refs['category_'+id].getDOMNode();
        var y = (el.offsetTop-this.getDOMNode().scrollTop)/(this._getWindowHeight()-el.offsetHeight);
        y = y*100;
        var x = ((el.offsetLeft-210))/(this._getWindowWidth()-el.offsetWidth-210);
        x = x*100;
        el.style.transformOrigin = x+'% '+y+'%';
        this.setState({selected: id, isFadeOut: true});
        if (typeof(this.props.onSelect)==='function') {
            this.props.onSelect(category,id);
        }
    },

    fadeOut: function() {
        this.setState({
            isFadeOut: true
        });
    },

    render: function() {

        var layoutClass = cx('layout-categories',{
            'layout-categories--4': this.props.subCategories.length<=4,
            'layout-categories--6': this.props.subCategories.length>4,
            'layout-categories--fade-out': this.state.isFadeOut!==false
        });

        var transformOrigins = [
            '0 0', '100% 0', '0 100%', '100% 100%'
        ];

        return (
            <div className={layoutClass}>
                {this.props.subCategories.map((c,i)=>{
                    var className = cx('category',{
                        'category--active': this.state.selected === i
                    });

                    return (
                        <div onClick={this.choose.bind(this,c,i)} ref={'category_'+i} className={className}>
                            <img className="category-image" src={'images/photos/'+c.imgSrc} />
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