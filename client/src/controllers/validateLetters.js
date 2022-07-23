// Function: returns {} or {err: message} if input argument includes only letters and spaces or not, respectively
export default function validate(input) {
  let errors = {},
    message = "Ingresar solo letras y/o espacios";

  if (!/^[a-zA-Z\s]+$/.test(input) && input.length) errors.err = message;

  return errors;
}
