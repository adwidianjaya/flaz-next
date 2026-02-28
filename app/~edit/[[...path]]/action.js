"use server";

export const saveCurrentPage = async ({ name, path, definition, schema }) => {
  console.log("...saveCurrentPage", { name });

  return {
    success: true,
  };
};
