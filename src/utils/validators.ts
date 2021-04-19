import { registerInput } from 'src/resolvers/types/registerInput';
import { updateInput } from 'src/resolvers/types/updateInput';

export const validateEmail = (email: string) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const validateRegister = (options: registerInput | updateInput ) => {
  const { firstName, lastName, email, password } = options;
    if (firstName.length < 1) {
      return [{
          field: "firstName",
          message: "First name is required"
        }]
    };
    if (lastName.length < 1) {
      return [{
          field: "lastName",
          message: "Last Name is required"
        }]
    }; 
    if (!validateEmail(email)) {
      return [{
          field: "email",
          message: "Please enter a valid email"
        }]
    };
    if (password) {
      if(password.length < 8){
        return [{
          field: 'password',
          message: 'Password must be more than 8 characters'
        }]
      }
    };
    return null
}