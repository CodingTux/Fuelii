import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import SideMenu from './AppNavigator';


 const RootNavigation = createAppContainer(createSwitchNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  Main: SideMenu,

},
{
  initialRouteName: 'Main'
}));

export default RootNavigation