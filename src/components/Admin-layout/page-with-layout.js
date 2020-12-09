import React from 'react';

// import Header from './Header'
// import Sidebar from './Sidebar'
// import Footer from './Footer'
import AdminHeader from "./Admin-header";
import Footer from "../Footer/footer";
import Sidebar from "./admin-sidebar"
import '../../assets/admin-style/app.scss'

const PageWithLayout = props => (
    <div className="wrapper">
        <AdminHeader />
        <Sidebar history={props.history} />
        <main className="main">
            <section className="section-container">
                {props.children}
            </section>
        </main>


        <Footer />
    </div>
)

export default PageWithLayout;
