export default function validate(input) {
  let errors = {};
  if (!/^[a-zA-Z\s]+$/.test(input) && input.length)
    errors.err = "Ingresar solo letras y/o espacios";
  return errors;
}
