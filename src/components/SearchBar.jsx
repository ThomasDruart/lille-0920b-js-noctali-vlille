import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  InputStyled,
  SumbitSearch,
  SelectContainer,
  SelectStation,
  CityStations,
  NameStations,
} from "../ComponentsStyled/SearchBarStyled";

export default function SearchBar() {
  const [display, setDisplay] = useState(false);
  const [commune, setCommune] = useState([]);
  const wrapperRef = useRef(null);

  useEffect(() => {
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const findSearch = (stationsCity) => {
    axios
      .get(
        `https://opendata.lillemetropole.fr/api/records/1.0/search/?dataset=vlille-realtime&q=&rows=25&facet=libelle&facet=nom&facet=commune&facet=etat&facet=type&facet=etatconnexion`
      )
      .then(({ data }) => {
        let { records } = data;

        records = records.filter((record) => {
          return record.fields.commune.includes(stationsCity.toUpperCase());
          // la methode toUpperCase permet de récupérer la valeur de "commune"; qui est une chaine de caractère
          // en majuscule. Ainsi la recherche fonctionne en minuscule et en majuscule dans l'input.
        });
        setCommune(records);
        if (stationsCity === "") {
          return setCommune([]);
        }
      })
      .catch((err) => {
        console.log(err);
        console.log("It is a failure");
      });
  };

  const handleClickOutside = (e) => {
    const { current: wrap } = wrapperRef;
    if (wrap && !wrap.contains(e.target)) {
      setDisplay(false);
    }
  };

  return (
    <div ref={wrapperRef}>
      <InputStyled
        type="text"
        onClick={() => setDisplay(true)}
        placeholder="Chercher ma commune..."
        onChange={(e) => findSearch(e.target.value)}
      />
      <SumbitSearch type="submit">Chercher</SumbitSearch>
      {display && (
        <SelectContainer>
          {commune.map((station) => (
            <SelectStation>
              <CityStations>{station.fields.commune} - </CityStations>
              <NameStations>{station.fields.nom}</NameStations>
            </SelectStation>
          ))}
        </SelectContainer>
      )}
    </div>
  );
}