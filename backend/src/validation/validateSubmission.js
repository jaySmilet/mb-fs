const schema = require("../../data/form-schema.json");

function validateSubmission(req, res, next) {
  const data = req.body;
  const errors = {};

  for (const field of schema.fields) {
    const value = data[field.name];
    const rules = field.validation || {};

    // required
    if (
      rules.required &&
      (value === undefined || value === null || value === "")
    ) {
      errors[field.name] = `${field.label} is required`;
      continue;
    }

    if (value === undefined || value === null || value === "") continue;

    // type-based rules
    if (field.type === "text" || field.type === "textarea") {
      if (rules.minLength && value.length < rules.minLength) {
        errors[
          field.name
        ] = `${field.label} must be at least ${rules.minLength} chars`;
      }
      if (
        !errors[field.name] &&
        rules.maxLength &&
        value.length > rules.maxLength
      ) {
        errors[
          field.name
        ] = `${field.label} must be at most ${rules.maxLength} chars`;
      }
      if (!errors[field.name] && rules.regex) {
        const regex = new RegExp(rules.regex);
        if (!regex.test(value)) {
          errors[field.name] = `${field.label} format is invalid`;
        }
      }
    }

    if (field.type === "number") {
      const num = Number(value);
      if (Number.isNaN(num)) {
        errors[field.name] = `${field.label} must be a number`;
      } else {
        if (rules.min !== undefined && num < rules.min) {
          errors[field.name] = `${field.label} must be >= ${rules.min}`;
        }
        if (!errors[field.name] && rules.max !== undefined && num > rules.max) {
          errors[field.name] = `${field.label} must be <= ${rules.max}`;
        }
      }
    }

    if (field.type === "date" && rules.minDate) {
      const d = new Date(value);
      const min = new Date(rules.minDate);
      if (d < min) {
        errors[field.name] = `${field.label} must be after ${rules.minDate}`;
      }
    }

    if (field.type === "multi-select") {
      const arr = Array.isArray(value) ? value : [];
      if (rules.minSelected && arr.length < rules.minSelected) {
        errors[
          field.name
        ] = `${field.label} requires at least ${rules.minSelected} selections`;
      }
      if (
        !errors[field.name] &&
        rules.maxSelected &&
        arr.length > rules.maxSelected
      ) {
        errors[
          field.name
        ] = `${field.label} allows at most ${rules.maxSelected} selections`;
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
}

module.exports = validateSubmission;
