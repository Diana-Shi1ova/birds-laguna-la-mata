import "./MainLayout.css";
import Sidebar from "../../components/Sidebar/Sidebar";
// import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";


function MainLayout ({ children }) {
    return (
        <>
            <Header></Header>
            <main>
                <Sidebar></Sidebar>
                <div className="main-content">
                    {children}
                </div>
            </main>
            {/* <Footer></Footer> */}
        </>
    );
};

export default MainLayout;