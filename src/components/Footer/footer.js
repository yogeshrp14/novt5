import React from 'react'
import Logo from '../../assets/svg/avaya-logo-red.svg'
import './footer.scss';

export default function Footer(props) {
   // let currentLocation = props.history.location.pathname;
   // let hrefAddress = "#";

    // const changeUrl = () => {
    //     let routerUrl = currentLocation;
    //     props.history.push(routerUrl)
    // }

    return (
        <div className="av-footer container-full">
            <div className="av-sub-footer container">
                <div className="inner">
                    <div className="av-logo">
                        <img alt="Avaya Logo" src={Logo} />
                    </div>
                    <div className="policy">
                        {/* <p><a href={hrefAddress} onClick={changeUrl}>Sitemap</a></p>
                        <p><a href={hrefAddress} onClick={changeUrl}>Terms of Use</a></p>
                        <p><a href={hrefAddress} onClick={changeUrl}>Privacy</a></p>
                        <p><a href={hrefAddress} onClick={changeUrl}>Accessibilty</a></p> */}
                    </div>
                    <div className="end-tag">
                        @ 2020 Avaya Inc.
                    </div>
                </div>
            </div>
        </div>

    )
}
// export default Footer
