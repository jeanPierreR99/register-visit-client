export interface IUser {
    id?: string;
    name: string;
    user: string;
    password_hash?: string;
    office?: IOffice;
    sedeId?: string;
    role?: IRole;
    visits?: IVisit[];
}

export interface IRole {
    id: string;
    name: string;
}
export interface IVisit {
    id?: string;
    name: string;
    dni: string;
    entity?: string;
    reason: string;
    description?: string;
    visit_url?: string | null;
    check_in_time: string;
    check_out_time?: string | null;
    functionary?: Ifunctionary;
    registeredBy?: IUser;
    functionaryId?: string;
    registeredById?: string;
}

export interface ISede {
    id?: string;
    name: string;
    address: string;
    offices?: IOffice[];
}

export interface IOffice {
    id?: string;
    name: string;
    floor: string;
    sede?: ISede;
    functionaries?: Ifunctionary[];
    users?: IUser[];
}

export interface Ifunctionary {
    id?: string;
    name: string;
    office?: IOffice;
    officeId?: string;
    sedeId?: string;
    visits?: IVisit[];
}