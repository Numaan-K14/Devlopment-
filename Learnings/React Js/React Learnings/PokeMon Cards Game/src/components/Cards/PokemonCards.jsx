
export function PokemonCards({ pokData }) {
  return (
    <>
      <li className="pokemon-card">
        <figure>
          <img
            src={pokData.sprites.other.dream_world.front_default}
            className="pokemon-image"
          />
        </figure>
        <h1 className="pokemon-name">{pokData.name}</h1>
        <div className="pokemon-info pokemon-highlight">
          <p>
            {pokData.types
              .map((currentType) => currentType.type.name)
              .join(", ")}
            {/* here 2 types of data in one parent because use join , */}
          </p>
        </div>
        <div className="grid-three-cols">
          <p className="pokemon-info">Height : {pokData.height}</p>
          <p className="pokemon-info">Weight : {pokData.weight}</p>
          <p className="pokemon-info">Speed : {pokData.stats[5].base_stat}</p>
        </div>
        <div className="grid-three-cols">
          <div className="pokemon-info">
            <p> {pokData.base_experience}</p>
            <span>Experience</span>
          </div>

          <div className="pokemon-info">
            <p>{pokData.stats[1].base_stat}</p>
            <span>Attack</span>
          </div>
          <div className="pokemon-info">
            <p>{pokData.abilities.map((abilityInfo) => abilityInfo.ability.name).slice(0,1).join(", ")}</p>
            <span>Abilities</span>
          </div>
        </div>
      </li>
    </>
  );
}

