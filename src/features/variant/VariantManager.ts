import type { VariantHolder } from "./VariantHolder";

export class VariantManager{

    private static variantHolderMap = new Map<string, VariantHolder>();
    private static currentVariantHolder: VariantHolder | undefined = undefined

    public static bindEvents(){

    
    }

    public static setCurrentVariant(id: string){
        this.currentVariantHolder = this.variantHolderMap.get(id);
    }

    // this may be undefined
    public static getCurrentVariantHolder(): VariantHolder | undefined {
        return this.currentVariantHolder;
    }


}  