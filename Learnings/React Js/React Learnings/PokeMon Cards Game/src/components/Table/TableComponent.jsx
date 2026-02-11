export function TableComponent({ pokData, abc }) {
  return (
    <tr className="border border-gray-300 hover:bg-green-100">
      <td className="px-3 font-semibold text-xl text-gray-900">{abc}</td>
      <td className="py-3 px-4">
        <img
          src={pokData.sprites?.front_default}
          alt={pokData.name}
          className="w-20 h-20"
        />
      </td>

      <td className="py-3 px-4 font-bold text-xl text-gray-900">
        {pokData.name}
      </td>
      <td className="py-3 px-4 font-medium text-lg">
        {pokData.types[0]?.type.name}
      </td>
      <td className="py-3 px-4  font-semibold text-xl text-gray-900">
        {pokData.height}
      </td>
      <td className="py-3 px-4  font-semibold text-xl text-gray-900">
        {pokData.weight}
      </td>
      <td className="py-3 px-4  font-semibold text-xl text-gray-900">
        {pokData.stats[5]?.base_stat}
      </td>
      <td className="py-3 px-4  font-semibold text-xl text-gray-900">
        {pokData.base_experience}
      </td>
      <td className="py-3 px-4  font-semibold text-xl text-gray-900">
        {pokData.stats[1]?.base_stat}
      </td>
      <td className="py-3 px-4 font-semibold text-lg">
        {pokData.abilities.map((a) => a.ability.name).join(", ")}
      </td>
    </tr>
  );
}
