var React = require('react');
var cx = require('classnames');
var _ = require('lodash');

var TimerMixin = require('react-timer-mixin');

var _maxXSize = 4;
var BE = require('utils/BE');

var Services = React.createClass({

    mixins: [
        TimerMixin
    ],

    getInitialState: function() {
        return {
            isFadeOut: false,
            isAddForm: false,
            feedback: {},
            notify: null
        }
    },

    fadeIn: function() {
        this.setState({isFadeOut: false});
    },

    fadeOut: function() {
        this.setState({isFadeOut: true});
    },

    leaveFeedback: function() {
        BE.leaveFeedback(this.state.feedback).then((fbs)=>{
            this.setState({
                notify: "Спасибо за отзыв. Вскоре он появится на сайте."
            });
            this.setTimeout(()=>{
                this.setState({
                    isAddForm: false,
                    notify: null
                });
            },5000);

        });
    },

    toggleForm: function() {
        this.setState({
            isAddForm: !this.state.isAddForm,
            tip: false
        });
    },
    onInputChange: function(field,ev) {
        var fb = this.state.feedback;
        fb[field] = ev.target.value;
        this.setState({feedback: fb});
    },

    showTip: function() {
        this.setState({
            tip: true
        });
    },

    render: function() {

        var layoutClass = cx('layout-feedback',{
            'layout-feedback--fade-out': this.state.isFadeOut!==false
        });

        return (
            <div className={layoutClass}>
                <div className="feedback-actions">
                    <h2 className="feedback-title">Отзывы</h2>
                    <button onClick={this.toggleForm} className="feedback-btn">Оставить отзыв</button>
                </div>
                <div className="content-container">
                    {!!(this.props.feedbacks && this.props.feedbacks.length) && this.props.feedbacks.map((f)=> {
                        if (!f.confirmed) return null;
                        return <div className="feedback">
                            {(!f.photo) && <img className="feedback-photo" src="images/img-placeholder.png" />}
                            {(f.photo) && <img className="feedback-photo" src={'images/client_photo/'+f.photo} />}
                            <div className="feedback-message">
                                <h2 className="feedback-client-name">{f.name}</h2>
                                {f.text}
                            </div>
                        </div>
                    })}
                </div>
                {(this.state.isAddForm) && <div className="feedback-add-form">
                    <form onSubmit={this.leaveFeedback}>
                        {(!this.state.notify) && <div>
                            <input placeholder="ваше имя" className="feedback-form-name" onChange={this.onInputChange.bind(this,'name')} />
                            <textarea placeholder="отзыв" onChange={this.onInputChange.bind(this,'text')} className="feedback-form-text" ></textarea>
                            {!!(this.state.feedback.name && this.state.feedback.text) && <button type="submit" className="feedback-btn btn-submit">отправить</button>}
                            {!(this.state.feedback.name && this.state.feedback.text) && <button onClick={this.showTip} className="feedback-btn btn-submit btn-disabled">отправить</button>}
                            <button onClick={this.toggleForm} type="submit" className="feedback-btn btn-cancel">отмена</button>
                            {!!(this.state.tip) && <div className="tip">
                                <i>введите ваше имя и текст отзыва</i>
                            </div>}
                        </div>}
                        {(this.state.notify) && <div className = "feedback-form-notify">
                            {this.state.notify}
                        </div>}
                    </form>
                </div>}
            </div>
        );
    }
});

module.exports = Services;