import React, { useRef, useState } from 'react';
import { View, TextInput, Dimensions, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';

export type OtpBoxesProps = {
  length?: number;
  onComplete?: (code: string) => void;
  boxSize?: number; // optional override
};

const screenWidth = Dimensions.get('window').width;
const defaultBoxSize = (screenWidth - 80) / 6 - 8; // align with OtpInput

export default function OtpBoxes({ length = 6, onComplete, boxSize }: OtpBoxesProps) {
  const [digits, setDigits] = useState<string[]>(Array.from({ length }).map(() => ''));
  const inputs = useRef<Array<TextInput | null>>([]);
  const size = boxSize ?? defaultBoxSize;

  const maybeComplete = (next: string[]) => {
    const code = next.join('');
    if (onComplete && code.length === length && !next.includes('')) {
      onComplete(code);
    }
  };

  const handleChange = (text: string, idx: number) => {
    if (text === '') {
      const next = [...digits];
      next[idx] = '';
      setDigits(next);
      return;
    }
    const ch = text.slice(-1);
    const next = [...digits];
    next[idx] = ch;
    setDigits(next);
    const nextInput = inputs.current[idx + 1];
    if (nextInput) nextInput.focus();
    maybeComplete(next);
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, idx: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (digits[idx] === '') {
        const prev = inputs.current[idx - 1];
        if (prev) prev.focus();
      } else {
        const next = [...digits];
        next[idx] = '';
        setDigits(next);
      }
    }
  };

  return (
    <View className="flex-row items-center justify-center my-3 mx-1 gap-2.5">
      {digits.map((d, i) => (
        <TextInput
          key={i}
          ref={(ref) => { inputs.current[i] = ref }}
          value={d}
          onChangeText={text => handleChange(text, i)}
          onKeyPress={e => handleKeyPress(e, i)}
          keyboardType="number-pad"
          maxLength={1}
          style={{ width: size, height: size }}
          className="rounded-lg border border-gray-200 bg-white text-2xl font-bold"
          textAlign="center"
          selectionColor="#000"
          importantForAutofill="no"
        />
      ))}
    </View>
  );
}
