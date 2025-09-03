import Insurance from "../models/Insurance.js";
export const getInsurances = async (req, res, next) => {
  try {
    const insurances = await Insurance.find({ user: req.user.id });
    res.json(insurances);
  } catch (err) {
    next(err);
  }
};
