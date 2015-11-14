var React = require('react');
var cx = require('classnames');
var _ = require('lodash');

var {Navigation} = require('react-router');

var http = require('superagent');

var Component = React.createClass({
    mixins: [
        Navigation,
        React.addons.LinkedStateMixin
    ],


    getDefaultProps: function() {

    },

    componentWillMount: function() {

        console.log('admin');
/*
        http.post('BE/index.php')
            .set('Content-Type', 'application/json')
            //.type('json')
            .send({action: 'admin-authorisation',
                data: {username: 'maria', password: '123456'}
            })
            .end((a,b)=>{
                console.log(JSON.parse(b.text));

            });
            */
        http.post('BE/index.php')
            .set('Content-Type', 'application/json')
            //.type('json')
            .send({action: 'admin-is-auth'})
            .end((a,b)=>{
                console.log(JSON.parse(b.text));

            });
    },

    componentDidMount: function() {

    },

    render: function() {


        return (
            <div  >
                <h1>Admin! gfvccxfdg</h1>
            </div>
        );
    }
});

module.exports = Component;