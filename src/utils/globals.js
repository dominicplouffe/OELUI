export const USER_INFO = "oel_user_info";
export const ROLE_INFO = "oel_role_info";
export const ACCESS = "accessToken";
export const REFRESH = "refreshToken";

const API_URL = process.env.REACT_APP_API;

const REASONS = {
  invalid_value: "Invalid Value",
  key_error: "Key Error",
  value_error: "Value Error",
  status_code: "Status Code",
  connection_error: "Connection Error",
  timeout_error: "Timeout Error",
  http_error: "HTTP Error",
  "Receive Alert": "Received Alert",
};

export { API_URL, REASONS };
