 function Profile() {
    return (
        <>
            <h1>Profile Card </h1>
            <ProfileCard
                name="ALICE"
                age={20}
                greetings={
                    <div>
                        <strong>Hello  Alice ! Good Morning </strong>
                    </div>
                }
            >
            <p>Hobbies :Reading ,Hiking </p>
            <button>Contact</button>
            </ProfileCard>
        
            <ProfileCard
                name="BOB"
                age={25}
                greetings={
                    <div>
                        <strong>Hello  Alice ! Good Afternoon </strong>
                    </div>
                }
             >
            <p>Hobbies :Driving  ,Hiking </p>
            <button>Contact</button>
        
            </ProfileCard>
        </>
    )
}

export default Profile;


//Old method 
//  function ProfileCard(props) {
//     return (
//         <>
//             <h1>Name : {props.name}</h1>
//             <p>Age : { props.age}</p>
//             <p>Greetings : {props.greetings}</p>
//             <div>{ props.children}</div>

//         </>
//     )
// }

// ----------------------------------------------------------------------------------
function ProfileCard(props) {
    const { name, age, greetings, children } = props;
  return (
    <>
      <h1>Name : {name}</h1>
      <p>Age : {age}</p>
      <div> {greetings}</div>
      <div>{children}</div> //because its in side of parent
    </>
  );
}


