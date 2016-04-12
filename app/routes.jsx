var React = require('react');
var ReactRouter = require('react-router');

var { Route, DefaultRoute, Router } = ReactRouter;

var MainLayout = require('layouts/Main/Main');
var AdminLayout = require('layouts/Admin/Admin');
var TestLayout = require('layouts/Test/Test');

var routes = (
    <Route >
        <Route name="main" path="/" handler = {MainLayout}  >
            <DefaultRoute  path="main" ></DefaultRoute>

            <Route handler = {MainLayout} name="gallery" path="gallery">
            </Route>
            <Route handler = {MainLayout} name="gallery-photos" path="gallery/:category">
            </Route>
            <Route handler = {MainLayout} name="gallery-photo" path="gallery/:category/:photoId">
            </Route>

            <Route name="services" handler = {MainLayout} ></Route>
            <Route name="feedback" handler = {MainLayout} ></Route>
            <Route name="contacts" handler = {MainLayout} ></Route>

        </Route>
        <Route handler = {AdminLayout} name="admin">
        </Route>
    </Route>
);

module.exports = routes;