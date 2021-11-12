import { LightningElement, api } from 'lwc';

export default class BackgroundPage extends LightningElement {

    cardNumber = ''
    cardName = ''
    cardType = ''
    cardExp = ''

    haldleChild(event) {
        this.cardNumber = event.detail.cardNumber;
        this.cardName = event.detail.cardName;
        this.cardType = event.detail.cardType;
        this.cardExp = event.detail.cardExp;
        console.log("From parent: "+ this.cardType);
    }
}