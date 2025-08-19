// client/src/components/Wishlist.jsx (NEW FILE)

import React, { useState, useEffect } from "react";
import axios from "axios";

const WishlistItem = ({ item, balance, onDelete }) => {
  const [advice, setAdvice] = useState({ color: "", text: "" });

  useEffect(() => {
    // This is the "Expenditure Decision Advisor" logic
    if (item.itemPrice <= balance) {
      setAdvice({ color: "green", text: "✅ You Can" });
    } else {
      setAdvice({ color: "red", text: "🚫 Avoid" });
    }
  }, [item, balance]);

  return (
    <li className="wishlist-item">
      <div className="item-info">
        <span className="item-name">{item.itemName}</span>
        <span className="item-price">${item.itemPrice.toFixed(2)}</span>
      </div>
      <div className="item-actions">
        <span className={`item-advice ${advice.color}`}>{advice.text}</span>
        <button onClick={() => onDelete(item._id)} className="delete-btn">
          ×
        </button>
      </div>
    </li>
  );
};

const Wishlist = ({ balance }) => {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/wishlist");
        setItems(res.data);
      } catch (err) {
        console.error("Failed to fetch wishlist items", err);
      }
    };
    fetchItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!itemName || !itemPrice) {
      setError("Please provide both a name and a price.");
      return;
    }
    try {
      const res = await axios.post("http://localhost:3001/api/wishlist", {
        itemName,
        itemPrice: parseFloat(itemPrice),
      });
      setItems([res.data, ...items]); // Add new item to the top of the list
      setItemName("");
      setItemPrice("");
    } catch (err) {
      setError("Failed to add item.");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/wishlist/${id}`);
      setItems(items.filter((item) => item._id !== id)); // Remove item from state
    } catch (err) {
      setError("Failed to delete item.");
      console.error(err);
    }
  };

  return (
    <div className="wishlist-container">
      <h2>My Wishlist</h2>
      <form onSubmit={handleSubmit} className="wishlist-form">
        {error && <p className="error-message">{error}</p>}
        <input
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          placeholder="New Laptop"
        />
        <input
          type="number"
          value={itemPrice}
          onChange={(e) => setItemPrice(e.target.value)}
          placeholder="1200.00"
        />
        <button type="submit">Add to Wishlist</button>
      </form>
      <ul className="wishlist">
        {items.length > 0 ? (
          items.map((item) => (
            <WishlistItem
              key={item._id}
              item={item}
              balance={balance}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <p>Your wishlist is empty. Add an item you're saving for!</p>
        )}
      </ul>
    </div>
  );
};

export default Wishlist;
