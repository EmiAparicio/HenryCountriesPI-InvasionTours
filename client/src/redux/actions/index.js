const countries = [
  {
    id: "BDI",
    name: "Burundi",
    flag: "https://flagcdn.com/bi.svg",
    continent: "Africa",
    capital: "Gitega",
    subregion: "Eastern Africa",
    area: 27834,
    population: 11890781,
  },
  {
    id: "NGA",
    name: "Nigeria",
    flag: "https://flagcdn.com/ng.svg",
    continent: "Africa",
    capital: "Abuja",
    subregion: "Western Africa",
    area: 923768,
    population: 206139587,
  },
  {
    id: "KAZ",
    name: "Kazakhstan",
    flag: "https://flagcdn.com/kz.svg",
    continent: "Asia",
    capital: "Nur-Sultan",
    subregion: "Central Asia",
    area: 2724900,
    population: 18754440,
  },
  {
    id: "NAM",
    name: "Namibia",
    flag: "https://flagcdn.com/na.svg",
    continent: "Africa",
    capital: "Windhoek",
    subregion: "Southern Africa",
    area: 825615,
    population: 2540916,
  },
  {
    id: "LAO",
    name: "Laos",
    flag: "https://flagcdn.com/la.svg",
    continent: "Asia",
    capital: "Vientiane",
    subregion: "South-Eastern Asia",
    area: 236800,
    population: 7275556,
  },
  {
    id: "MOZ",
    name: "Mozambique",
    flag: "https://flagcdn.com/mz.svg",
    continent: "Africa",
    capital: "Maputo",
    subregion: "Eastern Africa",
    area: 801590,
    population: 31255435,
  },
  {
    id: "BIH",
    name: "Bosnia and Herzegovina",
    flag: "https://flagcdn.com/ba.svg",
    continent: "Europe",
    capital: "Sarajevo",
    subregion: "Southeast Europe",
    area: 51209,
    population: 3280815,
  },
  {
    id: "MNG",
    name: "Mongolia",
    flag: "https://flagcdn.com/mn.svg",
    continent: "Asia",
    capital: "Ulan Bator",
    subregion: "Eastern Asia",
    area: 1564110,
    population: 3278292,
  },
  {
    id: "SUR",
    name: "Suriname",
    flag: "https://flagcdn.com/sr.svg",
    continent: "South America",
    capital: "Paramaribo",
    subregion: "South America",
    area: 163820,
    population: 586634,
  },
  {
    id: "WSM",
    name: "Samoa",
    flag: "https://flagcdn.com/ws.svg",
    continent: "Oceania",
    capital: "Apia",
    subregion: "Polynesia",
    area: 2842,
    population: 198410,
  },
];

export const GET_COUNTRIES = "GET_COUNTRIES";

export function getCountries(name = "?") {
  return function (dispatch) {
    fetch(
      `http://localhost:3001/countries${
        name !== "?" && name !== "" ? `?name=${name}` : ""
      }`
    )
      .then((response) => response.json())
      .then((countries) =>
        dispatch({
          type: GET_COUNTRIES,
          payload:
            name !== "?"
              ? name === ""
                ? { partial: true, countries: [] }
                : { partial: true, countries }
              : { partial: false, countries },
        })
      );
  };

  // return {
  //   type: GET_COUNTRIES,
  //   payload:
  //     name !== "?"
  //       ? name === ""
  //         ? { partial: true, countries: [] }
  //         : { partial: true, countries: [countries[0], countries[1]] }
  //       : countries,
  // };
}
