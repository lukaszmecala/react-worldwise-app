import { useParams } from "react-router-dom";
import { useEffect } from "react";
import styles from "./City.module.css";
import { useCities } from "../contexts/CitiesContext";
import Spinner from "./Spinner";
import ButtonBack from "./ButtonBack";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
function City() {
  const { id } = useParams();

  const { getCity, currentCities, isLoading } = useCities();

  useEffect(() => {
    getCity(id);
  }, [id, getCity]);

  const { cityName, emoji, date, notes } = currentCities;

  if (isLoading) return <Spinner />;

  return (
    <div className={styles.city}>
      <div className={styles.row}>
        <h6>City name</h6>
        <h3>
          <span>{emoji}</span> {cityName}
        </h3>
      </div>

      <div className={styles.row}>
        <h6>You went to {cityName} on</h6>
        <p>{formatDate(date || null)}</p>
      </div>

      {notes && (
        <div className={styles.row}>
          <h6>Your notes</h6>
          <p>{notes}</p>
        </div>
      )}

      <div className={styles.row}>
        <h6>Learn more</h6>
        <a
          href={`https://en.wikipedia.org/wiki/${cityName}`}
          target="_blank"
          rel="noreferrer"
        >
          Check out {cityName} on Wikipedia &rarr;
        </a>
      </div>

      <div className={styles.btnBack}>
        <ButtonBack />
      </div>
    </div>
  );
}

export default City;
