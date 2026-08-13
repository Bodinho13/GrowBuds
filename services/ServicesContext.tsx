import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { createServices } from "./container";

type Services = Awaited<ReturnType<typeof createServices>>;

const ServicesContext = createContext<Services | null>(null);

export function ServicesProvider({children,}: {children: ReactNode}) {
    const [services, setServices] = useState<Services | null>(null);

    useEffect(() => {
        createServices()
            .then((services) => {
                setServices(services);
            })
            .catch((error) => {
                console.error("Failed to initialize services:", error);
            });
    }, []);

    if(!services)
        return null;

    return(
        <ServicesContext.Provider value={services}>
            {children}
        </ServicesContext.Provider>
    );
}

export function useServices(): Services {
    const services = useContext(ServicesContext);
    if(!services){
        throw new Error("useServices must be used inside ServicesProvider");
    }
    return services;
}