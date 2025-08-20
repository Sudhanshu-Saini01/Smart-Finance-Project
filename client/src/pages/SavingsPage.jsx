// 19-08-2025
// // client/src/pages/SavingsPage.jsx

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./SavingsPage.css"; // We will create this file next

// const SavingsPage = () => {
//   const [goals, setGoals] = useState([]);
//   const [wishlistItems, setWishlistItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // Form state for creating a new goal
//   const [goalName, setGoalName] = useState("");
//   const [targetAmount, setTargetAmount] = useState("");
//   const [linkedWishlistItem, setLinkedWishlistItem] = useState("");

//   const fetchData = async () => {
//     try {
//       const [goalsRes, wishlistRes] = await Promise.all([
//         axios.get("http://localhost:3001/api/savings"),
//         axios.get("http://localhost:3001/api/wishlist"),
//       ]);
//       setGoals(goalsRes.data);
//       setWishlistItems(wishlistRes.data);
//     } catch (err) {
//       setError("Failed to fetch data.");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleCreateGoal = async (e) => {
//     e.preventDefault();
//     if (!goalName || !targetAmount) {
//       setError("Please provide a name and target amount.");
//       return;
//     }
//     try {
//       const newGoal = {
//         goalName,
//         targetAmount: parseFloat(targetAmount),
//         wishlistItem: linkedWishlistItem || null,
//       };
//       const res = await axios.post(
//         "http://localhost:3001/api/savings",
//         newGoal
//       );
//       setGoals([res.data, ...goals]);
//       // Reset form
//       setGoalName("");
//       setTargetAmount("");
//       setLinkedWishlistItem("");
//     } catch (err) {
//       setError("Failed to create goal:" + err);
//     }
//   };

//   if (loading) {
//     return <div className="loading-fullscreen">Loading Savings...</div>;
//   }

//   return (
//     <div className="savings-page-container">
//       <h1>Savings & Investments</h1>

//       <div className="savings-section">
//         <h3>Create a New Savings Goal</h3>
//         <form onSubmit={handleCreateGoal} className="savings-form">
//           <input
//             type="text"
//             placeholder="Goal Name (e.g., Vacation Fund)"
//             value={goalName}
//             onChange={(e) => setGoalName(e.target.value)}
//           />
//           <input
//             type="number"
//             placeholder="Target Amount"
//             value={targetAmount}
//             onChange={(e) => setTargetAmount(e.target.value)}
//           />
//           <select
//             value={linkedWishlistItem}
//             onChange={(e) => setLinkedWishlistItem(e.target.value)}
//           >
//             <option value="">Link to a Wishlist Item? (Optional)</option>
//             {wishlistItems.map((item) => (
//               <option key={item._id} value={item._id}>
//                 {item.itemName}
//               </option>
//             ))}
//           </select>
//           <button type="submit">Create Goal</button>
//         </form>
//         {error && <p className="error-message">{error}</p>}
//       </div>

//       <div className="savings-section">
//         <h3>Your Active Goals</h3>
//         <div className="goals-list">
//           {goals.length > 0 ? (
//             goals.map((goal) => (
//               <div key={goal._id} className="goal-item">
//                 {/* We will replace this with a dedicated component next */}
//                 <p>
//                   {goal.goalName} - ${goal.targetAmount}
//                 </p>
//               </div>
//             ))
//           ) : (
//             <p>You have no savings goals yet. Create one to get started!</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SavingsPage;

// client/src/pages/SavingsPage.jsx (REFURBISHED 20-08-2025)

import React, { useState, useContext } from "react";
import axios from "axios";
import { DataContext } from "../context/DataContext"; // 1. Import the DataContext
import SavingsGoalItem from "../components/SavingsGoalItem";
import "./SavingsPage.css";

const SavingsPage = () => {
  // 2. Get all data and functions from the central DataContext
  const { goals, wishlist, loading, error, refetchData } =
    useContext(DataContext);

  // We only need local state for the form inputs
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [linkedWishlistItem, setLinkedWishlistItem] = useState("");
  const [formError, setFormError] = useState("");

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!goalName || !targetAmount) {
      setFormError("Please provide a name and target amount.");
      return;
    }
    try {
      const newGoal = {
        goalName,
        targetAmount: parseFloat(targetAmount),
        wishlistItem: linkedWishlistItem || null,
      };
      await axios.post("http://localhost:3001/api/savings", newGoal);

      // 3. Instead of updating local state, just tell the hub to refetch everything
      refetchData();

      // Reset form
      setGoalName("");
      setTargetAmount("");
      setLinkedWishlistItem("");
    } catch (err) {
      setFormError("Failed to create goal." + err);
    }
  };

  if (loading) {
    return <div className="loading-fullscreen">Loading Savings...</div>;
  }

  return (
    <div className="savings-page-container">
      <h1>Savings & Investments</h1>

      <div className="savings-section">
        <h3>Create a New Savings Goal</h3>
        <form onSubmit={handleCreateGoal} className="savings-form">
          <input
            type="text"
            placeholder="Goal Name (e.g., Vacation Fund)"
            value={goalName}
            onChange={(e) => setGoalName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Target Amount"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
          />
          <select
            value={linkedWishlistItem}
            onChange={(e) => setLinkedWishlistItem(e.target.value)}
          >
            <option value="">Link to a Wishlist Item? (Optional)</option>
            {wishlist.map(
              (
                item // Read wishlist from context
              ) => (
                <option key={item._id} value={item._id}>
                  {item.itemName}
                </option>
              )
            )}
          </select>
          <button type="submit">Create Goal</button>
        </form>
        {formError && <p className="error-message">{formError}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>

      <div className="savings-section">
        <h3>Your Active Goals</h3>
        <div className="goals-list">
          {goals.length > 0 ? (
            goals.map((goal) => (
              <SavingsGoalItem
                key={goal._id}
                goal={goal}
                onFundAdded={refetchData} // 4. Pass the refetchData function directly
              />
            ))
          ) : (
            <p>You have no savings goals yet. Create one to get started!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavingsPage;
