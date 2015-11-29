var React = require('react');
var cx = require('classnames');
var _ = require('lodash');

var _maxXSize = 4;

var scroll = require('scroll');

var _getRandomImg = function() {
    this.img = {
        x: Math.round(Math.random()*(_maxXSize-3))+1,
        y: Math.round(Math.random())+1,
        color: 'rgb('+Math.round(Math.random()*255)+','+Math.round(Math.random()*255)+','+Math.round(Math.random()*255)+')'
    };
    return this.img;
};

var Services = React.createClass({

    getInitialState: function() {
        return {
            isFadeOut: false
        }
    },

    fadeIn: function() {
        this.setState({isFadeOut: false});
    },

    fadeOut: function() {
        this.setState({isFadeOut: true});
    },

    render: function() {

        var layoutClass = cx('layout-services',{
            'layout-services--fade-out': this.state.isFadeOut!==false
        });

        return (
            <div className={layoutClass}>
                <div className="content-container">
                    <h2>Детская и семейная фотосъёмка</h2>
                    <ul>
                        <li>Фотосъемка продолжительностью 1,5-2 часа в студии или на природе (аренда студии не включена в стоимость)</li>
                        <li>Лучшие 20 кадров с детальной ретушью и применением художественных элементов в моем стиле</li>
                        <li>Уменьшенные web-версии всех обработанных фотографий для размещения в сети Интернет без потери качества</li>
                        <li>Художественная цветокоррекция всех фотографий</li>
                        <li>Весь материал в электронном виде (передается через файлообменник)</li>
                        <li>срок исполнения – до 3 недель</li>
                        <li>Стоимость - 3000 руб.</li>
                    </ul>
                </div>
            </div>
        );
    }
});

module.exports = Services;