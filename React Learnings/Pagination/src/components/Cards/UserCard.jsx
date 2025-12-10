export function UserCard({ UserInfo }) {
  return (
    <>
      <section className="w-80 items-center shadow-2xl mx-4 mt-14 py-4 bg-white">
        <figure className="flex justify-center my-4">
          <img
            src={UserInfo.picture.large}
            alt={`${UserInfo.name.first} ${UserInfo.name.last}`}
            className="rounded-full w-32 h-32 object-cover"
          />
        </figure>
        <div className="px-3">
          <div className="mt-2 text-gray-600">
            <h1 className="font-medium text-2xl">
              {UserInfo.name.first} {UserInfo.name.last}
            </h1>
            <p>
              <b>Age : </b>
              {UserInfo.dob.age}
            </p>
            <p>
              <b>Gender</b> {UserInfo.gender}
            </p>
          </div>

          <div className="mt-2 text-gray-600">
            <p>
              <b>Id : </b>
              {UserInfo.login.uuid}
            </p>
            <p>
              <b>Email : </b>
              {UserInfo.email}
            </p>
            <p>
              <b>Phone : </b>
              {UserInfo.cell}
            </p>
          </div>

          <div className="mt-2 text-gray-600">
            <p>
              <b>Country :</b> {UserInfo.location.country}
            </p>
            <p>
              <b>Provience : </b>
              {UserInfo.location.state}
            </p>
            <p>
              <b>Street :</b>
              {UserInfo.location.street.name}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
