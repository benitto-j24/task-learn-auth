import * as Yup from "yup";

export const signupSchema = Yup.object({
  email: Yup.string().required().email(),
  phone: Yup.string().required(),
  password: Yup.string()
    .trim()
    .matches(
      /^(?=.*[!@#$%^&*()_+{}\[\]:;"'<>,.?/~`|\\]).*$/,
      "Use a symbol(e.g.!@#$)"
    )
    .matches(/(?=.*\d)/, "Use a number(e.g.1234)")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z]).*$/,
      "Use upper and lower case letters(e.g.Aa)"
    )
    .min(8, "Use 8 or more characters").required()
    ,
});

type signupSchema = Yup.InferType<typeof signupSchema>;

export const LENGTH_REGEX = new RegExp(/.{8,}$/);
export const UPPERLOWERCASE_REGEX = new RegExp(/^(?=.*[a-z])(?=.*[A-Z]).*$/);

export const NUMBER_REGEX = new RegExp(/(?=.*\d)/);
export const SPECIAL_CHARS_REGEX = new RegExp(
  /^(?=.*[!@#$%^&*()_+{}\[\]:;"'<>,.?/~`|\\]).*$/
);

export const rules = [
  {
    label: "Use 8 or more characters",
    pattern: LENGTH_REGEX,
  },
  {
    label: "Use upper and lower case letters(e.g.Aa)",
    pattern: UPPERLOWERCASE_REGEX,
  },
  {
    label: "Use a number(e.g.1234)",
    pattern: NUMBER_REGEX,
  },
  {
    label: "Use a symbol(e.g.!@#$)",
    pattern: SPECIAL_CHARS_REGEX,
  },
];

//error firebase

