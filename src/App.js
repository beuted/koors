import "./App.css";
import { categories } from "./Recettes.js";
import { hashPassword } from "./Login.js";
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Divider from "@mui/material/Divider";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";

function App() {
  const [recettes, setRecettes] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [ingredientsToValidate, setIngredientsToValidate] = useState([]);
  const [items, setItems] = useState({});
  const [orderedItems, setOrderedItems] = useState([]);
  const [nameNewItem, setNameNewItem] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showNewIngredientModal, setShowNewIngredientModal] = useState(false);
  const [hasIngredientsToClean, setHasIngredientsToClean] = useState(false);
  const [deleteIngredientModal, setDeleteIngredientModal] = useState(false);
  const [showNewRecetteModal, setShowNewRecetteModal] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [itemsToValidate, setItemsToValidate] = useState([]);
  const [newRecetteIngredients, setNewRecetteIngredients] = useState({});
  const [quantityNewRecetteIngredient, setQuantityNewRecetteIngredient] =
    useState(1);
  const [nameNewRecetteIngredient, setNameNewRecetteIngredient] = useState("");
  const [nameNewRecette, setNameNewRecette] = useState("");
  const [typeNewRecette, setTypeNewRecette] = useState("default");
  const [linkNewRecette, setLinkNewRecette] = useState("");
  const [nbPersonnesNewRecette, setNbPersonnesNewRecette] = useState(0);
  const [nameNewIngredient, setNameNewIngredient] = useState("");
  const [categoryNewIngredient, setCategoryNewIngredient] = useState("");
  const [confirmNewIngredient, setConfirmNewIngredient] = useState("false");
  const [hashedPassword, setHashedPassword] = useState("");
  const [user, setUser] = useState("");
  const [adminValidated, setAdminValidated] = useState(false);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const delayBetweenRefresh = 5000; //ms

  let id = null; // setInverval Id

  let inputRef;

  useEffect(() => {
    const user = searchParams.get("user");
    if (user == null || user == "") {
      navigate("/"); // go back to user page
      return;
    } else {
      setUser(user);
    }

    // Hashed password doesn't have to be define if you are in spec mode
    const hash = localStorage.getItem("auth");
    setHashedPassword(hash);
  }, []);

  useEffect(() => {
    if (user == null || user.length == 0) return;

    if (id != null) {
      clearInterval(id);
      id = null;
    }

    // Start the refresh loop that will warn the server that something changed
    (async () => {
      await refreshFromServer();

      id = setInterval(refreshFromServer, delayBetweenRefresh);
      return () => clearInterval(id);
    })();
  }, [hashedPassword, user]);

  const refreshFromServer = async () => {
    // Ingredients
    try {
      const responseJson = await fetch("/api/ingredients", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          auth: hashedPassword,
          user: user,
        },
        method: "GET",
      });
      const response = await responseJson.json();

      let { ingredientsToValidate, categoryMap } = response;

      if (ingredientsToValidate)
        setIngredientsToValidate(ingredientsToValidate);

      if (categoryMap) setCategoryMap(categoryMap);
    } catch (err) {
      console.error(err);
      return;
    }

    // Items
    try {
      const responseJson = await fetch("/api/state", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          auth: hashedPassword,
          user: user,
        },
        method: "GET",
      });
      const response = await responseJson.json();

      // Hacky way to avoid setting item (and triggering hooks) every time the state is fetched
      if (response && JSON.stringify(response) != JSON.stringify(items)) {
        setItems(response);
      }
    } catch (err) {
      console.error(err);
      return;
    }

    // Recettes
    try {
      const responseJson = await fetch("/api/recettes", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          auth: hashedPassword,
          user: user,
        },
        method: "GET",
      });
      const response = await responseJson.json();

      let recettes = response;

      if (recettes) {
        // Sort alphabetically on name then on category
        recettes.sort((r1, r2) =>
          r1.name.toLowerCase() < r2.name.toLowerCase() ? 1 : -1
        );
        recettes.sort((r1, r2) =>
          (r1.type ?? "default") < (r2.type ?? "default") ? 1 : -1
        );
        setRecettes(recettes);
      }
    } catch (err) {
      console.error(err);
      return;
    }
  };

  useEffect(() => {
    (async () => {
      if (items && Object.keys(items).length > 0) {
        updateOrderedItemsKeysFromItems(items); // We update the ordered items

        try {
          const responseJson = await fetch("/api/state", {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              auth: hashedPassword,
              user: user,
            },
            method: "POST",
            body: JSON.stringify(items),
          });
          const response = await responseJson.text();
        } catch (err) {
          console.error(err);
        }
      }
    })();
  }, [items]);

  function updateOrderedItemsKeysFromItems(items) {
    var itemKeys = Object.keys(items);

    // Check if there is anything to clean
    setHasIngredientsToClean(
      itemKeys.findIndex(
        (key) => items[key].count == 0 || items[key].checked
      ) != -1
    );

    // Sort alphabetically on name then on category
    itemKeys.sort((i1, i2) => (i1.toLowerCase() < i2.toLowerCase() ? 1 : -1));

    // Defining a category for manually added item just for sorting
    itemKeys.sort((i1, i2) =>
      (categoryMap[i1] ?? "000") < (categoryMap[i2] ?? "000") ? 1 : -1
    );

    setOrderedItems(itemKeys);
  }

  useEffect(() => {
    if (itemsToValidate && itemsToValidate.length > 0) setShowModal(true);
    else setShowModal(false);
  }, [itemsToValidate]);

  function addItems(recetteName) {
    var newItems = Object.assign({}, items);

    let recette = recettes.find((x) => x.name === recetteName);

    if (recette.type != "singleItem")
      // If this is a single item recette don't validate
      setItemsToValidate(
        Object.keys(recette.ingredients).filter((x) =>
          ingredientsToValidate.includes(x)
        )
      );

    for (var item of Object.entries(recette.ingredients)) {
      if (!newItems[item[0]])
        newItems[item[0]] = { count: item[1], checked: false };
      else newItems[item[0]].count += item[1];
    }

    setItems(newItems);
  }

  function decreaseItem(itemName, evt) {
    var newItems = Object.assign({}, items);
    if (newItems[itemName].count == 0) return;
    newItems[itemName].count--;
    setItems(newItems);
    evt.stopPropagation();
  }

  function increaseItem(itemName, evt) {
    var newItems = Object.assign({}, items);
    newItems[itemName].count++;

    setItems(newItems);
    evt.stopPropagation();
  }

  function createNewItem() {
    if (!nameNewItem) return;

    var newItems = Object.assign({}, items);
    if (!newItems[nameNewItem])
      newItems[nameNewItem] = { count: 1, checked: false };
    else newItems[nameNewItem].count += 1;

    // Clear input
    setItems(newItems);
    setNameNewItem("");

    // Focus input
    inputRef.focus();
  }

  function copyToClipBoard() {
    var text = "";
    for (var item of Object.entries(items)) {
      if (item[1].count > 0) text += item[0] + " x" + item[1].count + "\n";
    }
    return copyToClipboardPrivate(text);
  }

  async function clean() {
    var newItems = Object.assign({}, items);

    // Remove checked items and items at 0
    for (var item of Object.entries(newItems)) {
      if (item[1].count == 0 || item[1].checked) {
        delete newItems[item[0]];
      }
    }

    setItems(newItems);

    // Hacky way to force the refresh of the items since setItems is skipped if items is empty
    try {
      const responseJson = await fetch("/api/state", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          auth: hashedPassword,
          user: user,
        },
        method: "POST",
        body: JSON.stringify(newItems),
      });
      const response = await responseJson.text();
    } catch (err) {
      console.error(err);
    }

    updateOrderedItemsKeysFromItems(newItems);
  }

  function exportToGKeep() {
    copyToClipBoard().then(() => {
      setTimeout(() => {
        window.open("http://keep.new");
      }, 500);
    });
  }

  function getCategoryEmoji(itemKey) {
    return categories[categoryMap[itemKey]];
  }

  function removeItem(itemKey) {
    var newItems = Object.assign({}, items);
    delete newItems[itemKey];

    setItems(newItems);
    var newItemsToValide = itemsToValidate.filter((x) => x !== itemKey);
    setItemsToValidate(newItemsToValide);
  }

  function validateItem(itemKey) {
    var newItemsToValide = itemsToValidate.filter((x) => x !== itemKey);
    setItemsToValidate(newItemsToValide);
  }

  function checkItem(itemKey) {
    var newItems = Object.assign({}, items);
    newItems[itemKey].checked = !newItems[itemKey].checked;

    setItems(newItems);
  }

  // return a promise
  function copyToClipboardPrivate(textToCopy) {
    // navigator clipboard api needs a secure context (https)
    if (navigator.clipboard && window.isSecureContext) {
      // navigator clipboard api method'
      return navigator.clipboard.writeText(textToCopy);
    } else {
      // text area method
      let textArea = document.createElement("textarea");
      textArea.value = textToCopy;
      // make the textarea out of viewport
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      return new Promise((res, rej) => {
        // here the magic happens
        document.execCommand("copy") ? res() : rej();
        textArea.remove();
      });
    }
  }

  function removeNewRecetteIngredients(name) {
    delete newRecetteIngredients[name];
    const updatedValue = Object.assign({}, newRecetteIngredients);
    setNewRecetteIngredients(updatedValue);
  }

  function addNewRecetteIngredients(name, quantity) {
    const updatedValue = Object.assign({}, newRecetteIngredients);
    if (updatedValue[name]) updatedValue[name] += quantity;
    else updatedValue[name] = quantity;
    setNewRecetteIngredients(updatedValue);

    // Reset input
    setNameNewRecetteIngredient("");
    setQuantityNewRecetteIngredient(1);
  }

  async function addNewRecette() {
    // Update state
    const newRecettes = Array.from(recettes);
    newRecettes.push({
      name: nameNewRecette,
      ingredients: newRecetteIngredients,
      type: typeNewRecette,
      link: linkNewRecette,
      personnes: nbPersonnesNewRecette,
    });
    setRecettes(newRecettes);

    // Update server
    try {
      const responseJson = await fetch("/api/recettes", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          auth: hashedPassword,
          user: user,
        },
        method: "POST",
        body: JSON.stringify(newRecettes),
      });
      const response = await responseJson.text();
    } catch (err) {
      console.error(err);
    }

    // Reset the fields
    setNameNewRecette("");
    setNewRecetteIngredients({});
    setTypeNewRecette("default");
    setLinkNewRecette("");
    setNbPersonnesNewRecette(0);
  }

  async function deleteRecette(name) {
    try {
      const response = await fetch("/api/recettes/" + name, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          auth: hashedPassword,
          user: user,
        },
        method: "DELETE",
      });

      if (response.status == 200) {
        let newRecettes = Array.from(recettes);
        const deleteIndex = recettes.findIndex((x) => x.name == name);
        newRecettes.splice(deleteIndex, 1);
        setRecettes(newRecettes);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function addNewIngredient() {
    if (categoryMap[nameNewIngredient]) return;

    categoryMap[nameNewIngredient] = categoryNewIngredient;

    if (confirmNewIngredient == "true")
      ingredientsToValidate.push(nameNewIngredient);

    // Update server
    try {
      const responseJson = await fetch("/api/ingredients", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          auth: hashedPassword,
          user: user,
        },
        method: "POST",
        body: JSON.stringify({
          ingredientsToValidate: ingredientsToValidate,
          categoryMap: categoryMap,
        }),
      });
      const response = await responseJson.text();
    } catch (err) {
      console.error(err);
    }

    // Reset the fields
    setNameNewIngredient("");
    setConfirmNewIngredient("false");
    setCategoryNewIngredient("000-none");
  }

  async function deleteIngredient() {
    if (!nameNewIngredient || nameNewIngredient == "") return;

    // TODO: vérifier qu'il n'ets pas dans une recette
    let recettesIncludingIngredient = [];
    for (let recette of recettes) {
      if (Object.keys(recette.ingredients).includes(nameNewIngredient)) {
        recettesIncludingIngredient.push(recette.name);
      }
    }

    if (recettesIncludingIngredient.length > 0) {
      alert(
        `Impossible de supprimer l'ingrédient ${nameNewIngredient}, supprimez d'abord les recettes qui le contienne: ${recettesIncludingIngredient
          .map((x) => `"${x}"`)
          .join(", ")}`
      );
      return;
    }

    let newCategoryMap = Object.assign({}, categoryMap);
    delete newCategoryMap[nameNewIngredient];

    let newIngredientsToValidate = ingredientsToValidate.filter(
      (x) => x != nameNewIngredient
    );

    // Update server to delete the ingredient
    try {
      const responseJson = await fetch("/api/ingredients", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          auth: hashedPassword,
          user: user,
        },
        method: "POST",
        body: JSON.stringify({
          ingredientsToValidate: newIngredientsToValidate,
          categoryMap: newCategoryMap,
        }),
      });
      const response = await responseJson.text();
    } catch (err) {
      console.error(err);
    }

    // Reset the fields
    setNameNewIngredient("");
    setConfirmNewIngredient("false");
    setCategoryNewIngredient("000-none");
  }

  async function testPassword() {
    try {
      const response = await fetch("/api/password", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          auth: hashedPassword,
          user: user,
        },
        method: "GET",
      });

      if (!response.ok) {
        alert("Mauvais mot de passe");
        setAdminValidated(false);
        return false;
      } else {
        localStorage.setItem("auth", hashedPassword);
        setAdminValidated(true);
        return true;
      }
    } catch (err) {
      alert("Mauvais mot de passe");
      setAdminValidated(false);
      return false;
    }
  }

  async function testPasswordAndSetShowAdmin(adminValidated) {
    if (adminValidated) {
      setAdminValidated(false);
      return;
    }

    const success = await testPassword();
    if (!success) setShowAdmin(true);
  }

  function disconnect() {
    localStorage.removeItem("user");
    localStorage.removeItem("auth");
    navigate({ pathname: "/" });
  }

  return (
    <div className="App">
      <div className="container">
        <div className="title">Koors</div>

        <div className="sub-title">Recettes</div>
        <div className="recettes">
          {recettes.map((recette, i) => (
            <div
              key={i}
              className={
                "recette" +
                (recette.type == "singleItem" ? " singleItem" : "") +
                (recette.type == "dessert" ? " dessert" : "") +
                (recette.type == "flemme" ? " flemme" : "")
              }
              onClick={() => addItems(recette.name)}
            >
              <div className="recette-title">{recette.name}</div>
              <div className="recette-nb-personnes">
                {recette.personnes ? recette.personnes + "🙋‍♂️" : ""}
              </div>
              <div className="recette-link">
                {recette.link ? (
                  <a
                    href={recette.link}
                    target="_blank"
                    onClick={(event) => event.stopPropagation()}
                  >
                    🔗
                  </a>
                ) : null}
              </div>
              <div className="recette-delete">
                {adminValidated ? (
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={(event) => {
                      deleteRecette(recette.name);
                      event.stopPropagation();
                    }}
                  >
                    <DeleteIcon fontSize="inherit" />
                  </IconButton>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        <div className="sub-title">Courses</div>
        <div className="list">
          {orderedItems.map((itemKey, i) => (
            <div
              key={i}
              className={
                "item " +
                (!items[itemKey] ||
                items[itemKey].count <= 0 ||
                items[itemKey].checked
                  ? "noItem"
                  : "")
              }
              onClick={() => checkItem(itemKey)}
            >
              <div className="itemName">
                <input
                  type="checkbox"
                  readOnly
                  checked={items[itemKey] && items[itemKey].checked}
                />
                {getCategoryEmoji(itemKey)} {itemKey}
              </div>
              <div className="itemQuantityControls">
                <div
                  className={
                    "itemButton " +
                    (!items[itemKey] || items[itemKey].count <= 0
                      ? "noItem"
                      : "")
                  }
                  onClick={(evt) => decreaseItem(itemKey, evt)}
                >
                  ⬅
                </div>
                <div className="itemQuantity">
                  {items[itemKey] ? items[itemKey].count : 0}
                </div>
                <div
                  className="itemButton"
                  onClick={(evt) => increaseItem(itemKey, evt)}
                >
                  ➡
                </div>
              </div>
            </div>
          ))}

          <div className="item">
            <Autocomplete
              className="itemNameField"
              options={Object.keys(categoryMap)}
              onChange={(e, value) => {
                setNameNewItem(value);
              }}
              value={nameNewItem}
              freeSolo
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="nouvel ingredient"
                  variant="standard"
                  inputRef={(input) => {
                    inputRef = input;
                  }}
                  onChange={(event) => {
                    console.log(event.target.value);
                    setNameNewItem(event.target.value);
                  }}
                />
              )}
            />
            <button
              className="actionButton"
              disabled={!nameNewItem}
              onClick={() => createNewItem()}
            >
              Add
            </button>
          </div>
        </div>

        <div className="actions">
          <button
            className="actionButton"
            onClick={() => clean()}
            disabled={!hasIngredientsToClean}
          >
            🗑️ clean
          </button>
          <button className="actionButton" onClick={() => copyToClipBoard()}>
            📋 copy
          </button>
          <button className="actionButton" onClick={() => exportToGKeep()}>
            📝 google keep
          </button>
          {adminValidated ? (
            <button
              className="actionButton"
              onClick={() => setShowNewIngredientModal(!showNewIngredientModal)}
            >
              Nouvel ingredient
            </button>
          ) : null}
          {adminValidated ? (
            <button
              className="actionButton"
              onClick={() => setDeleteIngredientModal(!deleteIngredientModal)}
            >
              Supprimer un ingredient
            </button>
          ) : null}
          {adminValidated ? (
            <button
              className="actionButton"
              onClick={() => setShowNewRecetteModal(!showNewRecetteModal)}
            >
              Nouvelle recette
            </button>
          ) : null}
          <button
            className="actionButton"
            onClick={() => testPasswordAndSetShowAdmin(adminValidated)}
          >
            Admin
          </button>
          <button className="actionButton" onClick={() => disconnect()}>
            Déconnection
          </button>
        </div>
      </div>

      {showModal ? (
        <div
          className="modal-container"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="modal">
            <div className="modal-title">
              Déjà du {itemsToValidate[0]} en stock ?
            </div>
            <div className="modal-actions">
              <button
                className="actionButton"
                onClick={() => removeItem(itemsToValidate[0])}
              >
                Oui 👍
              </button>
              <button
                className="actionButton"
                onClick={() => validateItem(itemsToValidate[0])}
              >
                Non 🛒
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showNewIngredientModal ? (
        <div
          className="modal-container"
          onClick={(event) => {
            event.stopPropagation();
            setShowNewIngredientModal(false);
          }}
        >
          <Stack
            sx={{ p: 4 }}
            spacing={3}
            className="modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-title">Ajouter un ingredient</div>
            <TextField
              label="Nom"
              type="string"
              variant="standard"
              onChange={(event) => {
                setNameNewIngredient(event.target.value);
              }}
            />

            <Select
              label="Category"
              variant="standard"
              value={categoryNewIngredient}
              defaultValue="000-none"
              onChange={(event) => {
                setCategoryNewIngredient(event.target.value);
              }}
            >
              {Object.keys(categories).map((x) => (
                <MenuItem key={x} value={x}>
                  {categories[x]} {x}
                </MenuItem>
              ))}
            </Select>

            <Select
              label="Confirmation ?"
              variant="standard"
              value={confirmNewIngredient}
              defaultValue="false"
              onChange={(event) => {
                setConfirmNewIngredient(event.target.value);
              }}
            >
              <MenuItem value="false">Ne pas confirmer</MenuItem>
              <MenuItem value="true">Confirmer</MenuItem>
            </Select>
            <div className="modal-actions">
              <button
                className="actionButton"
                onClick={() => setShowNewIngredientModal(false)}
              >
                Annuler
              </button>
              <button
                className="actionButton"
                disabled={!nameNewIngredient}
                onClick={() => {
                  addNewIngredient();
                  setShowNewIngredientModal(false);
                }}
              >
                Valider l'ingredient
              </button>
            </div>
          </Stack>
        </div>
      ) : null}

      {deleteIngredientModal ? (
        <div
          className="modal-container"
          onClick={(event) => {
            event.stopPropagation();
            setDeleteIngredientModal(false);
          }}
        >
          <Stack
            sx={{ p: 4 }}
            spacing={3}
            className="modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-title">Supprimer un ingredient</div>
            <Autocomplete
              options={Object.keys(categoryMap)}
              onChange={(e, value) => {
                setNameNewIngredient(value);
              }}
              value={nameNewIngredient}
              renderInput={(params) => (
                <TextField {...params} label="Ingredient" variant="standard" />
              )}
            />

            <div className="modal-actions">
              <button
                className="actionButton"
                onClick={() => setDeleteIngredientModal(false)}
              >
                Annuler
              </button>
              <button
                className="actionButton"
                disabled={!nameNewIngredient}
                onClick={() => {
                  deleteIngredient();
                  setDeleteIngredientModal(false);
                }}
              >
                Supprimer l'ingredient
              </button>
            </div>
          </Stack>
        </div>
      ) : null}

      {showNewRecetteModal ? (
        <div
          className="modal-container"
          onClick={(event) => {
            event.stopPropagation();
            setShowNewRecetteModal(false);
          }}
        >
          <Stack
            sx={{ p: 4 }}
            spacing={3}
            className="modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-title">Ajouter une recette</div>
            <TextField
              label="Nom"
              type="string"
              variant="standard"
              onChange={(event) => {
                setNameNewRecette(event.target.value);
              }}
            />
            <Select
              label="Type"
              variant="standard"
              value={typeNewRecette}
              defaultValue={"default"}
              onChange={(event) => {
                setTypeNewRecette(event.target.value);
              }}
            >
              <MenuItem value="default">Default</MenuItem>
              <MenuItem value="dessert">Dessert</MenuItem>
              <MenuItem value="flemme">Flemme</MenuItem>
            </Select>

            <TextField
              label="Lien"
              type="string"
              variant="standard"
              onChange={(event) => {
                setLinkNewRecette(event.target.value);
              }}
            />

            <TextField
              id="outlined-number"
              label="# Personnes"
              type="number"
              inputProps={{ min: 0 }}
              defaultValue={0}
              variant="standard"
              onChange={(event) => {
                setNbPersonnesNewRecette(Number(event.target.value));
              }}
            />

            <Stack spacing={2}>
              <Stack>
                {Object.keys(newRecetteIngredients).map((name) => (
                  <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    key={name}
                  >
                    {categories[categoryMap[name]]} {name}:{" "}
                    {newRecetteIngredients[name]}
                    <IconButton
                      aria-label="delete"
                      onClick={() => removeNewRecetteIngredients(name)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                ))}
              </Stack>

              <Divider light />

              <Grid container spacing={1} sx={{ mb: 2 }}>
                <Autocomplete
                  className="itemNameField"
                  options={Object.keys(categoryMap)}
                  onChange={(e, value) => {
                    setNameNewRecetteIngredient(value);
                  }}
                  value={nameNewRecetteIngredient}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Ingredient"
                      variant="standard"
                    />
                  )}
                />

                <TextField
                  id="outlined-number"
                  label="Quantité"
                  type="number"
                  inputProps={{ min: 1 }}
                  variant="standard"
                  value={quantityNewRecetteIngredient}
                  onChange={(event) => {
                    setQuantityNewRecetteIngredient(Number(event.target.value));
                  }}
                />

                <Button
                  variant="contained"
                  size="small"
                  sx={{ ml: 2 }}
                  aria-label="add"
                  onClick={() =>
                    addNewRecetteIngredients(
                      nameNewRecetteIngredient,
                      quantityNewRecetteIngredient
                    )
                  }
                  disabled={!nameNewRecetteIngredient}
                  startIcon={<AddIcon fontSize="inherit" />}
                >
                  Add
                </Button>
              </Grid>
            </Stack>
            <div className="modal-actions">
              <button
                className="actionButton"
                onClick={() => setShowNewRecetteModal(false)}
              >
                Annuler
              </button>
              <button
                className="actionButton"
                disabled={
                  Object.keys(newRecetteIngredients).length <= 0 ||
                  !nameNewRecette
                }
                onClick={() => {
                  addNewRecette();
                  setShowNewRecetteModal(false);
                }}
              >
                Valider la Recette
              </button>
            </div>
          </Stack>
        </div>
      ) : null}

      {showAdmin ? (
        <div
          className="modal-container"
          onClick={(event) => {
            event.stopPropagation();
            setShowAdmin(false);
          }}
        >
          <Stack
            sx={{ p: 4 }}
            spacing={3}
            className="modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-title">Se connecter en tant qu'admin</div>
            <TextField
              label="Mot de passe"
              type="password"
              variant="standard"
              onChange={async (event) => {
                setHashedPassword(hashPassword(event.target.value));
              }}
              autoFocus
            />

            <div className="modal-actions">
              <button
                className="actionButton"
                onClick={() => setShowAdmin(false)}
              >
                Annuler
              </button>
              <button
                className="actionButton"
                onClick={() => {
                  testPassword();
                  setShowAdmin(false);
                }}
              >
                Se connecter
              </button>
            </div>
          </Stack>
        </div>
      ) : null}
    </div>
  );
}

export default App;
