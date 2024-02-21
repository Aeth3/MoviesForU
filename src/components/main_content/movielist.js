import ResultMovie from "./resultmovie";
export default function MovieList({
  movies,
  setWatched,
  watched,
  setSelectedId,
}) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <ResultMovie
          key={movie.imdbID}
          movie={movie}
          setWatched={setWatched}
          watched={watched}
          setSelectedId={setSelectedId}
        />
      ))}
    </ul>
  );
}
