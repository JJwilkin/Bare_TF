import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Recipes from "./recipes";

const Tab = createMaterialTopTabNavigator();

export default function Home() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Recipes} />
      <Tab.Screen name="Settings" component={Recipes} />
    </Tab.Navigator> 
  );
}