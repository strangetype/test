console.log('!!!');

var React = require('react');
var ReactRouter = require('react-router');
var routes = require('./routes');


ReactRouter.run(routes, (Handler)=>{
    console.log('router');
    React.render(<Handler />, document.getElementById("app"));
});