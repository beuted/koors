import * as express from 'express';
import * as http from 'http';
import * as storage from 'node-persist';
import * as crypto from 'crypto';

const passwordHash256 = '0e01dc2e19ec47028590353b9d8f86f556dde380ad0b7c4cd063e31c1faa1b8b';

process.on('unhandledRejection', console.error); // Better logging in promises
process.setMaxListeners(0); // Mem leak erros

Init();

async function Init() {
  const app = express();
  http.createServer(app);

  const port = process.env['PORT'] || 4000;

  await storage.init({
    dir: './persist',
    stringify: JSON.stringify,
    parse: JSON.parse,
    encoding: 'utf8',
    logging: false,  // can also be custom logging function
  });

  // Serve client files
  app.use(express.static('../build'));

  const server = app.listen(port, () => {
    console.log(`${(new Date()).toISOString()}: Koors is running at localhost: ${port}`);
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
    const password = req.headers["auth"];
    const hash = crypto.createHmac('sha256', String(password)).digest('hex');
    if (hash == passwordHash256)
      res.status(200).send();
    else
      res.status(403).send();
  });

  app.get("/api/recettes", async (req, res) => {
    const recettes = await storage.getItem('recettes');
    res.status(200).send(recettes);
  });

  app.post("/api/recettes", async (req, res) => {
    const password = req.headers["auth"];
    const hash = crypto.createHmac('sha256', String(password)).digest('hex');
    if (hash != passwordHash256)
      res.status(403).send();

    console.log('Update recettes');

    const value: any = req.body;
    await storage.setItem('recettes', value);
    res.status(200).send();
  });

  app.delete("/api/recettes/:name", async (req, res) => {
    const password = req.headers["auth"];
    const hash = crypto.createHmac('sha256', String(password)).digest('hex');
    if (hash != passwordHash256)
      res.status(403).send();

    const name: string = req.params.name
    console.log('Delete recette', name);

    let recettes = await storage.getItem('recettes');

    const deleteIndex = recettes.findIndex((x: any) => x.name == name);

    if (deleteIndex != -1)
      recettes.splice(deleteIndex, 1);
    else
      console.log('Recette not found', name);

    await storage.setItem('recettes', recettes);

    res.status(200).send();
  });

  app.get("/api/ingredients", async (req, res) => {
    const ingredientsToValidate = await storage.getItem('ingredientsToValidate');
    const categoryMap = await storage.getItem('categoryMap');
    res.status(200).send({
      ingredientsToValidate,
      categoryMap
    });
  });

  app.post("/api/ingredients", async (req, res) => {
    const password = req.headers["auth"];
    const hash = crypto.createHmac('sha256', String(password)).digest('hex');
    if (hash != passwordHash256)
      res.status(403).send();

    console.log('Update ingredients');

    const value: { ingredientsToValidate: any, categoryMap: any } = req.body;
    await storage.setItem('ingredientsToValidate', value.ingredientsToValidate);
    await storage.setItem('categoryMap', value.categoryMap);
    res.status(200).send();
  });

  app.get("/api/state/:id", async (req, res) => {
    const id: string = encodeURIComponent(req.params.id);
    const state = await storage.getItem('state');
    res.status(200).send(state);
  });

  app.post("/api/state/:id", async (req, res) => {
    const id: string = encodeURIComponent(req.params.id);
    const value: boolean = req.body;
    await storage.setItem('state', value);
    res.status(200).send();
  });

  // TODO that would be cleaner to use this to avoid conflict when 2 user use the app at the same time
  app.post("/api/state/:id/add/:name", async (req, res) => {
    const id: string = encodeURIComponent(req.params.id);
    const name: string = encodeURIComponent(req.params.name);
    const value: { count: number, checked: boolean } = req.body;

    const state = await storage.getItem('state');
    if (state[name]) {
      state[name].count += value.count;
      state[name].checked = value.checked
    } else {
      state[name] = { count: value.count, checked: value.checked }
    }
    await storage.setItem('state', value);
    res.status(200).send();
  });
}