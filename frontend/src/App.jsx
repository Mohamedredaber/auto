import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchMeThunk } from "./features/auth/authThunks";
import AppRoutes from "./route/AppRoutes";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const initializeAuth = async () => {
        await dispatch(fetchMeThunk());
    };
    initializeAuth();
  }, [dispatch]);

  return <AppRoutes />;
}

export default App;