const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;
const isNumber = (value) => typeof value === "number" && Number.isFinite(value);
const isNonNegativeNumber = (value) => isNumber(value) && value >= 0;
const isArrayOfStrings = (value) => Array.isArray(value) && value.every((item) => isNonEmptyString(item));
const isEmail = (value) => typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const requireField = (errors, condition, message) => {
  if (!condition) {
    errors.push(message);
  }
};

const validateSpecifications = (specifications, errors, required = false) => {
  if (specifications === undefined) {
    if (required) {
      errors.push("Specifications are required");
    }
    return;
  }

  if (!Array.isArray(specifications)) {
    errors.push("Specifications must be an array");
    return;
  }

  for (const spec of specifications) {
    if (!spec || !isNonEmptyString(spec.name) || !isNonEmptyString(spec.value)) {
      errors.push("Each specification must include a name and value");
      return;
    }
  }
};

export const validateRegisterBody = (req) => {
  const { name, email, password } = req.body;
  const errors = [];

  requireField(errors, isNonEmptyString(name), "Name is required");
  requireField(errors, isEmail(email), "Valid email is required");
  requireField(errors, typeof password === "string" && password.length >= 6, "Password must be at least 6 characters");

  return errors;
};

export const validateLoginBody = (req) => {
  const { email, password } = req.body;
  const errors = [];

  requireField(errors, isEmail(email), "Valid email is required");
  requireField(errors, typeof password === "string" && password.length >= 6, "Password must be at least 6 characters");

  return errors;
};

export const validateProductBody = (req) => {
  const {
    name,
    brand,
    category,
    description,
    images,
    price,
    discountPrice,
    countInStock,
    colors,
    specifications,
  } = req.body;
  const errors = [];
  const isPartial = req.method === "PUT";

  if (!isPartial || name !== undefined) {
    requireField(errors, isNonEmptyString(name), "Product name is required");
  }
  if (!isPartial || brand !== undefined) {
    requireField(errors, isNonEmptyString(brand), "Brand is required");
  }
  if (!isPartial || category !== undefined) {
    requireField(errors, isNonEmptyString(category), "Category is required");
  }
  if (!isPartial || description !== undefined) {
    requireField(errors, isNonEmptyString(description), "Description is required");
  }
  if (!isPartial || images !== undefined) {
    requireField(errors, isArrayOfStrings(images) && images.length > 0, "At least one product image is required");
  }
  if (!isPartial || price !== undefined) {
    requireField(errors, isNonNegativeNumber(price), "Price must be a non-negative number");
  }
  if (discountPrice !== undefined) {
    requireField(errors, isNonNegativeNumber(discountPrice), "Discount price must be a non-negative number");
  }
  if (!isPartial || countInStock !== undefined) {
    requireField(errors, Number.isInteger(countInStock) && countInStock >= 0, "Stock must be a non-negative integer");
  }
  if (colors !== undefined) {
    requireField(errors, isArrayOfStrings(colors), "Colors must be an array of strings");
  }

  validateSpecifications(specifications, errors, false);

  if (
    isNumber(price) &&
    discountPrice !== undefined &&
    isNumber(discountPrice) &&
    discountPrice > price
  ) {
    errors.push("Discount price cannot be greater than price");
  }

  return errors;
};

export const validateOrderBody = (req) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
  } = req.body;
  const errors = [];

  requireField(errors, Array.isArray(orderItems) && orderItems.length > 0, "At least one order item is required");

  if (Array.isArray(orderItems)) {
    for (const item of orderItems) {
      if (
        !item ||
        !isNonEmptyString(item.name) ||
        !isNonEmptyString(item.image) ||
        !isNonNegativeNumber(item.price) ||
        !Number.isInteger(item.qty) ||
        item.qty <= 0 ||
        !isNonEmptyString(item.product)
      ) {
        errors.push("Each order item must include name, image, product, qty and price");
        break;
      }
    }
  }

  requireField(
    errors,
    shippingAddress &&
      isNonEmptyString(shippingAddress.address) &&
      isNonEmptyString(shippingAddress.city) &&
      isNonEmptyString(shippingAddress.postalCode) &&
      isNonEmptyString(shippingAddress.country),
    "Complete shipping address is required"
  );
  requireField(errors, isNonEmptyString(paymentMethod), "Payment method is required");
  requireField(errors, isNonNegativeNumber(itemsPrice), "Items price must be a non-negative number");
  requireField(errors, isNonNegativeNumber(shippingPrice), "Shipping price must be a non-negative number");
  requireField(errors, isNonNegativeNumber(totalPrice), "Total price must be a non-negative number");

  return errors;
};
