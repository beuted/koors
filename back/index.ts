import * as express from "express";
import * as http from "http";
import * as path from "path";
import { DatabaseService } from "./database";
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

  // Initialize SQLite database
  const storage = new DatabaseService("./data/koors.db");

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

    if (typeof user !== "string" || typeof auth !== "string") {
      res.status(400).send("Invalid user or auth headers");
      return;
    }

    try {
      // Check if user already exists
      const existingUser = await storage.getUser(user);
      if (existingUser) {
        res.status(400).send(`user ${user} already exist`);
        return;
      }

      // Create new user
      await storage.createUser(user, auth);

      // Set default values for the new user
      await storage.setRecipes(user, defaultRecettes);
      await storage.setIngredientsToValidate(
        user,
        defaultIngredientsToValidate
      );
      await storage.setCategoryMap(user, defaultCategoryMap);

      res.status(200).send();
    } catch (err) {
      console.log("Unexpected error during register", err);
      res.status(500).send();
    }
  });

  // Public
  app.get("/api/recettes", async (req, res) => {
    const user = req.headers["user"];
    if (typeof user !== "string") {
      res.status(400).send("Invalid user header");
      return;
    }
    const recettes = await storage.getRecipes(user);
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
    await storage.setRecipes(user as string, value);
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

    await storage.deleteRecipe(user as string, name);

    res.status(200).send();
  });

  // public
  app.get("/api/ingredients", async (req, res) => {
    const user = req.headers["user"];

    const ingredientsToValidate = await storage.getIngredientsToValidate(
      user as string
    );
    const categoryMap = await storage.getCategoryMap(user as string);

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
    await storage.setIngredientsToValidate(
      user as string,
      value.ingredientsToValidate
    );
    await storage.setCategoryMap(user as string, value.categoryMap);
    res.status(200).send();
  });

  // Public
  app.get("/api/state/", async (req, res) => {
    const user = req.headers["user"];

    const state = await storage.getUserState(user as string);
    res.status(200).send(state || {});
  });

  // Public
  app.post("/api/state/", async (req, res) => {
    const user = req.headers["user"];

    let currState = await storage.getUserState(user as string);
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

    await storage.setUserState(user as string, newState);
    res.status(200).send();
  });

  async function isAuthenticated(
    user: string | string[],
    hash: string | string[]
  ) {
    if (!user || typeof user != "string" || !hash || typeof hash != "string") {
      return false;
    }

    const users = await storage.getAllUsers();
    const passwordHash256 = users[user];

    if (hash != passwordHash256) return false;
    return true;
  }
}
