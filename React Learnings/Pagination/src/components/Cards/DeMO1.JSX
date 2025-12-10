export function UserCard({ UserInfo }) {
  return (
    <>
      <section className="w-[5rem] items-center shadow-2xl">
        <figure>
          <img
            src={UserInfo.picture.large}
            alt={`${UserInfo.name.first} ${UserInfo.name.last}`}
            className=" w-[100%] object-cover"
          />
        </figure>

        <div className="">
          <h1>
            Name :{UserInfo.name.first} {UserInfo.name.last}
          </h1>
          <p>Age :{UserInfo.dob.age}</p>
          <p>Gender :{UserInfo.gender}</p>
        </div>
        <div>
          <p className=""> Id :{UserInfo.login.uuid} </p>
          <p className="">Email :{UserInfo.email}</p>
          <p className="">Phone : {UserInfo.cell}</p>
        </div>
        <div>
          <p className="">Country{UserInfo.location.country}</p>
          <p className="">Provience{UserInfo.location.state}</p>
          <p className="">Street :{UserInfo.location.street.name}</p>
        </div>
      </section>
    </>
  );
}

