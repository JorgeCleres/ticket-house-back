import express from "express";
import ticket from "./ticketRoutes.js";

const routes = (app) => {
    app.route("/").get((req, res) => res.status(200).send("Tickets"));

    app.use(express.json());
    app.use(ticket);
};

export default routes;
