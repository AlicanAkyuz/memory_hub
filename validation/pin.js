const Validator = require("validator");
const isEmpty = require("./is_empty");

module.exports = function validatePinInput(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : "";
  data.author = !isEmpty(data.author) ? data.author : "";
  data.content = !isEmpty(data.content) ? data.content : "";
  data.image = !isEmpty(data.image) ? data.image : "";
  data.latitude = !isEmpty(data.latitude) ? data.latitude : "";
  data.longitude = !isEmpty(data.longitude) ? data.longitude : "";

  if (Validator.isEmpty(data.title)) errors.title = "Title is required";
  if (Validator.isEmpty(data.author)) errors.author = "Author is required";
  if (Validator.isEmpty(data.content)) errors.content = "Content is required";
  if (Validator.isEmpty(data.image)) errors.image = "Image is required";
  if (!Validator.isURL(data.image)) errors.image = "Not a valid URL";

  if (Validator.isEmpty(data.latitude)) {
    errors.latitude = "Latitude is required";
  }

  if (Validator.isEmpty(data.longitude)) {
    errors.longitude = "Longitude is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
