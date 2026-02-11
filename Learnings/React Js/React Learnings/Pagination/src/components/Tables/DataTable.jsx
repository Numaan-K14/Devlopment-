export function DataTable({ data, index }) {
  return (
    <>
      <tr className="border border-gray-300 hover:bg-blue-50">
        <td className="px-4 py-3">{index}</td>
        <td className="px-4 py-3">
          <img
            src={data.picture.large}
            alt={`${data.name.first} ${data.name.last}`}
            className="rounded-full w-10 h-10 object-cover"
          />
        </td>
        <td className="px-4 py-3">
          {data.name.first} {data.name.last}
        </td>
        <td className="px-4 py-3">{data.dob.age}</td>
        <td className="PX-4 py-3">{data.gender}</td>
        <td className="px-4 py-3">{data.login.salt}</td>
        <td className="px-4 py-3">{data.email}</td>
        <td className="px-4 py-3">{data.cell}</td>
        <td className="px-4 py-3">{data.location.country}</td>
        <td className="px-4 py-3">{data.location.state}</td>
        <td className="px-4 py-3">{data.location.street.name}</td>
      </tr>
    </>
  );
}
