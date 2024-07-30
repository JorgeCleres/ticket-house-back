import express from "express";
import ticket from "./ticketRoutes.js";
import user from './userRoutes.js'

const routes = (app) => {
    app.route("/").get((req, res) => res.status(200).send("Tickets"));

    app.use(express.json());
    app.use(ticket);
    app.use(user);
};

export default routes;

