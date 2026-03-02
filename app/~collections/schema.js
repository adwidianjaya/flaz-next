const toFieldLabel = (name) =>
  name
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const toFieldName = (label, fallbackIndex) => {
  const normalized = String(label || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return normalized || `field_${fallbackIndex}`;
};

const getDefaultValue = (type) => {
  switch (type) {
    case "number":
      return 0;
    case "boolean":
      return false;
    case "json":
      return {};
    default:
      return "";
  }
};

export const COLLECTION_FIELD_TYPES = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "boolean", label: "Boolean" },
  { value: "json", label: "JSON" },
];

export const createFieldDefinition = (index, partialField = {}) => {
  const fieldName = toFieldName(
    partialField.name || partialField.label,
    index + 1,
  );

  return {
    id: partialField.id || crypto.randomUUID(),
    name: fieldName,
    label: partialField.label || toFieldLabel(fieldName) || `Field ${index + 1}`,
    type: partialField.type || "text",
  };
};

export const createRowDefinition = (fields, partialRow = {}) => {
  const values = fields.reduce((acc, field) => {
    if (partialRow.values && Object.hasOwn(partialRow.values, field.id)) {
      acc[field.id] = partialRow.values[field.id];
      return acc;
    }

    if (Object.hasOwn(partialRow, field.id)) {
      acc[field.id] = partialRow[field.id];
      return acc;
    }

    acc[field.id] = getDefaultValue(field.type);
    return acc;
  }, {});

  return {
    id: partialRow.id || crypto.randomUUID(),
    values,
  };
};

export const normalizeCollectionSchema = (schema) => {
  const source = schema && typeof schema === "object" ? schema : {};
  const sourceFields = Array.isArray(source.fields) ? source.fields : [];
  const fields = sourceFields.map((field, index) =>
    createFieldDefinition(index, field),
  );

  const sourceRows = Array.isArray(source.rows) ? source.rows : [];
  const rows = sourceRows.map((row) => createRowDefinition(fields, row));

  return {
    fields,
    rows,
  };
};

export const buildCollectionSchema = (schema) =>
  normalizeCollectionSchema(schema);
