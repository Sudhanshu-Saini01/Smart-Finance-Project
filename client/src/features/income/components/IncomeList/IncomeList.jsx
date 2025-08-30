// client/src/features/income/components/IncomeList/IncomeList.jsx
import React from "react";
import IncomeCard from "../../components/IncomeCard/IncomeCard"; // Assuming IncomeCard is now here
import "./IncomeList.css";

const IncomeList = ({ incomeSources, isSample }) => {
  return (
    <div className={`income-grid ${isSample ? "sample" : ""}`}>
      {incomeSources.map((source) => (
        <IncomeCard key={source._id} source={source} />
      ))}
    </div>
  );
};
export default IncomeList;
