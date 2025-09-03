// // server/controllers/incomeSourceController.js

// import IncomeSource from "../models/IncomeSource.js";

// // @desc    Get all income sources for the logged-in user
// // @route   GET /api/income-sources
// // @access  Private
// export const getIncomeSources = async (req, res, next) => {
//   try {
//     // SECURITY FIX: Only find sources where the 'user' field matches the logged-in user's ID
//     const sources = await IncomeSource.find({ user: req.user.id }).sort({
//       createdAt: -1,
//     });
//     res.json(sources);
//   } catch (err) {
//     next(err); // Pass errors to a central error handler
//   }
// };

// // @desc    Create a new income source for the logged-in user
// // @route   POST /api/income-sources
// // @access  Private
// export const createIncomeSource = async (req, res, next) => {
//   try {
//     // The form data comes from the request body
//     const { sourceName, incomeType, grossAmount, netAmount, frequency } =
//       req.body;

//     const newSource = new IncomeSource({
//       sourceName,
//       incomeType,
//       grossAmount,
//       netAmount,
//       frequency,
//       user: req.user.id, // SECURITY: Set the user ID from the authenticated user
//     });

//     const source = await newSource.save();
//     res.status(201).json(source);
//   } catch (err) {
//     next(err);
//   }
// };

// // export { getIncomeSources, createIncomeSource };

import IncomeSource from "../models/IncomeSource.js";
export const getIncomeSources = async (req, res, next) => {
  try {
    const sources = await IncomeSource.find({ user: req.user.id });
    res.json(sources);
  } catch (err) {
    next(err);
  }
};
export const createIncomeSource = async (req, res, next) => {
  try {
    const newSource = new IncomeSource({ ...req.body, user: req.user.id });
    const source = await newSource.save();
    res.status(201).json(source);
  } catch (err) {
    next(err);
  }
};

// --- NEW: Function to update an income source ---
export const updateIncomeSource = async (req, res, next) => {
  try {
    const source = await IncomeSource.findById(req.params.id);

    // Security check: Make sure the source exists AND belongs to the logged-in user
    if (!source || source.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Income source not found" });
    }

    const updatedSource = await IncomeSource.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedSource);
  } catch (err) {
    next(err);
  }
};

// --- NEW: Function to delete an income source ---
export const deleteIncomeSource = async (req, res, next) => {
  try {
    const source = await IncomeSource.findById(req.params.id);

    // Security check: Make sure the source exists AND belongs to the logged-in user
    if (!source || source.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Income source not found" });
    }

    await source.deleteOne();
    res.json({ message: "Income source removed" });
  } catch (err) {
    next(err);
  }
};
