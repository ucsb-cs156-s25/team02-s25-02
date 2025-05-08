import { toast } from "react-toastify";

export const cellToAxiosParamsDelete = (cell) => ({
  url: "/api/menuitemreview",
  method: "DELETE",
  params: {
    id: cell.row.values.id,
  },
});

export const onDeleteSuccess = (message) => {
  console.log(message);
  toast(message);
};
