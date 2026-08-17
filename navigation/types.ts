export type TabParamList = {
    Dashboard: undefined;
    Pflanzen: undefined;
    Grows: undefined;
    Kalender: undefined;
    Aufgaben: undefined;
    Einstellungen: undefined;
};

export type PlantsStackParamList = {
    PlantsList: undefined;
    PlantDetail: {
        plantId: string;
    };
};

export type GrowStackParamList = {
    GrowsList: undefined;
    GrowDetail: {growId: string;};
    CreateGrow: undefined;
    EditGrow: {growId:string;};
};