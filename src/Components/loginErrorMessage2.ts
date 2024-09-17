export type AuthErrorCode =
  | "auth/invalid-email"
  | "auth/user-not-found"
  | "auth/wrong-password"
  | "auth/weak-password"
  | "auth/network-request-failed"
  | "auth/invalid-credential";

const errorMessages: Record<AuthErrorCode, string> = {
  "auth/invalid-email":
    "This is not not valid email address.",
  "auth/user-not-found":
    "No user found with this email address. Please check and try again.",
  "auth/wrong-password": "The password is incorrect. Please try again.",
  "auth/weak-password":
    "The password is too weak. Please use a stronger password.",
  "auth/network-request-failed":
    "Network error. Please check your internet connection and try again.",
  "auth/invalid-credential": "Email or Password is Wrong",
};

export const getErrorMessage2 = (errorCode: any): any => {
  return errorMessages[errorCode as AuthErrorCode];
};
