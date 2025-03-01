export type IRuleItem = {
    ruleId: string;
    avatarUrl: string;
    createdByUserName: string;
    updatedByUserName: string;
    createdDate: string;
    updatedDate: string;
    processName: string;
    processCode: string;
    ruleName: string;
    ruleDescription: string;
    active: boolean|number;
    ruleOrder : string;
    order:number;
}

export type IRuleTableFilters = {
    ruleName:string;
    active:string|number;
}
export type IRuleTableFilterValue = string | string[];


export type IRuleCondition = {
    order : number;
    ignoreCase: boolean;
    andOr: string;
    attribute:string;
    dataType:string;
    operator:string;
    staticValue:boolean;
    value_1:string|null;
    value_2:string|null;
    function:string|null;
    active:boolean;
}