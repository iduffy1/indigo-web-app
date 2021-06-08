export class DtoClaim {
    type : string;
    value : string;

    public toString = () : string => {
        return `${this.type}: ${this.value}`;
    }
}

export class DtoUser {
    userId: string;
    name : string;
    email : string;
    roles : string[];
    claims : DtoClaim[];
}
