import * as express from "express";
import * as http from "http";
import * as storage from "node-persist";
import * as crypto from "crypto";
import * as path from "path";
import {
  defaultRecettes,
  defaultCategoryMap,
  defaultIngredientsToValidate,
} from "./default-values";

// Disclaimer: I know there are race conditions in this files but I don't care

require("source-map-support").install(); // Typescript source maps
process.on("unhandledRejection", console.error); // Better logging in promises
process.setMaxListeners(0); // Mem leak erros

Init();

async function Init() {
  const app = express();
  http.createServer(app);

  const port = process.env["PORT"] || 4000;

  await storage.init({
    dir: "./persist",
    stringify: JSON.stringify,
    parse: JSON.parse,
    encoding: "utf8",
    logging: false, // can also be custom logging function
  });

  // Serve client files
  app.use(express.static("../build"));

  const server = app.listen(port, () => {
    console.log(
      `${new Date().toISOString()}: Koors is running at localhost: ${port}`
    );
  });

  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    })
  );

  // Router
  app.get("/api/", function (req, res) {
    res.status(200).send("Welcome to koors API");
  });

  app.get("/api/password", async (req, res) => {
    const auth = req.headers["auth"];
    const user = req.headers["user"];

    if (!(await isAuthenticated(user, auth))) {
      console.log("wrong password");
      res.status(403).send();
      return;
    }
    res.status(200).send();
  });

  // Public
  app.post("/api/register", async (req, res) => {
    const auth = req.headers["auth"];
    const user = req.headers["user"];

    let users: { [key: string]: string } = {};
    try {
      users = await storage.getItem("users");
    } catch (err) {
      // if it's the first user, create the file
      try {
        await storage.setItem("users", {});
      } catch (err) {
        console.log("Unexpected error during register", err);
        res.status(500).send();
        return;
      }
    }

    if (!users) users = {};

    // if the user already exist
    if (typeof user != "string" || !!users[user]) {
      res.status(400).send(`user ${user} already exist`);
      return;
    }

    users[user] = auth as string;

    await storage.setItem("users", users);

    // Default values
    await storage.setItem("recettes-" + user, defaultRecettes);
    await storage.setItem(
      "ingredientsToValidate-" + user,
      defaultIngredientsToValidate
    );
    await storage.setItem("categoryMap-" + user, defaultCategoryMap);

    res.status(200).send();
    return;
  });

  // Public
  app.get("/api/recettes", async (req, res) => {
    const user = req.headers["user"];
    const recettes = await storage.getItem("recettes-" + user);
    res.status(200).send(recettes || []);
  });

  // Authenticated
  app.post("/api/recettes", async (req, res) => {
    const auth = req.headers["auth"];
    const user = req.headers["user"];

    if (!(await isAuthenticated(user, auth))) {
      res.status(403).send();
      return;
    }

    console.log("Update recettes");

    const value: any = req.body;
    await storage.setItem("recettes-" + user, value);
    res.status(200).send();
  });

  // Authenticated
  app.delete("/api/recettes/:name", async (req, res) => {
    const auth = req.headers["auth"];
    const user = req.headers["user"];

    if (!(await isAuthenticated(user, auth))) {
      res.status(403).send();
      return;
    }

    const name: string = req.params.name;
    console.log("Delete recette", name);

    let recettes = await storage.getItem("recettes-" + user);

    const deleteIndex = recettes.findIndex((x: any) => x.name == name);

    if (deleteIndex != -1) recettes.splice(deleteIndex, 1);
    else console.log("Recette not found", name);

    await storage.setItem("recettes-" + user, recettes);

    res.status(200).send();
  });

  // public
  app.get("/api/ingredients", async (req, res) => {
    const user = req.headers["user"];

    const ingredientsToValidate = await storage.getItem(
      "ingredientsToValidate-" + user
    );
    const categoryMap = await storage.getItem("categoryMap-" + user);

    res.status(200).send({
      ingredientsToValidate: ingredientsToValidate || [],
      categoryMap: categoryMap || {},
    });
  });

  // Authenticated
  app.post("/api/ingredients", async (req, res) => {
    const auth = req.headers["auth"];
    const user = req.headers["user"];

    if (!(await isAuthenticated(user, auth))) {
      res.status(403).send();
      return;
    }

    console.log("Update ingredients");

    const value: { ingredientsToValidate: any; categoryMap: any } = req.body;
    await storage.setItem(
      "ingredientsToValidate-" + user,
      value.ingredientsToValidate
    );
    await storage.setItem("categoryMap-" + user, value.categoryMap);
    res.status(200).send();
  });

  // Public
  app.get("/api/state/", async (req, res) => {
    const user = req.headers["user"];

    const state = await storage.getItem("state-" + user);
    res.status(200).send(state || {});
  });

  // Public
  app.post("/api/state/", async (req, res) => {
    const user = req.headers["user"];

    let currState = await storage.getItem("state-" + user);
    if (!currState) currState = {};

    let newState: any = req.body;
    if (!newState) newState = {};

    // Rollback if we are late with this update compare to what we have in state
    // DISCLAIMER: this will break if client clock is not sync
    for (let itemKey of Object.keys(currState)) {
      if (
        newState[itemKey] &&
        newState[itemKey].updateTime &&
        currState[itemKey].updateTime &&
        currState[itemKey].updateTime > newState[itemKey].updateTime
      )
        newState[itemKey] = currState[itemKey];
    }

    await storage.setItem("state-" + user, newState);
    res.status(200).send();
  });

  // Any request that didn't match an API return index.html
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "..", "build", "index.html"));
  });

  async function isAuthenticated(
    user: string | string[],
    hash: string | string[]
  ) {
    if (!user || typeof user != "string" || !hash || typeof hash != "string") {
      return false;
    }

    const users = await storage.getItem("users");
    const passwordHash256 = users[user];

    if (hash != passwordHash256) return false;
    return true;
  }
}
