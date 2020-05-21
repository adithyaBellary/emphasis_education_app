import * as React from 'react';
import Icon from "react-native-vector-icons/MaterialIcons";
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';

interface IAccordionProps {
  title: string;
  data: any;
}
const Accordion: React.FC = () => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <View>
      <TouchableOpacity>

      </TouchableOpacity>
    </View>

  )
}

export default Accordion;
