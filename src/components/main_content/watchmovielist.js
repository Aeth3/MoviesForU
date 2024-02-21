import WatchedMovie from "./watchedmovie";
export default function WatchedMovieList({ watched, setWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} key={movie.imdbID} setWatched={setWatched}/>
      ))}
    </ul>
  );
}
