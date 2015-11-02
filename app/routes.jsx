var React = require('react');
var ReactRouter = require('react-router');

var { Route, DefaultRoute, Router } = ReactRouter;

var MainLayout = require('layouts/Main/Main');

var routes = (
    <Route name="main" path="main" handler = {MainLayout} >
        <Route handler = {MainLayout} name="gallery" path="gallery">

        </Route>
        <Route handler = {MainLayout} name="gallery-subCategories" path="gallery/:category">

        </Route>
        <Route name="services"></Route>
        <Route name="feedback"></Route>
        <Route name="contacts"></Route>
    </Route>
);

module.exports = routes;