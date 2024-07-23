const mongoose = require("mongoose");

const validateMongodbID = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) throw new Error("This is not a valid MongoDB Object ID");
};

module.exports = validateMongodbID;
