export const cellToAxiosParamsDelete = (cell) => ({
  url: "/api/menuitemreview",
  method: "DELETE",
  params: {
    id: cell.row.values.id,
  },
});

export const onDeleteSuccess = (response) => {
  // For now, just return the response
  return response;
};
