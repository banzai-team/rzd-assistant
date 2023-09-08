import * as React from "react"
import {ChakraProvider, theme,} from "@chakra-ui/react"

import Chat from './components/Chat';

export const App = () => (
    <ChakraProvider theme={theme}>
        <Chat />
    </ChakraProvider>
)
