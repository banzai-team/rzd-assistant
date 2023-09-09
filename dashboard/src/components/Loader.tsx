import React from "react";
import "../styles/loader.css"

import {Box} from "@chakra-ui/react";
import train from '../images/longTrain.svg';

const Loader: React.FC = () => {
    return (
        <Box className="loader-box">
            <img src={train} alt="train" className="go-train"/>
        </Box>
    )
};

export default Loader;
