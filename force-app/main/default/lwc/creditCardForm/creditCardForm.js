import { LightningElement, track, api } from 'lwc';

export default class CreditCardForm extends LightningElement {
    
    @track cardNumberField1 = '';
    @track cardNumberField2 = '';
    @track cardNumberField3 = '';
    @track cardNumberField4 = '';
    
    cardNumber = '';
    cardName = '';
    cardType = '';
    cardExp = '';
    cardCVV = '';
    submitLoading = false;
    errorMsg = ''

    get months() {
        return [
            { label: 'Jan', value: '01' },
            { label: 'Feb', value: '02' },
            { label: 'Mar', value: '03' },
            { label: 'Apr', value: '04' },
            { label: 'May', value: '05' },
            { label: 'Jun', value: '06' },
            { label: 'Jul', value: '07' },
            { label: 'Aug', value: '08' },
            { label: 'Sep', value: '09' },
            { label: 'Oct', value: '10' },
            { label: 'Nov', value: '11' },
            { label: 'Dec', value: '12' },
        ];
    }

    get years() {
        var today = new Date();
        var thisYear = today.getFullYear();
        var expYears = [];
        for(var i=0; i < 15; i++){
            expYears.push({label: thisYear+i + "", value: thisYear+i + ""});
        }
        return expYears;
    }


    handleCardNumberChange(event) {
        var thisFieldId = parseInt(event.target.getAttribute("data-id"));
        var validatedCardFieldValue = this.validateCardFields(event.detail.value, thisFieldId);
        event.target.value = validatedCardFieldValue;

        if(validatedCardFieldValue.length == 4 && thisFieldId != 4){
            this.template.querySelector(`[data-id="${thisFieldId+1}"]`).focus();
        }
        var fullcardNumber = this.cardNumberField1+this.cardNumberField2 + this.cardNumberField3+this.cardNumberField4;
        if(fullcardNumber.length > 4){
            this.cardNumber = this.formatCreditCardNumber(fullcardNumber);
        }else{
            this.cardNumber = fullcardNumber;
        }
        if(fullcardNumber.length == 16){
            this.validateCardNumber(fullcardNumber);
        }
        this.triggerCCInfoChange();
    }

    handleCardNameChange(event){
        let result = /^[a-zA-Z ]+$/.test( event.detail.value);
        if(result){
            this.cardName = event.detail.value;
            this.triggerCCInfoChange();
        }
    }

    handleCardMonthChange(event){
        var cardExpValue = this.cardExp.split("/");
        if(cardExpValue.length > 0){
            cardExpValue[0] = event.detail.value;
        }
        cardExpValue[1] = cardExpValue[1] ? cardExpValue[1] : "";
        this.cardExp = cardExpValue.join("/");
        this.triggerCCInfoChange();
    }

    handleCardYearChange(event){
        var cardExpValue = this.cardExp.split("/");
        if(cardExpValue.length > 1 && event.detail.value != null){
            var expYear = event.detail.value;
            cardExpValue[1] = expYear.substring(2,4)
        }
        this.cardExp = cardExpValue.join("/");
        this.triggerCCInfoChange();
    }

    handleCVVChange(event){
        this.cardCVV = event.detail.value;
        this.triggerCCInfoChange();
    }

    async handleSubmit(event) {
        this.errorMsg = ""
        var cardValidity = this.ifAlldetailsValid();
        if(cardValidity.ifValid){
            this.submitLoading = true;
            await new Promise(resolve => setTimeout(resolve, 1000));
            this.submitLoading = false;
            if(!this.isExpValid()){
                this.errorMsg = "Your card cannot be used as the expiry date is not valid"
            }else{
                this.errorMsg = ""
            }
        }else{
            this.errorMsg = cardValidity.errorMessgae;
        }
    }

    ifAlldetailsValid(){
        var fullcardNumber = this.cardNumberField1+this.cardNumberField2 + this.cardNumberField3+this.cardNumberField4;
        var ifValid = true;
        let errorMessgae = "";
        if(fullcardNumber.length != 16){
            ifValid = false;
            errorMessgae = "Card number is not valid";
        }
        if(ifValid && !this.cardName){
            ifValid = false;
            errorMessgae = "Card name is not valid";
        }
        if(ifValid && this.cardExp.split("/").length != 2){
            ifValid = false;
            errorMessgae = "Card expiry is not valid";
        }
        if(ifValid && (!this.cardCVV || this.cardCVV.length < 3)){
            ifValid = false;
            errorMessgae = "Card CVV is not valid";
        }
        
        return {ifValid, errorMessgae};

    }

    validateCardFields(cardNumberField, thisFieldId){
        var v = cardNumberField.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        console.log(v);
        console.log(cardNumberField);
        this["cardNumberField"+thisFieldId] = v;
        return v;
    }

    validateCardNumber(crdNum){
        var visaRegEx = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
        var mastercardRegEx = /^(?:5[1-5][0-9]{14})$/;
        var amexpRegEx = /^(?:3[47][0-9]{13})$/;
        var discovRegEx = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;
        var isValid = false;
        var cardType = "";
        if (visaRegEx.test(crdNum)) {
            isValid = true;
            cardType = "visa";
        } else if(mastercardRegEx.test(crdNum)) {
            isValid = true;
            cardType = "master";
        } else if(amexpRegEx.test(crdNum)) {
            isValid = true;
            cardType = "amex";
        } else if(discovRegEx.test(crdNum)) {
            isValid = true;
            cardType = "discover";
        }
        
        if(isValid) {
            this.cardType = cardType;
        } else {
        }
    }


    formatCreditCardNumber(value) {
        var v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
        var matches = v.match(/\d{4,16}/g);
        var match = matches && matches[0] || ''
        var parts = []
        for (var i=0, len=match.length; i<len; i+=4) {
            parts.push(match.substring(i, i+4))
        }
        if (parts.length) {
            return parts.join('-')
        } else {
            return value;
        }
    }

    isExpValid(){
        var cardExpArr = this.cardExp.split("/");
        var today = new Date();
        var thisYear = today.getFullYear() + "";
        thisYear = thisYear.substring(2,4);
        var thisMonth = today.getMonth() + 1;

        if(thisYear == cardExpArr[1]){
            return cardExpArr[0] > thisMonth + 1;
        }else if(thisYear == (cardExpArr[1] + 1) && thisMonth == 12){
            return cardExpArr[0] != 1;
        }
        return true;
        
    }

    triggerCCInfoChange(){
        const event = new CustomEvent("child", {
            // detail contains only primitives
            detail: { cardNumber: this.cardNumber, cardName: this.cardName, cardType: this.cardType, cardExp: this.cardExp },
          });
          this.dispatchEvent(event);
    }
}