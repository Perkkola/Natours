import axios from "axios";
import { showAlert } from "./alerts";

export const updateSettings = async (data, type) => {
  try {
    const url =
      type === "password"
        ? "/api/v1/users/updatePassword"
        : "http://127.0.0.1:3000/api/v1/users/updateMe";

    console.log(data);
    const res = await axios({
      method: "PATCH",
      url,
      data,
    });

    if (res.data.status === "success") {
      showAlert("success", `${type} updated succesfully!`);
      //location.reload(true);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
