import * as React from 'react';
import Icon from "react-native-vector-icons/MaterialIcons";
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';

interface AccordionProps {
  title: string;
  // the data will be an array of the classes
  data: any[];
}
const Accordion: React.FC<AccordionProps> = ({ title, data}) => {
  const [expanded, setExpanded] = React.useState(false);
  const toggleExpanded = () => () => setExpanded(state => !state)
  return (
    <View>
      <TouchableOpacity
        onPress={toggleExpanded}
      >
        <Text>test class i guess { title}</Text>
      </TouchableOpacity>
      <View>
        {expanded && (
          <View>

          </View>
        )}
      </View>
    </View>

  )
}

export default Accordion;
