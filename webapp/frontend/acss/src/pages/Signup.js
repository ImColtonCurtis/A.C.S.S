import { Formik, Form, Field } from "formik" // Form library allowing us to set initial values, submit handler, validation
// If wanted, import ErrorMessage and use it as a tag '<ErrorMessage name="email" component="span"/>' before each Field
import * as Yup from "yup" // Form validation library
import {FaUser} from 'react-icons/fa'
import axios from "axios"

function Signup() {
    const initialValues = {
        email: "",
        password: "",
        phoneNumber: "",
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().min(6).required(),
        password: Yup.string().required(),
        phoneNumber: Yup.string().required(),
    });

    const onSubmit = (data) => {
        
        axios.post("http://localhost:5000/api/users/signup", data).then(
            () => {console.log("Successfully created user...")}
            )
     
    };

    return (
        <div>
            <section className='heading'>
                <h1>
                    <FaUser/> Signup
                </h1>
            </section>
            <Formik 
                initialValues = {initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
            >
                <Form className="formContainer">
 
                    
                    <Field
                        autoComplete="off"
                        id="inputEmail"
                        name="email"
                        placeholder="Email"
                    />

                
                    <Field
                        autoComplete="off"
                        id="inputPassword"
                        type= "password"
                        name="password"
                        placeholder="Password"
                    />

                    <Field
                        autoComplete="off"
                        id="inputPhoneNumber"
                        name="phoneNumber"
                        placeholder="Phone Number (No Dashes)"
                    />
                    <button type="submit"> Create Account </button>
                </Form>
            </Formik>
        </div>
    )
}

export default Signup