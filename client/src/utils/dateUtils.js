// client/src/utils/dateUtils.js

import {
  isToday,
  isThisWeek,
  isThisMonth,
  isThisYear,
  parseISO,
} from "date-fns";

/**
 * @function groupAndSortPayments
 * @desc     Groups a list of payments (recurrings or loans) by their due date
 * into human-readable categories and sorts them chronologically.
 * @param    {Array} payments - An array of payment objects. Each object must have a `nextDueDate`.
 * @returns  {Object} An object where keys are date groups (like "Today", "This Week")
 * and values are arrays of payments belonging to that group.
 */
export const groupAndSortPayments = (payments) => {
  // Sort all payments by date first to ensure they are in chronological order.
  const sortedPayments = payments
    .map((p) => ({ ...p, date: parseISO(p.nextDueDate) }))
    .sort((a, b) => a.date - b.date);

  const groups = {
    Today: [],
    "This Week": [],
    "This Month": [],
    "This Year": [],
    Later: [],
  };

  sortedPayments.forEach((payment) => {
    const paymentDate = payment.date;
    if (isToday(paymentDate)) {
      groups.Today.push(payment);
    } else if (isThisWeek(paymentDate, { weekStartsOn: 1 })) {
      groups["This Week"].push(payment);
    } else if (isThisMonth(paymentDate)) {
      groups["This Month"].push(payment);
    } else if (isThisYear(paymentDate)) {
      groups["This Year"].push(payment);
    } else {
      groups["Later"].push(payment);
    }
  });

  // Clean up empty groups for a tidier UI.
  Object.keys(groups).forEach((key) => {
    if (groups[key].length === 0) {
      delete groups[key];
    }
  });

  return groups;
};
