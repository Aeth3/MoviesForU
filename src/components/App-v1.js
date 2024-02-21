import { useEffect, useState } from "react";
import NoMovies from "./error_handler/nomovies";
import ErrorMessage from "./error_handler/errormessage";
import NavBar from "./nav_content/navbar";
import Search from "./nav_content/search";
import MovieDetails from "./main_content/moviedetails";
import NumResults from "./nav_content/numresults";
import Main from "./main_content/main";
import Box from "./main_content/box";
import ProgressIndicator from "./error_handler/progressindicator";
import MovieList from "./main_content/movielist";
import Summary from "./main_content/summary";
import WatchedMovieList from "./main_content/watchmovielist";

const KEY = "792b890a";

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isOpen1, setIsOpen1] = useState(true);
  const [isOpen2, setIsOpen2] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [detailsError, setDetailsError] = useState("");

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );
          if (!res.ok) {
            throw new Error("Something went wrong. Please try again");
          }
          const data = await res.json();

          if (data.Response === "False") {
            throw new Error("No Movie found");
          }
          
          setMovies(data.Search);
          setError("");
        } catch (error) {
          if (error.name !== "AbortError") {
            setError(error.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      setSelectedId(null);
      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box isOpen={isOpen1} setIsOpen={setIsOpen1}>
          {/* {isLoading && <ProgressIndicator />}
          {!isLoading && !error && <MovieList movies={movies} />}
          {error && <ErrorMessage message={error} />} */}
          {isLoading ? (
            <ProgressIndicator />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : movies.length === 0 ? (
            <NoMovies />
          ) : (
            <MovieList
              movies={movies}
              setWatched={setWatched}
              watched={watched}
              setSelectedId={setSelectedId}
            />
          )}
        </Box>
        <Box isOpen={isOpen2} setIsOpen={setIsOpen2}>
          {!selectedId ? (
            <>
              <Summary watched={watched} />
              <WatchedMovieList watched={watched} setWatched={setWatched} />
            </>
          ) : detailsError ? (
            <ErrorMessage message={detailsError} />
          ) : (
            <MovieDetails
              selectedId={selectedId}
              KEY={KEY}
              setDetailsError={setDetailsError}
              setSelectedId={setSelectedId}
              watched={watched}
              setWatched={setWatched}
            />
          )}
        </Box>
      </Main>
    </>
  );
}
