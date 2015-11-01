var React = require('react');
var ReactRouter = require('react-router');
var routes = require('./routes');


ReactRouter.run(routes, (Handler)=>{
    React.render(<Handler />, document.getElementById("app"));
});