

export function SearchCountry(e) {
  const input = e.target.value;

  setSelectCountry((prev) => {
    const newState =
      !/^[a-zA-Z\s]+$/.test(input) && input !== "" ? prev : input;

    setErrors((prev) => ({ ...prev, country: validateLetters(input) }));
    return newState;
  });
}
