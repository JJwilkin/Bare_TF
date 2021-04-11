import {ingredientImageMap} from './ingredientImageMap';

export default function getImage(ingredientName) {
    if (!ingredientName) return;
    const lowerCaseIngredientName = ingredientName.toLowerCase();
    if (lowerCaseIngredientName in ingredientImageMap) {
        return (ingredientImageMap[lowerCaseIngredientName].image);
    }
    else {
        return (ingredientImageMap.default.image);
    }
}