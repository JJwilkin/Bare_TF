import { makeObservable, observable, action, computed } from "mobx";

export default class GlobalState {
    word = ""
    lastWord = ""
    showPrediction = false
    stopPredicting = false
    shouldBounce = false
    ingredientList = []
    constructor() {
        makeObservable(this, {
            word: observable,
            // getWord: computed,
            getShowPrediction: computed,
            prediction: action,
            showPrediction:observable,
  
        })
    }
    getWord () {
      return this.word;
    }
  
    getLastWord () {
      return this.lastWord;
    }
  
    getShouldBounce () {
      return this.shouldBounce;
    }
    
    get getShowPrediction () {
      return this.showPrediction;
    }
  
    setWord(word) {
        this.word = word;
    }
  
    setShouldBounce(val) {
      this.shouldBounce = val;
    }
  
    setLast(lastWord) {
      this.lastWord = lastWord;
  }
  
    prediction(val) {
      this.showPrediction = val;
    }
  
    setStopPrediction(val) {
      this.stopPredicting = val;
    }
  
    getIngredients() {
      return this.ingredientList;
    }
  
    addIngredient(val) {
      if (val && !this.ingredientList.includes(val)){
        const lowerCaseVal = val.toLowerCase();
        this.ingredientList.unshift(lowerCaseVal);
      }
    }
  
    removeIngredient(val) {
      const index = this.ingredientList.indexOf(val);
      if (index > -1) {
        this.ingredientList.splice(index, 1);
      }
    }

    resetStore() {
      this.word = "";
      this.lastWord = "";
      this.ingredientList = [];
      this.showPrediction = false;
      this.shouldBounce = false;
      this.stopPredicting = true;
    }
    
  }