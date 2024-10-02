import { PokemonGeneration } from '../../models/pokemon.ts'
import { useQuery } from '@tanstack/react-query'
import { fetchPokemonGeneration } from '../apis/pokemon.ts'
import LoadingSpinner from './LoadingSpinner.tsx'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

// Helper function to fetch Pokémon details including the image
async function fetchPokemonDetails(url: string) {
  const response = await fetch(url)
  const data = await response.json()
  return data
}

export default function PokemonList() {
  const {
    data: generation,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['pokemon'],
    queryFn: () => fetchPokemonGeneration(1),
  })

  const [pokemonDetails, setPokemonDetails] = useState([])

  useEffect(() => {
    if (generation) {
      const fetchDetails = async () => {
        const details = await Promise.all(
          generation.pokemon_species.map(async (p) => {
            const pokemonData = await fetchPokemonDetails(
              p.url.replace('pokemon-species', 'pokemon'),
            )
            return {
              name: p.name,
              image: pokemonData.sprites.front_default, // Get the front sprite image
              id: pokemonData.id,
            }
          }),
        )
        setPokemonDetails(details)
      }
      fetchDetails()
    }
  }, [generation])

  if (isError) {
    return <p> Uh oh, you've caught an error: ({error.message})</p>
  }
  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <>
      <h2>Pokémon in {generation.main_region.name}:</h2>
      <div className="pokedex">
        {pokemonDetails.map((p) => (
          <div className="pokemon-card" key={p.id}>
            <img src={p.image} alt={p.name} />
            <h2>{p.name.charAt(0).toUpperCase() + p.name.slice(1)}</h2>
            <Link to={`/pokemon/${p.name}`}>View Details</Link>
          </div>
        ))}
      </div>
    </>
  )
}
