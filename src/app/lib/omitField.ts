export const omitField = (
  object: Record<string, unknown>,
  fields: string[],
) => {
  fields.forEach((field) => {
    delete object[field];
  });

  return object;
};
