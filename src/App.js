import './App.css';
import { categories } from './Recettes.js';
import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';

function App() {
  const [recettes, setRecettes] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [ingredientsToValidate, setIngredientsToValidate] = useState([]);
  const [items, setItems] = useState({});
  const [orderedItems, setOrderedItems] = useState([]);
  const [nameNewItem, setNameNewItem] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showNewIngredientModal, setShowNewIngredientModal] = useState(false);
  const [showNewRecetteModal, setShowNewRecetteModal] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [itemsToValide, setItemsToValide] = useState([]);
  const [newRecetteIngredients, setNewRecetteIngredients] = useState({});
  const [quantityNewRecetteIngredient, setQuantityNewRecetteIngredient] = useState(1);
  const [nameNewRecetteIngredient, setNameNewRecetteIngredient] = useState("");
  const [nameNewRecette, setNameNewRecette] = useState("");
  const [typeNewRecette, setTypeNewRecette] = useState("default");
  const [linkNewRecette, setLinkNewRecette] = useState("");
  const [nbPersonnesNewRecette, setNbPersonnesNewRecette] = useState(0);

  const [nameNewIngredient, setNameNewIngredient] = useState("");
  const [categoryNewIngredient, setCategoryNewIngredient] = useState("");
  const [confirmNewIngredient, setConfirmNewIngredient] = useState("false");
  const [password, setPassword] = useState("");
  const [adminValidated, setAdminValidated] = useState(false);

  useEffect(() => {
    (async () => {
      // Ingredients
      try {
        const responseJson = await fetch("/api/ingredients", {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'auth': password
          },
          method: "GET"
        });
        const response = await responseJson.json();

        let { ingredientsToValidate, categoryMap } = response;
        console.log("fetch recettes from server", ingredientsToValidate, categoryMap);

        if (ingredientsToValidate)
          setIngredientsToValidate(ingredientsToValidate);

        if (categoryMap)
          setCategoryMap(categoryMap);

      } catch (err) {
        console.error(err);
        //localStorage.removeItem('koors-items');
        return;
      }

      // Items
      try {
        const responseJson = await fetch("/api/state/42", {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'auth': password
          },
          method: "GET"
        });
        const response = await responseJson.json();

        let items = response;
        console.log("fetch items from server", items);

        if (items)
          setItems(items);

      } catch (err) {
        console.error(err);
        //localStorage.removeItem('koors-items');
        return;
      }

      // Recettes
      try {
        const responseJson = await fetch("/api/recettes", {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'auth': password
          },
          method: "GET"
        });
        const response = await responseJson.json();

        let recettes = response;
        console.log("fetch recettes from server", recettes);

        if (recettes)
          setRecettes(recettes);

      } catch (err) {
        console.error(err);
        //localStorage.removeItem('koors-items');
        return;
      }
    })();
  }, [])

  useEffect(() => {
    (async () => {
      if (items && Object.keys(items).length > 0) {
        console.log("update server", items);
        //localStorage.setItem('koors-items', JSON.stringify(items));
        try {
          const responseJson = await fetch("/api/state/42", {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'auth': password // Bat les couilles des man in the middle
            },
            method: "POST",
            body: JSON.stringify(items)
          });
          const response = await responseJson.text();
          console.log(response);
        } catch (err) {
          console.error(err);
        }

        var itemKeys = Object.keys(items);
        // Defining a category for manually added item just for sorting
        itemKeys.sort((i1, i2) => ((categoryMap[i1] ?? '000') < (categoryMap[i2] ?? '000')) ? 1 : -1);
        setOrderedItems(itemKeys);
      }
    })();
  }, [items])


  useEffect(() => {
    if (itemsToValide && itemsToValide.length > 0)
      setShowModal(true);
    else
      setShowModal(false);
  }, [itemsToValide])

  function addItems(recetteName) {
    var newItems = Object.assign({}, items);

    let recette = recettes.find(x => x.name === recetteName);

    if (recette.type != "singleItem") // If this is a single item recette don't validate
      setItemsToValide(Object.keys(recette.ingredients).filter(x => ingredientsToValidate.includes(x)));

    for (var item of Object.entries(recette.ingredients)) {
      if (!newItems[item[0]])
        newItems[item[0]] = { count: item[1], checked: false };
      else
        newItems[item[0]].count += item[1];
    }

    setItems(newItems);
  }

  function decreaseItem(itemName, evt) {
    var newItems = Object.assign({}, items);
    if (newItems[itemName].count == 0)
      return;
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
    if (!nameNewItem)
      return;

    var newItems = Object.assign({}, items);
    if (!newItems[nameNewItem])
      newItems[nameNewItem] = { count: 1, checked: false };
    else
      newItems[nameNewItem].count += 1;

    setItems(newItems);
    setNameNewItem("");
  }

  function copyToClipBoard() {
    var text = "";
    for (var item of Object.entries(items)) {
      if (item[1].count > 0)
        text += item[0] + " x" + item[1].count + "\n"
    };
    return copyToClipboardPrivate(text);
  }

  async function reset() {
    setItems({});
    setOrderedItems([]);

    try {
      const responseJson = await fetch("/api/state/42", {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'auth': password
        },
        method: "POST",
        body: JSON.stringify({})
      });
      const response = await responseJson.text();
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  }

  function exportToGKeep() {
    copyToClipBoard().then(() => {
      setTimeout(() => {
        window.open("http://keep.new");
      }, 500)
    });
  }

  function getCategoryEmoji(itemKey) {
    return categories[categoryMap[itemKey]];
  }

  function removeItem(itemKey) {
    var newItems = Object.assign({}, items);
    delete newItems[itemKey]
    setItems(newItems);
    var newItemsToValide = itemsToValide.filter(x => x !== itemKey);
    setItemsToValide(newItemsToValide);
  }

  function validateItem(itemKey) {
    var newItemsToValide = itemsToValide.filter(x => x !== itemKey);
    setItemsToValide(newItemsToValide);
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
        document.execCommand('copy') ? res() : rej();
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
    if (updatedValue[name])
      updatedValue[name] += quantity;
    else
      updatedValue[name] = quantity;
    setNewRecetteIngredients(updatedValue);
  }

  async function addNewRecette() {
    // Update state
    const newRecettes = Array.from(recettes);
    newRecettes.push({
      name: nameNewRecette,
      ingredients: newRecetteIngredients,
      type: typeNewRecette,
      link: linkNewRecette,
      personnes: nbPersonnesNewRecette
    });
    setRecettes(newRecettes);

    // Update server
    try {
      const responseJson = await fetch("/api/recettes", {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'auth': password
        },
        method: "POST",
        body: JSON.stringify(newRecettes)
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
    setNbPersonnesNewRecette(0)
  }

  async function deleteRecette(name) {
    try {
      const response = await fetch("/api/recettes/" + name, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'auth': password
        },
        method: "DELETE",
      });

      if (response.status == 200) {
        let newRecettes = Array.from(recettes);
        const deleteIndex = recettes.findIndex(x => x.name == name);
        newRecettes.splice(deleteIndex, 1);
        setRecettes(newRecettes);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function addNewIngredient() {
    if (categoryMap[nameNewIngredient])
      return;

    categoryMap[nameNewIngredient] = categoryNewIngredient;

    if (confirmNewIngredient == "true")
      ingredientsToValidate.push(nameNewIngredient);

    // Update server
    try {
      const responseJson = await fetch("/api/ingredients", {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'auth': password
        },
        method: "POST",
        body: JSON.stringify({
          ingredientsToValidate: ingredientsToValidate,
          categoryMap: categoryMap
        })
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
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'auth': password
        },
        method: "GET"
      });
      if (response.status != 200) {
        alert('Mauvais mot de passe');
        setAdminValidated(false);
      } else {
        setAdminValidated(true);
      }
    } catch (err) {
      alert('Mauvais mot de passe');
      setAdminValidated(false);
    }

  }

  return (
    <div className="App">
      <div className="container">
        <div className="title">
          Koors
        </div>

        <div className="sub-title">
          Recettes
        </div>
        <div className="recettes">
          {recettes.map((recette, i) => <div key={i} className={"recette" + (recette.type == "singleItem" ? " singleItem" : "") + (recette.type == 'dessert' ? " dessert" : "") + (recette.type == 'flemme' ? " flemme" : "")} onClick={() => addItems(recette.name)}>
            <div className="recette-title">{recette.name}</div>
            <div className="recette-nb-personnes">{recette.personnes ? recette.personnes + "🙋‍♂️" : ""}</div>
            <div className="recette-link">{recette.link ? (<a href={recette.link} target="_blank" onClick={(event) => event.stopPropagation()}>🔗</a>) : null}</div>
            <div className="recette-delete">{adminValidated ? (<IconButton aria-label="delete" size="small" onClick={(event) => { deleteRecette(recette.name); event.stopPropagation(); }}>
              <DeleteIcon fontSize="inherit" />
            </IconButton>) : null}</div>
          </div>)}
        </div>

        <div className="sub-title">
          Courses
        </div>
        <div className="list">
          {orderedItems.map((itemKey, i) => <div key={i} className={"item " + ((!items[itemKey] || items[itemKey].count <= 0 || items[itemKey].checked) ? "noItem" : "")} onClick={() => checkItem(itemKey)}>
            <div className="itemName">
              <input type="checkbox" readOnly checked={items[itemKey] && items[itemKey].checked} />{getCategoryEmoji(itemKey)} {itemKey}
            </div>
            <div className="itemQuantityControls">
              <div className={"itemButton " + ((!items[itemKey] || items[itemKey].count <= 0) ? "noItem" : "")} onClick={(evt) => decreaseItem(itemKey, evt)}>⬅</div>
              <div className="itemQuantity">{items[itemKey] ? items[itemKey].count : 0}</div>
              <div className="itemButton" onClick={(evt) => increaseItem(itemKey, evt)}>➡</div>
            </div>
          </div>)}

          <div className="item">
            <Autocomplete
              className="itemNameField"
              options={Object.keys(categoryMap)}
              onChange={(e, value) => { setNameNewItem(value) }}
              freeSolo
              renderInput={(params) => (
                <TextField {...params} label="nouvel ingredient" variant="standard" />
              )}
            />
            <button className="actionButton" disabled={!nameNewItem} onClick={() => createNewItem()}>Add</button>
          </div>
        </div>

        <div className="actions">
          <button className="actionButton" onClick={() => reset()}>🗑️ reset</button>
          <button className="actionButton" onClick={() => copyToClipBoard()}>📋 copy</button>
          <button className="actionButton" onClick={() => exportToGKeep()}>📝 google keep</button>
          {adminValidated ? (<button className="actionButton" onClick={() => setShowNewIngredientModal(!showNewIngredientModal)}>Nouvel ingredient</button>) : null}
          {adminValidated ? (<button className="actionButton" onClick={() => setShowNewRecetteModal(!showNewRecetteModal)}>Nouvelle recette</button>) : null}
          <button className="actionButton" onClick={() => setShowAdmin(!showAdmin)}>Admin</button>
        </div>
      </div>

      {showModal ? <div className="modal-container" onClick={(event) => event.stopPropagation()}>
        <div className="modal">
          <div className="modal-title">Déjà du {itemsToValide[0]} en stock ?</div>
          <div className="modal-actions">
            <button className="actionButton" onClick={() => removeItem(itemsToValide[0])}>Oui 👍</button>
            <button className="actionButton" onClick={() => validateItem(itemsToValide[0])}>Non 🛒</button>
          </div>

        </div>
      </div> : null}

      {showNewIngredientModal ? <div className="modal-container" onClick={(event) => { event.stopPropagation(); setShowNewIngredientModal(false); }}>
        <Stack sx={{ p: 4 }} spacing={3} className="modal" onClick={(event) => event.stopPropagation()}>
          <div className="modal-title">Ajouter un ingredient</div>
          <TextField
            label="Nom"
            type="string"
            variant="standard"
            onChange={(event) => { setNameNewIngredient(event.target.value) }}
          />

          <Select
            label="Category"
            variant="standard"
            value={categoryNewIngredient}
            defaultValue="000-none"
            onChange={(event) => { setCategoryNewIngredient(event.target.value) }}
          >
            {Object.keys(categories).map(x => (<MenuItem key={x} value={x}>{categories[x]} {x}</MenuItem>))}
          </Select>


          <Select
            label="Confirmation ?"
            variant="standard"
            value={confirmNewIngredient}
            defaultValue="false"
            onChange={(event) => { setConfirmNewIngredient(event.target.value) }}
          >
            <MenuItem value="false">Ne pas confirmer</MenuItem>
            <MenuItem value="true">Confirmer</MenuItem>
          </Select>
          <div className="modal-actions">
            <button className="actionButton" onClick={() => setShowNewIngredientModal(false)}>Annuler</button>
            <button className="actionButton" onClick={() => { addNewIngredient(); setShowNewIngredientModal(false); }}>Valider l'ingredient</button>
          </div>
        </Stack>
      </div> : null
      }

      {
        showNewRecetteModal ? <div className="modal-container" onClick={(event) => { event.stopPropagation(); setShowNewRecetteModal(false); }}>
          <Stack sx={{ p: 4 }} spacing={3} className="modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-title">Ajouter une recette</div>
            <TextField
              label="Nom"
              type="string"
              variant="standard"
              onChange={(event) => { setNameNewRecette(event.target.value) }}
            />
            <Select
              label="Type"
              variant="standard"
              value={typeNewRecette}
              defaultValue={"default"}
              onChange={(event) => { setTypeNewRecette(event.target.value) }}
            >
              <MenuItem value="default">Default</MenuItem>
              <MenuItem value="dessert">Dessert</MenuItem>
              <MenuItem value="flemme">Flemme</MenuItem>
            </Select>

            <TextField
              label="Lien"
              type="string"
              variant="standard"
              onChange={(event) => { setLinkNewRecette(event.target.value) }}
            />

            <TextField
              id="outlined-number"
              label="# Personnes"
              type="number"
              inputProps={{ min: 0 }}
              defaultValue={0}
              variant="standard"
              onChange={(event) => { setNbPersonnesNewRecette(Number(event.target.value)) }}
            />

            <Stack spacing={2}>
              <Stack>
                {Object.keys(newRecetteIngredients).map(name => (
                  <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    key={name}>
                    {categories[categoryMap[name]]} {name}: {newRecetteIngredients[name]}
                    <IconButton aria-label="delete" onClick={() => removeNewRecetteIngredients(name)}>
                      <DeleteIcon />
                    </IconButton></Grid>
                ))}
              </Stack>

              <Divider light />

              <Grid container spacing={1} sx={{ mb: 2 }} >
                <Autocomplete
                  className="itemNameField"
                  options={Object.keys(categoryMap)}
                  onChange={(e, value) => { setNameNewRecetteIngredient(value) }}
                  renderInput={(params) => (
                    <TextField {...params} label="Ingredient" variant="standard" />
                  )}
                />

                <TextField
                  id="outlined-number"
                  label="Quantité"
                  type="number"
                  inputProps={{ min: 1 }}
                  defaultValue={1}
                  variant="standard"
                  onChange={(event) => { setQuantityNewRecetteIngredient(Number(event.target.value)) }}
                />

                <Button variant="contained"
                  size="small"
                  sx={{ ml: 2 }}
                  aria-label="add"
                  onClick={() => addNewRecetteIngredients(nameNewRecetteIngredient, quantityNewRecetteIngredient)}
                  disabled={!nameNewRecetteIngredient}
                  startIcon={<AddIcon fontSize="inherit" />}>
                  Add
                </Button>
              </Grid>
            </Stack>
            <div className="modal-actions">
              <button className="actionButton" onClick={() => setShowNewRecetteModal(false)}>Annuler</button>
              <button className="actionButton" disabled={Object.keys(newRecetteIngredients).length <= 0 || !nameNewRecette} onClick={() => { addNewRecette(); setShowNewRecetteModal(false); }}>Valider la Recette</button>
            </div>
          </Stack>
        </div > : null
      }

      {showAdmin ? <div className="modal-container" onClick={(event) => { event.stopPropagation(); setShowAdmin(false); }}>
        <Stack sx={{ p: 4 }} spacing={3} className="modal" onClick={(event) => event.stopPropagation()}>
          <div className="modal-title">Mot de passe</div>
          <TextField
            label="Mot de passe"
            type="string"
            variant="standard"
            onChange={(event) => { setPassword(event.target.value) }}
          />

          <div className="modal-actions">
            <button className="actionButton" onClick={() => setShowAdmin(false)}>Annuler</button>
            <button className="actionButton" onClick={() => { testPassword(); setShowAdmin(false); }}>Se connecter</button>
          </div>
        </Stack>
      </div> : null
      }
    </div >
  );
}

export default App;
