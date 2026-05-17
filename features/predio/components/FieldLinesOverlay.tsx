// features/predio/components/FieldLinesOverlay.tsx

import React from 'react';

import {
  StyleSheet,
  View,
} from 'react-native';

import Svg, {
  Rect,
  Line,
  Circle,
} from 'react-native-svg';

type Props = {
  width: number;
  height: number;
};

export default function FieldLinesOverlay({
  width,
  height,
}: Props) {

  return (

    <View
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
    >

      <Svg
        width={width}
        height={height}
      >

        {/* Borde cancha */}

        <Rect
          x="1"
          y="1"
          width={width - 2}
          height={height - 2}
          stroke="rgba(255, 255, 255, 0.97)"
          strokeWidth="2"
          fill="transparent"
        />

        {/* Línea media horizontal */}

        <Line
          x1="0"
          y1={height / 2}
          x2={width}
          y2={height / 2}
          stroke="rgba(255, 255, 255, 0.97)"
          strokeWidth="2"
        />

        {/* Círculo central */}

        <Circle
          cx={width / 2}
          cy={height / 2}
          r="32"
          stroke="rgba(255, 255, 255, 0.97)"
          strokeWidth="2"
          fill="transparent"
        />

        {/* Área superior */}

        <Rect
          x={width * 0.3}
          y="0"
          width={width * 0.4}
          height="50"
          stroke="rgba(255, 255, 255, 0.97)"
          strokeWidth="2"
          fill="transparent"
        />

        {/* Área inferior */}

        <Rect
          x={width * 0.3}
          y={height - 50}
          width={width * 0.4}
          height="50"
          stroke="rgba(255, 255, 255, 0.97)"
          strokeWidth="2"
          fill="transparent"
        />

      </Svg>

    </View>

  );
}