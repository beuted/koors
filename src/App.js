import './App.css';
import recettes from './Recettes.js';
import React, { useEffect, useState } from 'react';

function App() {
  const [items, setItems] = useState({});
  const [nameNewItem, setNameNewItem] = useState("");

  function addItems(recetteName) {
    var newItems = Object.assign({}, items);

    let recette = recettes.find(x => x.name === recetteName);

    for (var item of Object.entries(recette.ingredients)) {
      if (!newItems[item[0]])
        newItems[item[0]] = item[1];
      else
        newItems[item[0]] += item[1];
    }
    console.log("aadd", newItems)

    setItems(newItems);
  }

  function decreaseItem(itemName) {
    var newItems = Object.assign({}, items);
    if (newItems[itemName] == 0)
      return;
    newItems[itemName]--;
    setItems(newItems);
  }

  function increaseItem(itemName) {
    var newItems = Object.assign({}, items);
    newItems[itemName]++;
    setItems(newItems);
  }

  function createNewItem() {
    if (!nameNewItem)
      return;

    var newItems = Object.assign({}, items);
    if (!newItems[nameNewItem])
      newItems[nameNewItem] = 1;
    else
      newItems[nameNewItem] += 1;

    setItems(newItems);
    setNameNewItem("");
  }

  function copyToClipBoard() {
    var text = "";
    for (var item of Object.entries(items)) {
      text += item[0] + " x" + item[1] + "\n"
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
          </div>)}
        </div>

        <div className="sub-title">
          Courses
        </div>
        <div className="list">
          {Object.entries(items).map((item, i) => <div key={i} className="item">
            <span className="itemName">{item[0]}</span>
            <span className="itemButton" onClick={() => decreaseItem(item[0])}>⬅</span>
            <span className="itemQuantity">{item[1]}</span>
            <span className="itemButton" onClick={() => increaseItem(item[0])}>➡</span></div>)}
          <div className="item">
            <input type="text" className="itemNameField" onChange={e => setNameNewItem(e.target.value)} value={nameNewItem}></input>
            <button className="actionButton" disabled={!nameNewItem} onClick={() => createNewItem()}>Add</button>
          </div>
        </div>

        <div className="actions">
          <button className="actionButton" onClick={() => reset()}>reset</button>
          <button className="actionButton" onClick={() => copyToClipBoard()}>copy</button>
          <button className="actionButton" onClick={() => exportToGKeep()}>export to google keep</button>
        </div>
      </div>
    </div>
  );
}

export default App;
