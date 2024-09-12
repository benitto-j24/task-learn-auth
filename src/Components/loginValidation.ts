import * as Yup from "yup";

export const loginSchema = Yup.object({
  email: Yup.string().required(),
  password: Yup.string().required(),
});


type loginSchema = Yup.InferType<typeof loginSchema>;