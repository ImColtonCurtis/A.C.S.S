import {FaSignInAlt, FaSignOutAlt, FaUser} from 'react-icons/fa';
import {useContext} from 'react';
import {Link} from 'react-router-dom';
import {AuthChecker} from "../helpers/AuthChecker";

function Header() {
    const {auth} = useContext(AuthChecker);


    return (
        <header className="header">
            <div className="logo">                    
                <Link to='/'>
                        ACSS Dashboard
                </Link>
            </div>
            {!auth && 
                <>
                    <ul>

                        <li>
                            <Link to='/login'>
                                <FaSignInAlt/>Login
                            </Link>
                        </li>
                        <li>
                            <Link to='/signup'>
                                <FaUser/>Signup
                            </Link>
                        </li>
                    </ul>
                </>
            }
        </header>

    )
  }
  
  export default Header