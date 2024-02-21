export default function ResultMovie({ movie, setSelectedId }) {
    function handleDetails(id) {
      setSelectedId((selectedId) => (selectedId === id ? null : id));
    }
    return (
      <li onClick={() => handleDetails(movie.imdbID)}>
        <img src={movie.Poster} alt={`${movie.Title} poster`} />
        <h3>{movie.Title}</h3>
        <div>
          <p>
            <span>🗓</span>
            <span>{movie.Year}</span>
          </p>
          {/* <button onClick={handleAddToWatchList}>Add to watchlist</button> */}
        </div>
      </li>
    );
  }