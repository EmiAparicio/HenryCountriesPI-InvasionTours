/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { setStoredPage } from "../../../redux/actions";
import { ShowCountries } from "./ShowCountries";

export function Pagination({ showCountries }) {
  const navigate = useNavigate();

  if (!localStorage.getItem("page")) localStorage.setItem("page", 1);

  function useQuery() {
    const { search } = useLocation();

    return useMemo(() => new URLSearchParams(search), [search]);
  }
  const query = useQuery().get("page");

  const storedPage = useSelector((state) => state.page);
  const [page, setPage] = useState(
    query ? Number(query) : Number(storedPage)
  );

  useEffect(() => setPage(() => storedPage), [storedPage]);

  useEffect(() => {
    if (query) setPage(Number(query));
    else navigate(`/home?page=1`, { replace: true });
  }, [query]);

  function handlePage(e) {
    const page = Number(e.target.innerText);

    localStorage.setItem("page", page);
    setStoredPage(page);
    setPage(() => page);
    navigate(`/home?page=${page}`, { replace: false });
  }

  const paginationArray = Array.from(
    Array(Math.ceil((showCountries.length + 1) / 10) + 1).keys()
  );

  return (
    <div>
      <div>
        {page < 1 || page >= paginationArray.length ? (
          <span>Página no válida</span>
        ) : showCountries.length ? (
          paginationArray.map((p, id) => {
            if (id > 0)
              return id === 1 ||
                id === paginationArray.length - 1 ||
                (id <= page + 1 && id >= page -1) ? (
                <div key={id}>
                  <button onClick={handlePage}>{p}</button>
                </div>
              ) : id <= page + 2 && id >= page - 2 ? (
                <div key={id}>...</div>
              ) : (
                <React.Fragment key={id}></React.Fragment>
              );
            return <React.Fragment key={id}></React.Fragment>;
          })
        ) : (
          <span>Sin resultados: Limpiar</span>
        )}
      </div>
      <ShowCountries showCountries={showCountries} page={page} />
    </div>
  );
}
