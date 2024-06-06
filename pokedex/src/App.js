import {useEffect, useState} from "react";
import PokemonThumbnails from "./Components/PokemonThumbnails";


function App() {

  const [allPokemons, setAllPokemons] = useState([]);
  const [loadMore, setLoadMore] = useState('https://pokeapi.co/api/v2/pokemon?limit=20');

  const getAllPokemons = async () => {
    const res = await fetch(loadMore);
    const data = await res.json();

    setLoadMore(data.next);

    const pokemonObjects = await Promise.all(
      data.results.map(async (pokemon) => {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
        const data = await res.json();
        return data;
      })
    );

    const uniquePokemons = [...new Set(allPokemons.concat(pokemonObjects).map(pokemon => pokemon.id))].map(id => {
      return allPokemons.concat(pokemonObjects).find(pokemon => pokemon.id === id);
    });

    setAllPokemons(uniquePokemons.sort((a, b) => a.id - b.id));
  }

  useEffect(() => {
    getAllPokemons()
  }, [])

  return (
    <div className="app-container">
      <h1>Pokemon Evolution</h1>
      <div className="pokemon-container">
        <div className="all-containers">
          {allPokemons.map((pokemonStats, index) => 
            <PokemonThumbnails
              key={index}
              id={pokemonStats.id}
              image={pokemonStats.sprites.other.dream_world.front_default}
              name={pokemonStats.name}
              type={pokemonStats.types[0].type.name}
            />)}
        </div>
        <button className="load-more" onClick={() => getAllPokemons()}>Load more</button>
      </div>
    </div>
  );
}

export default App;