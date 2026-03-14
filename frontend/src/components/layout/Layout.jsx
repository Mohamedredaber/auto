import { Outlet } from "react-router-dom";
import Navbar from "./navbar/navbar";
import Footer from "./footer/Footer";
function Layout() {
    return (
        <>
            <Navbar />
            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    )
}
export default Layout