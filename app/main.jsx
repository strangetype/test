var React = require('react');
var ReactRouter = require('react-router');
var routes = require('./routes');


ReactRouter.run(routes, (Handler, a)=>{
    React.render(<Handler {...a} />, document.getElementById("app"));
});