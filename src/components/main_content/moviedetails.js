import { useEffect, useRef, useState } from "react";
import ProgressIndicator from "../error_handler/progressindicator";
import StarRating from "./starrating";

export default function MovieDetails({
  selectedId,
  KEY,
  setDetailsError,
  watched,
  setWatched,
  handleCloseDetails,
}) {
  const [movieData, setMovieData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  const isWatched = watched.some((m) => m.imdbID === selectedId);

  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const countRef = useRef(0);

  useEffect(
    function () {
      if (userRating) countRef.current++;
    },
    [userRating]
  );

  useEffect(
    function () {
      async function fetchDetails() {
        setIsLoading(true);
        setDetailsError("");
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );
        if (!res.ok) {
          throw new Error("Something went wrong. Please try again");
        }
        const data = await res.json();
        setMovieData(data);

        if (data.Response === "False") {
          throw new Error("No Movie found");
        }
        setIsLoading(false);
      }

      fetchDetails();
    },
    [selectedId, KEY, setDetailsError]
  );

  function handleAddToWatchList() {
    const runtime = Number(movieData.Runtime.split(" ").at(0));

    const newWatchedMovie = {
      imdbID: movieData.imdbID,
      Title: movieData.Title,
      Year: movieData.Year,
      Poster: movieData.Poster,
      runtime: runtime,
      imdbRating: movieData.imdbRating,
      userRating: userRating,
      countRatingDecisions: countRef.current,
    };

    setWatched((currentMovies) => [...currentMovies, newWatchedMovie]);

    // localStorage.setItem(
    //   "watched",
    //   JSON.stringify([...watched, newWatchedMovie])
    // );
    handleCloseDetails();
  }

  useEffect(
    function () {
      if (!movieData.Title) return;
      document.title = `Movie | ${movieData.Title}`;

      // cleanup effect function
      return function () {
        document.title = "MoviesForU";
      };
    },
    [movieData]
  );

  

  return isLoading ? (
    <ProgressIndicator />
  ) : (
    <div className="details">
      <header>
        <button className="btn-back" onClick={handleCloseDetails}>
          &larr;
        </button>
        <img src={movieData.Poster} alt={`Poster of ${movieData.Title}`} />
        <div className="details-overview">
          <h2>{movieData.Title}</h2>
          <p>
            {movieData.Released} &bull; {movieData.Runtime}
          </p>
          <p>{movieData.Genre}</p>
          <p>
            <span>⭐</span>
            {movieData.imdbRating} IMDb rating
          </p>
        </div>
      </header>
      <section>
        <div className="rating">
          {isWatched ? (
            <p>You rated this movie {watchedUserRating}</p>
          ) : (
            <>
              <StarRating
                maxRating={10}
                size="24"
                setMovieRating={setUserRating}
                defaultRating={userRating}
              />
              {userRating > 0 && (
                <button className="btn-add" onClick={handleAddToWatchList}>
                  + Add to list
                </button>
              )}
            </>
          )}
        </div>

        <p>
          <em>{movieData.Plot}</em>
        </p>
        <p>Starring {movieData.Actors}</p>
        <p>Directed by {movieData.Director}</p>
      </section>
    </div>
  );
}
