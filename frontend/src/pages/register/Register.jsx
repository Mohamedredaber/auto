import { useDispatch, useSelector } from "react-redux";
import { register, reset } from "../features/auth/authSlice";
import { useEffect, useState } from "react";
function Register() {
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } =
    useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
  });

  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(register(formData));
  };

  useEffect(() => {
    if (isError) {
      alert(message);
    }

    if (isSuccess || user) {
      console.log("User registered");
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, dispatch]);

  return (
    <form onSubmit={onSubmit}>
      <input name="first_name" onChange={onChange} />
      <input name="last_name" onChange={onChange} />
      <input name="email" onChange={onChange} />
      <input name="password" type="password" onChange={onChange} />
      <input name="phone" onChange={onChange} />

      <button type="submit">
        {isLoading ? "Loading..." : "Register"}
      </button>
    </form>
  );
}

export default Register;