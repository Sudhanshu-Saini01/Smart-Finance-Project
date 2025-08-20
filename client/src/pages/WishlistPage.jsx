// client/src/pages/WishlistPage.jsx (REFURBISHED)

import React, { useState, useContext } from "react";
import axios from "axios";
import { DataContext } from "../context/DataContext"; // 1. Import the DataContext
import WishlistCard from "../components/WishlistCard";
import "./WishlistPage.css";

const WishlistPage = () => {
  // 2. Get all data and functions from the central DataContext
  const { wishlist, summary, loading, error, refetchData } =
    useContext(DataContext);

  // Local state is only needed for the form
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [category, setCategory] = useState("other");
  const [formError, setFormError] = useState("");

  const handleAddItem = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!itemName || !itemPrice) {
      setFormError("Please fill all fields.");
      return;
    }
    try {
      await axios.post("http://localhost:3001/api/wishlist", {
        itemName,
        itemPrice: parseFloat(itemPrice),
        category,
      });

      // 3. Tell the central hub to refetch all data
      refetchData();

      // Reset form
      setItemName("");
      setItemPrice("");
      setCategory("other");
    } catch (err) {
      setFormError("Failed to add item." + err);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await axios.delete(`http://localhost:3001/api/wishlist/${itemId}`);
      // 4. Refetch data after deleting to ensure everything is in sync
      refetchData();
    } catch (err) {
      setFormError("Failed to delete item." + err);
    }
  };

  if (loading) {
    return <div className="loading-fullscreen">Loading Wishlist...</div>;
  }

  return (
    <div className="wishlist-page-container">
      <h1>My Financial Goals</h1>

      <div className="wishlist-add-item-section">
        <h3>Add a New Goal</h3>
        <form onSubmit={handleAddItem} className="wishlist-add-form">
          <input
            type="text"
            placeholder="Item Name (e.g., New Phone)"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Price"
            value={itemPrice}
            onChange={(e) => setItemPrice(e.target.value)}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="electronics">Electronics</option>
            <option value="vehicle">Vehicle</option>
            <option value="property">Property</option>
            <option value="vacation">Vacation</option>
            <option value="other">Other</option>
          </select>
          <button type="submit">Add Goal</button>
        </form>
        {formError && <p className="error-message">{formError}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>

      <div className="wishlist-grid">
        {wishlist.map((item) => (
          <WishlistCard
            key={item._id}
            item={item}
            summary={summary} // Pass the summary from the context
            onDelete={handleDeleteItem}
          />
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
