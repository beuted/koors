import { Database } from "sqlite3";
import * as path from "path";

export interface User {
  username: string;
  passwordHash: string;
  created_at?: string;
  updated_at?: string;
}

export interface Recipe {
  id?: number;
  name: string;
  ingredients: { [key: string]: number };
  type?: string;
  link?: string;
  personnes?: number;
  username: string;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryMap {
  id?: number;
  ingredient: string;
  category: string;
  username: string;
  created_at?: string;
  updated_at?: string;
}

export interface IngredientToValidate {
  id?: number;
  ingredient: string;
  username: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserState {
  id?: number;
  username: string;
  state_key: string;
  state_value: string;
  update_time?: number;
  created_at?: string;
  updated_at?: string;
}

export class DatabaseService {
  private db: Database;

  constructor(dbPath: string = "./data/koors.db") {
    this.db = new Database(dbPath, (err) => {
      if (err) {
        console.error("Error opening database:", err);
      } else {
        console.log("Connected to SQLite database");
        this.initTables();
      }
    });
  }

  private initTables(): void {
    const createTables = `
      -- Users table
      CREATE TABLE IF NOT EXISTS users (
        username TEXT PRIMARY KEY,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Recipes table
      CREATE TABLE IF NOT EXISTS recipes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        ingredients TEXT NOT NULL, -- JSON string
        type TEXT,
        link TEXT,
        personnes INTEGER,
        username TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE,
        UNIQUE(name, username)
      );

      -- Category mapping table
      CREATE TABLE IF NOT EXISTS category_map (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ingredient TEXT NOT NULL,
        category TEXT NOT NULL,
        username TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE,
        UNIQUE(ingredient, username)
      );

      -- Ingredients to validate table
      CREATE TABLE IF NOT EXISTS ingredients_to_validate (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ingredient TEXT NOT NULL,
        username TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE,
        UNIQUE(ingredient, username)
      );

      -- User state table
      CREATE TABLE IF NOT EXISTS user_state (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        state_key TEXT NOT NULL,
        state_value TEXT NOT NULL, -- JSON string
        update_time INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE,
        UNIQUE(username, state_key)
      );

      -- Triggers for updated_at timestamps
      CREATE TRIGGER IF NOT EXISTS update_users_timestamp 
      AFTER UPDATE ON users
      BEGIN
        UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE username = NEW.username;
      END;

      CREATE TRIGGER IF NOT EXISTS update_recipes_timestamp 
      AFTER UPDATE ON recipes
      BEGIN
        UPDATE recipes SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
      END;

      CREATE TRIGGER IF NOT EXISTS update_category_map_timestamp 
      AFTER UPDATE ON category_map
      BEGIN
        UPDATE category_map SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
      END;

      CREATE TRIGGER IF NOT EXISTS update_ingredients_to_validate_timestamp 
      AFTER UPDATE ON ingredients_to_validate
      BEGIN
        UPDATE ingredients_to_validate SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
      END;

      CREATE TRIGGER IF NOT EXISTS update_user_state_timestamp 
      AFTER UPDATE ON user_state
      BEGIN
        UPDATE user_state SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
      END;
    `;

    this.db.exec(createTables, (err) => {
      if (err) {
        console.error("Error creating tables:", err);
      } else {
        console.log("Database tables initialized");
      }
    });
  }

  // User methods
  async createUser(username: string, passwordHash: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        "INSERT INTO users (username, password_hash) VALUES (?, ?)",
        [username, passwordHash],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  async getUser(username: string): Promise<User | null> {
    return new Promise((resolve, reject) => {
      this.db.get(
        "SELECT * FROM users WHERE username = ?",
        [username],
        (err, row: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(row || null);
          }
        }
      );
    });
  }

  async getAllUsers(): Promise<{ [key: string]: string }> {
    return new Promise((resolve, reject) => {
      this.db.all(
        "SELECT username, password_hash FROM users",
        [],
        (err, rows: any[]) => {
          if (err) {
            reject(err);
          } else {
            const users: { [key: string]: string } = {};
            rows.forEach((row) => {
              users[row.username] = row.password_hash;
            });
            resolve(users);
          }
        }
      );
    });
  }

  // Recipe methods
  async getRecipes(username: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        "SELECT * FROM recipes WHERE username = ?",
        [username],
        (err, rows: any[]) => {
          if (err) {
            reject(err);
          } else {
            const recipes = rows.map((row) => ({
              ...row,
              ingredients: JSON.parse(row.ingredients),
            }));
            resolve(recipes);
          }
        }
      );
    });
  }

  async setRecipes(username: string, recipes: any[]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run("BEGIN TRANSACTION");

        // Delete existing recipes for this user
        this.db.run("DELETE FROM recipes WHERE username = ?", [username]);

        // Insert new recipes
        const stmt = this.db.prepare(`
          INSERT INTO recipes (name, ingredients, type, link, personnes, username) 
          VALUES (?, ?, ?, ?, ?, ?)
        `);

        for (const recipe of recipes) {
          stmt.run([
            recipe.name,
            JSON.stringify(recipe.ingredients),
            recipe.type || null,
            recipe.link || null,
            recipe.personnes || null,
            username,
          ]);
        }

        stmt.finalize();

        this.db.run("COMMIT", (err) => {
          if (err) {
            this.db.run("ROLLBACK");
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });
  }

  async deleteRecipe(username: string, recipeName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        "DELETE FROM recipes WHERE username = ? AND name = ?",
        [username, recipeName],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  // Category map methods
  async getCategoryMap(username: string): Promise<{ [key: string]: string }> {
    return new Promise((resolve, reject) => {
      this.db.all(
        "SELECT ingredient, category FROM category_map WHERE username = ?",
        [username],
        (err, rows: any[]) => {
          if (err) {
            reject(err);
          } else {
            const categoryMap: { [key: string]: string } = {};
            rows.forEach((row) => {
              categoryMap[row.ingredient] = row.category;
            });
            resolve(categoryMap);
          }
        }
      );
    });
  }

  async setCategoryMap(
    username: string,
    categoryMap: { [key: string]: string }
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run("BEGIN TRANSACTION");

        // Delete existing category mappings for this user
        this.db.run("DELETE FROM category_map WHERE username = ?", [username]);

        // Insert new mappings
        const stmt = this.db.prepare(`
          INSERT INTO category_map (ingredient, category, username) 
          VALUES (?, ?, ?)
        `);

        for (const [ingredient, category] of Object.entries(categoryMap)) {
          stmt.run([ingredient, category, username]);
        }

        stmt.finalize();

        this.db.run("COMMIT", (err) => {
          if (err) {
            this.db.run("ROLLBACK");
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });
  }

  // Ingredients to validate methods
  async getIngredientsToValidate(username: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        "SELECT ingredient FROM ingredients_to_validate WHERE username = ?",
        [username],
        (err, rows: any[]) => {
          if (err) {
            reject(err);
          } else {
            const ingredients = rows.map((row) => row.ingredient);
            resolve(ingredients);
          }
        }
      );
    });
  }

  async setIngredientsToValidate(
    username: string,
    ingredients: string[]
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run("BEGIN TRANSACTION");

        // Delete existing ingredients for this user
        this.db.run("DELETE FROM ingredients_to_validate WHERE username = ?", [
          username,
        ]);

        // Insert new ingredients
        const stmt = this.db.prepare(`
          INSERT INTO ingredients_to_validate (ingredient, username) 
          VALUES (?, ?)
        `);

        for (const ingredient of ingredients) {
          stmt.run([ingredient, username]);
        }

        stmt.finalize();

        this.db.run("COMMIT", (err) => {
          if (err) {
            this.db.run("ROLLBACK");
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });
  }

  // User state methods
  async getUserState(username: string): Promise<{ [key: string]: any }> {
    return new Promise((resolve, reject) => {
      this.db.all(
        "SELECT state_key, state_value, update_time FROM user_state WHERE username = ?",
        [username],
        (err, rows: any[]) => {
          if (err) {
            reject(err);
          } else {
            const state: { [key: string]: any } = {};
            rows.forEach((row) => {
              try {
                const value = JSON.parse(row.state_value);
                if (row.update_time) {
                  value.updateTime = row.update_time;
                }
                state[row.state_key] = value;
              } catch (parseErr) {
                console.error("Error parsing state value:", parseErr);
              }
            });
            resolve(state);
          }
        }
      );
    });
  }

  async setUserState(
    username: string,
    state: { [key: string]: any }
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run("BEGIN TRANSACTION");

        // Delete all existing state entries for this user
        this.db.run("DELETE FROM user_state WHERE username = ?", [username]);

        // Insert new state entries
        const stmt = this.db.prepare(`
          INSERT INTO user_state (username, state_key, state_value, update_time) 
          VALUES (?, ?, ?, ?)
        `);

        for (const [key, value] of Object.entries(state)) {
          const updateTime = value.updateTime || null;
          stmt.run([username, key, JSON.stringify(value), updateTime]);
        }

        stmt.finalize();

        this.db.run("COMMIT", (err) => {
          if (err) {
            this.db.run("ROLLBACK");
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });
  }

  close(): void {
    this.db.close((err) => {
      if (err) {
        console.error("Error closing database:", err);
      } else {
        console.log("Database connection closed");
      }
    });
  }
}
