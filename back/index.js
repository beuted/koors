"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const storage = require("node-persist");
const crypto = require("crypto");
const passwordHash256 = '0e01dc2e19ec47028590353b9d8f86f556dde380ad0b7c4cd063e31c1faa1b8b';
process.on('unhandledRejection', console.error); // Better logging in promises
process.setMaxListeners(0); // Mem leak erros
Init();
function Init() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = express();
        http.createServer(app);
        const port = process.env['PORT'] || 3000;
        yield storage.init({
            dir: './persist',
            stringify: JSON.stringify,
            parse: JSON.parse,
            encoding: 'utf8',
            logging: false, // can also be custom logging function
        });
        // Serve client files
        app.use(express.static('../build'));
        const server = app.listen(port, () => {
            console.log(`${(new Date()).toISOString()}: Koors is running at localhost: ${port}`);
        });
        app.use(express.json());
        app.use(express.urlencoded({
            extended: true,
        }));
        // Router
        app.get("/api/", function (req, res) {
            res.status(200).send("Welcome to koors API");
        });
        app.get("/api/password", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const password = req.headers["auth"];
            const hash = crypto.createHmac('sha256', String(password)).digest('hex');
            if (hash == passwordHash256)
                res.status(200).send();
            else
                res.status(403).send();
        }));
        app.get("/api/recettes", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const recettes = yield storage.getItem('recettes');
            res.status(200).send(recettes);
        }));
        app.post("/api/recettes", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const password = req.headers["auth"];
            const hash = crypto.createHmac('sha256', String(password)).digest('hex');
            if (hash != passwordHash256)
                res.status(403).send();
            console.log('Update recettes');
            const value = req.body;
            yield storage.setItem('recettes', value);
            res.status(200).send();
        }));
        app.delete("/api/recettes/:name", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const password = req.headers["auth"];
            const hash = crypto.createHmac('sha256', String(password)).digest('hex');
            if (hash != passwordHash256)
                res.status(403).send();
            const name = req.params.name;
            console.log('Delete recette', name);
            let recettes = yield storage.getItem('recettes');
            const deleteIndex = recettes.findIndex((x) => x.name == name);
            if (deleteIndex != -1)
                recettes.splice(deleteIndex, 1);
            else
                console.log('Recette not found', name);
            yield storage.setItem('recettes', recettes);
            res.status(200).send();
        }));
        app.get("/api/ingredients", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const ingredientsToValidate = yield storage.getItem('ingredientsToValidate');
            const categoryMap = yield storage.getItem('categoryMap');
            res.status(200).send({
                ingredientsToValidate,
                categoryMap
            });
        }));
        app.post("/api/ingredients", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const password = req.headers["auth"];
            const hash = crypto.createHmac('sha256', String(password)).digest('hex');
            if (hash != passwordHash256)
                res.status(403).send();
            console.log('Update ingredients');
            const value = req.body;
            yield storage.setItem('ingredientsToValidate', value.ingredientsToValidate);
            yield storage.setItem('categoryMap', value.categoryMap);
            res.status(200).send();
        }));
        app.get("/api/state/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = encodeURIComponent(req.params.id);
            const state = yield storage.getItem('state');
            res.status(200).send(state);
        }));
        app.post("/api/state/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = encodeURIComponent(req.params.id);
            const value = req.body;
            yield storage.setItem('state', value);
            res.status(200).send();
        }));
        // TODO that would be cleaner to use this to avoid conflict when 2 user use the app at the same time
        app.post("/api/state/:id/add/:name", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = encodeURIComponent(req.params.id);
            const name = encodeURIComponent(req.params.name);
            const value = req.body;
            const state = yield storage.getItem('state');
            if (state[name]) {
                state[name].count += value.count;
                state[name].checked = value.checked;
            }
            else {
                state[name] = { count: value.count, checked: value.checked };
            }
            yield storage.setItem('state', value);
            res.status(200).send();
        }));
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLG1DQUFtQztBQUNuQyw2QkFBNkI7QUFDN0Isd0NBQXdDO0FBQ3hDLGlDQUFpQztBQUVqQyxNQUFNLGVBQWUsR0FBRyxrRUFBa0UsQ0FBQztBQUUzRixPQUFPLENBQUMsRUFBRSxDQUFDLG9CQUFvQixFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLDZCQUE2QjtBQUM5RSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCO0FBRTdDLElBQUksRUFBRSxDQUFDO0FBRVAsU0FBZSxJQUFJOztRQUNqQixNQUFNLEdBQUcsR0FBRyxPQUFPLEVBQUUsQ0FBQztRQUN0QixJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRXZCLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDO1FBRXpDLE1BQU0sT0FBTyxDQUFDLElBQUksQ0FBQztZQUNqQixHQUFHLEVBQUUsV0FBVztZQUNoQixTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7WUFDekIsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO1lBQ2pCLFFBQVEsRUFBRSxNQUFNO1lBQ2hCLE9BQU8sRUFBRSxLQUFLLEVBQUcsc0NBQXNDO1NBQ3hELENBQUMsQ0FBQztRQUVILHFCQUFxQjtRQUNyQixHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUVwQyxNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUU7WUFDbkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFDLFdBQVcsRUFBRSxvQ0FBb0MsSUFB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