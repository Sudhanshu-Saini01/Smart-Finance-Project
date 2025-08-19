// client/src/pages/WishlistPage.jsx (REPLACE THIS FILE'S CONTENT)

import React, { useState, useEffect } from "react";
import axios from "axios";
// import { AuthContext } from "../context/AuthContext";
import WishlistCard from "../components/WishlistCard"; // We will create this
import "./WishlistPage.css"; // We will create this

const WishlistPage = () => {
  // const { user } = useContext(AuthContext);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form state for adding new items
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [category, setCategory] = useState("other");

  const fetchData = async () => {
    try {
      const [wishlistRes, summaryRes] = await Promise.all([
        axios.get("http://localhost:3001/api/wishlist"),
        axios.get("http://localhost:3001/api/transactions/monthly-summary"),
      ]);
      setWishlistItems(wishlistRes.data);
      setSummaryData(summaryRes.data);
    } catch (err) {
      setError("Failed to fetch data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!itemName || !itemPrice) {
      setError("Please fill all fields.");
      return;
    }
    try {
      const res = await axios.post("http://localhost:3001/api/wishlist", {
        itemName,
        itemPrice: parseFloat(itemPrice),
        category,
      });
      setWishlistItems([res.data, ...wishlistItems]);
      // Reset form
      setItemName("");
      setItemPrice("");
      setCategory("other");
    } catch (err) {
      console.log(err);
      setError("Failed to add item.");
    }
  };

  const handleDeleteItem = (itemId) => {
    setWishlistItems(wishlistItems.filter((item) => item._id !== itemId));
    // Optionally, you can add a call to the delete API endpoint here
    // axios.delete(`http://localhost:3001/api/wishlist/${itemId}`);
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
        {error && <p className="error-message">{error}</p>}
      </div>

      <div className="wishlist-grid">
        {wishlistItems.map((item) => (
          <WishlistCard
            key={item._id}
            item={item}
            summary={summaryData}
            onDelete={handleDeleteItem}
          />
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
