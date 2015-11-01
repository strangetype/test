var React = require('react');
var ReactRouter = require('react-router');

var { Route, DefaultRoute, Router } = ReactRouter;

var MainLayout = require('layouts/Main/Main');

var routes = (
    <Route name="app" path="app" handler = {MainLayout} >
        <Route name="gallery" path="gallery"></Route>
    </Route>
);

module.exports = routes;