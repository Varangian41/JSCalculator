const DataController = function () {

    let data = {

        currentNumber : '',
        number: '',
        operator: '',

    };

    return {

        getData: function () {
            return data;
        },

        getOperator: function () {
            return data.operator;
        },

        insertCurrent: function (el) {
            data.currentNumber += el;
        },

        insertNumber: function () {
            data.number = data.currentNumber;
        },

        insertSign: function (el) {
            if(data.currentNumber) {
                data.operator = el;
                data.currentNumber = '';
            }
        },

        reset : function (el) {
            data.currentNumber = document.querySelector(el).textContent;
            data.operator = '';
        },

        resetData : function () {
            data.currentNumber = '';
            data.number = '';
            data.operator = '';
        },

        deleteStr: function () {
            data.currentNumber = data.currentNumber.slice(0, -1);
        },

        insertNeg: function () {
            if (data.currentNumber.indexOf('-') !== -1) {
                data.currentNumber = data.currentNumber.slice(0, data.currentNumber.length);
            } else {
                data.currentNumber = `-${data.currentNumber}`;
            }
        },

        calculate: function () {
            if(data.operator === '+'){
                data.currentNumber = parseFloat(data.number) + parseFloat(data.currentNumber);
            } else if (data.operator === '-') {
                data.currentNumber = parseFloat(data.number) - parseFloat(data.currentNumber);
            } else if (data.operator === '*') {
                data.currentNumber = parseFloat(data.number) * parseFloat(data.currentNumber);
            } else {
                data.currentNumber = parseFloat(data.number) / parseFloat(data.currentNumber);
            }

            if(isNaN(data.currentNumber)) {
                this.resetData();
            }
        },

        checkNumber: function (el) {
            if (!isNaN(el) || el === '.') {
                return true;
            } else return false;
        },

        checkOperator: function (el) {
            if (el.match(/[\+\-\*\/]/) && !data.operator) {
                return true;
            } else return false;
        },

        checkSecond: function (el) {
            if (el.match(/[\+\-\*\/]/) && data.operator) {
                return true;
            } else return false;
        },

        checkCalc: function (el) {
            if (el === '=') {
                return true;
            } else return false;
        },

        checkCE: function (el) {
            if (el === 'CE') {
                return true;
            } else return false;
        },

        checkC: function (el) {
            if (el === 'C') {
                return true;
            } else return false;
        },

        checkDel: function (el) {
            if (el === 'DEL') {
                return true;
            } else return false;
        },

        checkNeg: function (el) {
            if (el === '+/-') {
                return true;
            } else return false;
        }

    }

}();


const UIController = function () {

    const DOMStrings = {
        calculatorID : '#calculator',
        toggleCalcBtn : '#toggleCalc',
        calcButtons: '#calculatorButtons',
        mainDisplay: '#displayCurrent',
        histDisplay: '#displayHistory'
    };

    return {

        showCalc: function () {
            if(document.querySelector(DOMStrings.calculatorID).classList.contains('fadeIn')){
                document.querySelector(DOMStrings.calculatorID).classList.replace('fadeIn', 'fadeOut');
            } else {
                document.querySelector(DOMStrings.calculatorID).classList.replace('fadeOut', 'fadeIn');
            }
        },

        getDomStr: function () {
            return DOMStrings;
        },

        resetFields: function() {
            document.querySelector(DOMStrings.mainDisplay).textContent = '';
            document.querySelector(DOMStrings.histDisplay).textContent = '---';
        },

        resetMain: function () {
            document.querySelector(DOMStrings.mainDisplay).textContent = '';
        },

        showNumbers: function (el) {
            if(el.match(/[\+\-\*\/]/) && document.querySelector(DOMStrings.mainDisplay).textContent.length === 0){
                this.resetFields();
            }
            else {
                document.querySelector(DOMStrings.mainDisplay).textContent += `${el}`;
            }
        },

        showSolution: function (el) {
            document.querySelector(DOMStrings.histDisplay).textContent = document.querySelector(DOMStrings.mainDisplay).textContent;
            document.querySelector(DOMStrings.mainDisplay).textContent = el;
            if (isNaN(el)){
                this.resetFields();
            }
        },

        deleteCur: function () {
           let chop = document.querySelector(DOMStrings.mainDisplay).textContent.slice(0, -1);
           document.querySelector(DOMStrings.mainDisplay).textContent = chop;
        },

        insertMinus: function () {
            let scr = document.querySelector(DOMStrings.mainDisplay).textContent;
            if (scr.indexOf('-') !== -1) {
                scr = scr.slice(1, scr.length);
                document.querySelector(DOMStrings.mainDisplay).textContent = scr;
            } else {
                scr = `-${scr}`;
                document.querySelector(DOMStrings.mainDisplay).textContent = scr;
            }
        }

    }

}();



const Controller = function (UICtrl, DataCtrl) {

    const DOMStr = UICtrl.getDomStr();
    const data = DataCtrl.getData();


    const setEventHandlers = function(){
        document.querySelector(DOMStr.toggleCalcBtn).addEventListener('click', UICtrl.showCalc);

        document.querySelector(DOMStr.calcButtons).addEventListener('click', function(event){
            mainCalc(event.target.textContent);
        });
    };


    const mainCalc = function (entry) {

        //Insert numbers into data structure
        if (DataCtrl.checkNumber(entry)) { //Add first current and update UI

            DataCtrl.insertCurrent(entry);
            UICtrl.showNumbers(entry);

        } else if (DataCtrl.checkOperator(entry)) { //Add first operator, update number var, and add second current

            DataCtrl.insertNumber();
            DataCtrl.insertSign(entry);
            UICtrl.showNumbers(entry);

        } else if (DataCtrl.checkSecond(entry)) { //Second operator calculate and update UI

            DataCtrl.calculate();
            DataCtrl.insertNumber();
            UICtrl.showSolution(data.currentNumber);
            DataCtrl.insertSign(entry);
            UICtrl.showNumbers(entry);

        } else if (DataCtrl.checkCalc(entry)) { //Calculate on equals and update UI

            DataCtrl.calculate();
            DataCtrl.insertNumber();
            UICtrl.showSolution(data.currentNumber);
            DataCtrl.reset(DOMStr.mainDisplay);

        } else if (DataCtrl.checkCE(entry)) { //Reset if ce clicked

            DataCtrl.resetData();
            UICtrl.resetFields();

        } else if (DataCtrl.checkC(entry)) { //Reset if c clicked

            DataCtrl.resetData();
            UICtrl.resetMain();

        } else if (DataCtrl.checkDel(entry)) { //Delete current number with DEL

            DataCtrl.deleteStr();
            UICtrl.deleteCur();


        } else if (DataCtrl.checkNeg(entry)) {

            DataCtrl.insertNeg();
            UICtrl.insertMinus();

        }

    };

    return {
        init: function () {
            setEventHandlers();
            UICtrl.resetFields();
        }
    }

}(UIController, DataController);

Controller.init();





