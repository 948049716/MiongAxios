import { CreateAxiosDefaults } from "axios";

export interface CreateAxiosCustom extends CreateAxiosDefaults {
    token: string;
    responseDataHandle: (res: any) => any;
}
