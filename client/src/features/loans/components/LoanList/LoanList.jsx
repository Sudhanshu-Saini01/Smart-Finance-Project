// client/src/features/loans/components/LoanList/LoanList.jsx
import React from "react";
import InfoCard from "@/components/ui/InfoCard/InfoCard";
import "./LoanList.css"; // We'll create this in the main page CSS

const LoanList = ({ loans }) => {
  return (
    <div className="loan-list-container">
      <h3>Your Active Loans</h3>
      <div className="loans-grid">
        {loans && loans.length > 0 ? (
          loans.map((loan) => (
            <InfoCard
              key={loan._id}
              title={loan.loanName}
              primaryStats={[
                {
                  label: "Remaining",
                  value: new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                  }).format(loan.totalAmount - (loan.amountPaid || 0)),
                },
                {
                  label: "Monthly EMI",
                  value: new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                  }).format(loan.emi),
                },
              ]}
              progress={((loan.amountPaid || 0) / loan.totalAmount) * 100}
              details={[
                { label: "Lender", value: loan.lender },
                { label: "Interest Rate", value: `${loan.interestRate}% p.a.` },
                {
                  label: "End Date",
                  value: new Date(loan.endDate).toLocaleDateString(),
                },
              ]}
            />
          ))
        ) : (
          <div className="empty-state">
            <p>You have no active loans. Congratulations!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanList;
