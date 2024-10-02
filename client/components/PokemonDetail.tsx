import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchPokemonByName } from '../apis/pokemon.ts'
import LoadingSpinner from './LoadingSpinner.tsx'
import { useState } from 'react'

export default function PokemonDetail() {
  const { name } = useParams()

  const {
    data: pokemon,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['pokemonDetail', name],
    queryFn: () => fetchPokemonByName(`${name}`),
  })
  const [hidden, setHidden] = useState(true)

  if (isError) {
    return <h3> UH oh You cant find: {error?.message}</h3>
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (pokemon)
    return (
      <div>
        <h1>{name}</h1>
        <h2>Types: </h2>
        {pokemon.types.map(({ type, slot }) => (
          <p key={slot}>{type.name}</p>
        ))}
        <div
          onMouseEnter={() => setHidden(false)}
          onMouseLeave={() => setHidden(true)}
        >
          {hidden ? (
            <img
              src={pokemon.sprites.front_default}
              alt={`Front Default Sprite for ${pokemon.name}`}
            />
          ) : (
            <img
              src={pokemon.sprites.back_default}
              alt={`Back Default Sprite for ${pokemon.name}`}
            />
          )}
        </div>
        <div
          onMouseEnter={() => setHidden(false)}
          onMouseLeave={() => setHidden(true)}
        >
          {hidden ? (
            <img
              src={pokemon.sprites.front_shiny}
              alt={`Front Default Sprite for ${pokemon.name}`}
            />
          ) : (
            <img
              src={pokemon.sprites.back_shiny}
              alt={`Back Default Sprite for ${pokemon.name}`}
            />
          )}
        </div>
        <section>
          <h2>Abilities: </h2>
          {pokemon.abilities.map(({ ability, slot }) => (
            <p key={slot}>{ability.name}</p>
          ))}
        </section>
        <section>
          <h2>Moves: </h2>
          {pokemon.moves.map(({ move }) => (
            <p key={move.name}>{move.name}</p>
          ))}
        </section>
      </div>
    )
}
