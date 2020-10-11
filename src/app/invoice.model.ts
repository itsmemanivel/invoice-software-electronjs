export class Products{

    name: string;
    price:number;
}

export class Invoice {

    customerName: string;
    address: string;
    email:string;
    contactNo: string;

    products: Products[] = [];


    constructor(){

        // this.products: Products = new Products();
    }
    
}
