import React, { useRef, useState } from 'react';
import {
  View,
  TextInput,
  Dimensions,
  NativeSyntheticEvent,
  TextInputKeyPressEvent,
  StyleSheet,
} from 'react-native';

export type OtpBoxesProps = {
  length?: number;
  onComplete?: (code: string) => void;
  boxSize?: number;
};

const { width: screenWidth } = Dimensions.get('window');
const DEFAULT_BOX_SIZE = (screenWidth - 80) / 6 - 8;

export default function OtpBoxes({ length = 6, onComplete, boxSize }: OtpBoxesProps) {
  const [digits, setDigits] = useState<string[]>(Array(length).fill(''));
  const inputs = useRef<Array<TextInput | null>>([]);
  const size = boxSize ?? DEFAULT_BOX_SIZE;

  const maybeComplete = (next: string[]) => {
    const code = next.join('');
    if (code.length === length && !next.includes('')) {
      onComplete?.(code);
    }
  };

  const handleChange = (text: string, idx: number) => {
    const next = [...digits];

    if (text === '') {
      next[idx] = '';
      setDigits(next);
      return;
    }

    next[idx] = text.slice(-1);
    setDigits(next);
    inputs.current[idx + 1]?.focus();
    maybeComplete(next);
  };

  const handleKeyPress = (e: TextInputKeyPressEvent, idx: number) => {
    if (e.nativeEvent.key !== 'Backspace') return;

    const next = [...digits];

    if (digits[idx] === '') {
      inputs.current[idx - 1]?.focus();
    } else {
      next[idx] = '';
      setDigits(next);
    }
  };

  return (
    <View className="flex-row items-center justify-center my-3 mx-1 gap-2.5">
      {digits.map((d, i) => (
        <TextInput
          key={i}
          ref={(ref) => { inputs.current[i] = ref; }}
          value={d}
          onChangeText={(text) => handleChange(text, i)}
          onKeyPress={(e) => handleKeyPress(e, i)}
          keyboardType="number-pad"
          maxLength={1}
          className="rounded-lg border border-gray-200 bg-white font-bold p-0"
          style={{ width: size, height: size, fontSize: size * 0.6 }}
          textAlign="center"
          textAlignVertical="center"
          selectionColor="#000"
          importantForAutofill="no"
        />
      ))}
    </View>
  );
}