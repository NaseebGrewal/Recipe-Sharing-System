import React from 'react'
import Footer from './footer';

const WrapperComponent = (props) => { 
        return (
            <div >
                <WrapperComponent {...props} />
                <Footer />
            </div>
        );
    };

export default WrapperComponent