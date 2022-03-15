import './App.css';
import recettes from './Recettes.js';
import { categoryMap, categories, ingredientsToValidate } from './Recettes.js';
import React, { useEffect, useState } from 'react';

function App() {
  const [items, setItems] = useState({});
  const [orderedItems, setOrderedItems] = useState([]);
  const [nameNewItem, setNameNewItem] = useState("");
  const [showModal, setShowModal] = useState("");
  const [itemsToValide, setItemsToValide] = useState([]);


  useEffect(() => {
    var items;
    try {
      var items = JSON.parse(localStorage.getItem('koors-items'));
      console.log("read local storage", items);

    } catch (err) {
      console.log(err);
      localStorage.removeItem('koors-items');
      return;
    }
    if (items)
      setItems(items);
  }, [])

  useEffect(() => {
    if (items) {
      console.log("update local storage");
      localStorage.setItem('koors-items', JSON.stringify(items));
    }
    var itemKeys = Object.keys(items);
    itemKeys.sort((i1, i2) => categoryMap[i1] < categoryMap[i2] ? 1 : -1)
    setOrderedItems(itemKeys)
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
    navigator.clipboard.writeText(text);
  }

  function reset() {
    setItems({});
  }

  function exportToGKeep() {
    copyToClipBoard();
    setTimeout(() => {
      window.open("http://keep.new");
    }, 500)
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
          {recettes.map((recette, i) => <div key={i} className={"recette" + (recette.singleItem ? " singleItem" : "")} onClick={() => addItems(recette.name)}>
            <div className="recette-title">{recette.name}</div>
            <div className="recette-nb-personnes">{recette.personnes ? recette.personnes + "🙋‍♂️" : ""}</div>
            <div className="recette-link">{recette.link ? (<a href={recette.link} target="_blank" onClick={(event) => event.stopPropagation()}>🔗</a>) : null}</div>
          </div>)}
        </div>

        <div className="sub-title">
          Courses
        </div>
        <div className="list">
          {orderedItems.map((itemKey, i) => <div key={i} className={"item " + ((!items[itemKey] || items[itemKey].count <= 0 || items[itemKey].checked) ? "noItem" : "")} onClick={() => checkItem(itemKey)}>
            <div className="itemName">
              <input type="checkbox" readOnly checked={items[itemKey].checked} />{getCategoryEmoji(itemKey)} {itemKey}
            </div>
            <div className="itemQuantityControls">
              <div className={"itemButton " + ((!items[itemKey] || items[itemKey].count <= 0) ? "noItem" : "")} onClick={(evt) => decreaseItem(itemKey, evt)}>⬅</div>
              <div className="itemQuantity">{items[itemKey] ? items[itemKey].count : 0}</div>
              <div className="itemButton" onClick={(evt) => increaseItem(itemKey, evt)}>➡</div>
            </div>
          </div>)}

          <div className="item">
            <input type="text" className="itemNameField" onChange={e => setNameNewItem(e.target.value)} value={nameNewItem}></input>
            <button className="actionButton" disabled={!nameNewItem} onClick={() => createNewItem()}>Add</button>
          </div>
        </div>

        <div className="actions">
          <button className="actionButton" onClick={() => reset()}>🗑️ reset</button>
          <button className="actionButton" onClick={() => copyToClipBoard()}>📋 copy</button>
          <button className="actionButton" onClick={() => exportToGKeep()}>📝 google keep</button>
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
    </div >
  );
}

export default App;
