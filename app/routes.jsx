console.log('routes');
var React = require('react');
var ReactRouter = require('react-router');

var { Route, DefaultRoute, Router } = ReactRouter;

var MainLayout = require('layouts/MainLayout');

var routes = (
    <Route name="app" path="app" handler = {MainLayout} >

    </Route>
);

module.exports = routes;