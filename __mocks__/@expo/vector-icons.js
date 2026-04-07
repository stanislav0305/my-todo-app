/*
import { View } from 'react-native';

// Create mock components for specific icon families, e.g., AntDesign
export const AntDesign = props => {
  // You can return a simple View or Text component to represent the icon
  // and pass the props through to check them in your tests.
  return <View testID="AntDesign-Icon" {...props} />;
};

// Mock other families you might use (e.g., Ionicons, MaterialIcons)
export const Ionicons = props => {
  return <View testID="Ionicons-Icon" {...props} />;
};

// Mock the entire module to cover potential deep imports
const VectorIcons = {
  AntDesign,
  Ionicons,
  // ... other families
};

export default VectorIcons;
*/
const { Text } = require('react-native');
const mockIcon = props => {
  return <Text {...props}>{props.name}</Text>;
};

module.exports = {
  AntDesign: mockIcon,
  Entypo: mockIcon,
  EvilIcons: mockIcon,
  Feather: mockIcon,
  FontAwesome: mockIcon,
  FontAwesome5: mockIcon,
  FontAwesome6: mockIcon,
  Foundation: mockIcon,
  Ionicons: mockIcon,
  MaterialCommunityIcons: mockIcon,
  MaterialIcons: mockIcon,
  Octicons: mockIcon,
  SimpleLineIcons: mockIcon,
  Zocial: mockIcon,
  // Add any other icon sets you might be using
};
