import * as React from 'react';
import {
  View,
  Text,
  Image
} from 'react-native';

import {
  MyButton,
  MyButtonText
} from '../shared';

interface IConfirmSendImageProps {
  imageSource: string;
  cancel(): void;
  send(): void;
};

const ConfirmSendImage: React.FC<IConfirmSendImageProps> = ({ imageSource, cancel, send }) => (
  <>
    <View>
      <Text>
        The image that you have selected
      </Text>
      <Image
        source={{ uri: imageSource}}
        style={{
          height: 100,
          width: 100
        }}
      />
      <MyButton onPress={cancel}>
        <MyButtonText>
          Cancel
        </MyButtonText>
      </MyButton>
      <MyButton onPress={send}>
        <MyButtonText>
          Send Image
        </MyButtonText>
      </MyButton>
    </View>
  </>
);

export default ConfirmSendImage;
