import axios from "axios"
import {AuthChecker} from "../helpers/AuthChecker";
import {useContext} from 'react';
import {useState, useEffect} from 'react';

function User() {

  const auth = useContext(AuthChecker);
  const [ userData, setUserData ] = useState([]);

  useEffect(() => {

    console.log(auth['auth']);
    if (auth['auth'])
        {
          const authStr = 'Bearer ' + localStorage.getItem("accessToken");
         


        axios.get("http://localhost:5000/api/data/getData", { headers: { 'Authorization': authStr } }).then((response) => {
            if (response.data.error)
            {
                alert(response.data.error);
                console.log("Could not get user data...");
            }
            else
            {
              
              setUserData(response.data.data[0]);
        
              
              
            }
        })
        }
      }, []);

  console.log("Outputting user data now ...")
  console.log(userData);
  console.log(auth['auth'])


  return (
    <>
      <div>User information page</div>
      <div>IoT Device Name: {userData.thingName}</div>

      <div>Ultrasonic Data</div> 
      <ul>
        {userData.ultrasonic &&
          <>
            <li>Ultrasonic 1: {userData.ultrasonic[0]}</li>
            <li>Ultrasonic 2: {userData.ultrasonic[1]}</li>
            <li>Ultrasonic 3: {userData.ultrasonic[2]}</li>
            <li>Ultrasonic 4: {userData.ultrasonic[3]}</li>
            <li>Ultrasonic 5: {userData.ultrasonic[4]}</li>
            <li>Ultrasonic 6: {userData.ultrasonic[5]}</li>
          </>
        }
      </ul>

      <div>Gyroscope Data</div>
      <ul>
        {userData.gyroscope &&
          <> 
            <li>Gyroscope X: {userData.gyroscope[0]}</li>
            <li>Gyroscope Y: {userData.gyroscope[1]}</li>
            <li>Gyroscope Z: {userData.gyroscope[2]}</li>
          </>
        }
      </ul>

      <div>Accelerometer Data</div> 
      <ul>
        {userData.accelerometer &&
          <>
            <li>Accelerometer X: {userData.accelerometer[0]}</li>
            <li>Accelerometer Y: {userData.accelerometer[1]}</li>
            <li>Accelerometer Z: {userData.accelerometer[2]}</li>
          </>
        }
      </ul>

      <div>Microphone Data</div> 
      <ul>
        {userData.microphone &&
          <>
            <li>Microphone: {userData.microphone}</li>
          </>
        }
      </ul>
    </>
  )
}

export default User