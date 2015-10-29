var React = require('react');

var Component = React.createClass({
    render: function() {

        var options = [
            'option1',
            'option2',
            'option3',
            'option4'
        ];

        return (
            <div className="layout-main">
                <div className = "header">
                    {options.map((opt)=>{
                        return <button className="header-menu-btn">{opt}</button>
                    })}
                </div>
                <img className = "main-image" src="images/main.jpg" ></img>
            </div>
        );
    }
});

module.exports = Component;