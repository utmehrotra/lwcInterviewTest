import { LightningElement, api } from 'lwc';
import BACKGROUNDS from '@salesforce/resourceUrl/backgrounds'
export default class CreditCard extends LightningElement {
    @api creditcardnumber;
    @api cardtype;
    @api cardowner;
    @api cardexp;

    get ccBackgroundStyle(){
        return `background-image:url('${BACKGROUNDS}/CC.png'); background-size: contain; background-repeat: no-repeat; margin: auto;`;
    }
    get cardTypeImage(){
        console.log(this.cardtype);
        return this.cardtype ? `${BACKGROUNDS}/${this.cardtype}.png` : "";
    }
    get ifCardTypeVisible(){
        return this.cardtype != '';
    }
    

}