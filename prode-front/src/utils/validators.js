// Email validation
export const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
  }
  
  // Password validation (at least 8 characters, 1 letter, 1 number)
  export const validatePassword = (password) => {
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    return re.test(password)
  }
  
  export const validateUsername = (username) => {
    const re = /^[a-zA-Z0-9_]{5,20}$/
    return re.test(username)
  }
  

  // Name validation (only letters and spaces)
  export const validateName = (name) => {
    const re = /^[a-zA-ZÀ-ÿ\s]{2,}$/
    return re.test(name)
  }
  
  // Phone number validation
  export const validatePhone = (phone) => {
    const re = /^\d{10}$/
    return re.test(phone)
  }
  
  // Date validation (YYYY-MM-DD)
  export const validateDate = (date) => {
    const re = /^\d{4}-\d{2}-\d{2}$/
    return re.test(date)
  }
  

export const isMatchDay = (matchDate) => {

    const match = new Date(matchDate);
    const now = new Date();
    console.log(  match, now, now > match)
    return (
      now > match
    );
  };
  