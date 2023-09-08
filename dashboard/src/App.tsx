import * as React from "react"
import {ChakraProvider, theme,} from "@chakra-ui/react"
import { QueryClient, QueryClientProvider } from "react-query";

import Chat from './components/Chat';

const queryClient = new QueryClient();

export const App = () => {
    return <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
            <Chat/>
        </QueryClientProvider>
    </ChakraProvider>;
};
