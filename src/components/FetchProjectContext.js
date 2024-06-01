import { createContext, useContext } from 'react';

const FetchProjectContext = createContext();

export const useFetchProject = () => useContext(FetchProjectContext);

export const FetchProjectProvider = ({ children, value }) => {
    return (
        <FetchProjectContext.Provider value={value}>
            {children}
        </FetchProjectContext.Provider>
    );
};
