import { Variant } from "./Variant";

export class VariantHolder {
    private project: UUID;
    public variantNum = 0;
    public currentVariant: string = "default"

    public variantMap = new Map<string, Variant>();


    constructor(project: UUID){
        this.project = project;

        let variant = new Variant()


        this.variantMap.set("default", variant)

    }

    getUuid() {
        return this.project;
    }

}