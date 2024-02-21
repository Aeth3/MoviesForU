import { useCallback, useState } from "react";
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
import { useMovies } from "../useMovies";
import { useLocalStorageState } from "../useLocalStorageState";
import { useKey } from "../useKey";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [isOpen1, setIsOpen1] = useState(true);
  const [isOpen2, setIsOpen2] = useState(true);
  const [detailsError, setDetailsError] = useState("");
  // const [watched, setWatched] = useState(function () {
  //   const storedValue = localStorage.getItem("watched");
  //   return JSON.parse(storedValue);
  // });
  const handleCloseDetails = useCallback(() => setSelectedId(null), []);
  const [watched, setWatched] = useLocalStorageState([], "watched");

  const { movies, error, isLoading, KEY } = useMovies(
    query,
    handleCloseDetails
  );

  useKey("Escape", handleCloseDetails);

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
              handleCloseDetails={handleCloseDetails}
            />
          )}
        </Box>
      </Main>
    </>
  );
}
