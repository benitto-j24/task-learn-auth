// lib/errorMessages.ts
export type AuthErrorCode =
  | "auth/user-not-found"
  | "auth/wrong-password"
  | "auth/email-already-in-use"
  | "auth/weak-password"; 

const errorMessages: Record<AuthErrorCode, string> = {
  
  "auth/user-not-found":
    "No user found with this email address. Please check and try again.",
  "auth/wrong-password": "The password is incorrect. Please try again.",
  "auth/email-already-in-use":
    "This email address is already in use.",
  "auth/weak-password":
    "The password is too weak. Please use a stronger password.",

};

export const getErrorMessage = (errorCode: string):string => {
  return (
    errorMessages[errorCode as AuthErrorCode] 
  );
};
