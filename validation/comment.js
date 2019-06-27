const Validator = require("validator");
const isEmpty = require("./is_empty");

module.exports = function validateCommentInput(data) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : "";
  data.pin_id = !isEmpty(data.pin_id) ? data.pin_id : "";

  if (Validator.isEmpty(data.text)) errors.text = "Text is required";
  if (Validator.isEmpty(data.pin_id)) errors.pin_id = "Pin ID is required";

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
