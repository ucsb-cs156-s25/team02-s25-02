import {
  cellToAxiosParamsDelete,
  onDeleteSuccess,
} from "main/utils/menuItemReviewUtils";
import { toast } from "react-toastify";

// Mock the toast function
jest.mock("react-toastify", () => ({
  toast: jest.fn(),
}));

describe("menuItemReviewUtils", () => {
  describe("cellToAxiosParamsDelete", () => {
    test("should return the correct axios params", () => {
      const cell = {
        row: {
          values: {
            id: 1,
          },
        },
      };

      const result = cellToAxiosParamsDelete(cell);

      expect(result).toEqual({
        url: "/api/menuitemreview",
        method: "DELETE",
        params: {
          id: 1,
        },
      });
    });
  });

  describe("onDeleteSuccess", () => {
    beforeEach(() => {
      toast.mockClear();
    });

    // just general testing
    test("should call toast with the message", () => {
      const message = "Menu item review with id 1 was deleted";
      onDeleteSuccess(message);
      expect(toast).toHaveBeenCalledWith(message);
    });
  });
});
