// actualizar PredioGrid.tsx

import React from 'react';

import {
  View,
  StyleSheet,
} from 'react-native';

import useTheme
from '../../../hooks/useTheme';

import FieldLinesOverlay
from './FieldLinesOverlay';

const ROWS = 30;
const COLUMNS = 25;

const SQUARE_SIZE = 10;
const GAP = 2;

type Props = {
  completedSquares: number;
};

export default function PredioGrid({
  completedSquares,
}: Props) {

  const {
    COLORS,
  } = useTheme();

  const fieldWidth =
    COLUMNS * (SQUARE_SIZE + GAP);

  const fieldHeight =
    ROWS * (SQUARE_SIZE + GAP);

  return (

    <View
      style={[
        styles.wrapper,
        {
          width: fieldWidth,
          height: fieldHeight,
        },
      ]}
    >

      <View style={styles.field}>

        {Array.from({
          length: ROWS,
        }).map((_, rowIndex) => (

          <View
            key={rowIndex}
            style={styles.row}
          >

            {Array.from({
              length: COLUMNS,
            }).map((_, columnIndex) => {

              const index =
                rowIndex * COLUMNS +
                columnIndex;

              const completed =
                index < completedSquares;

              return (

                <View
                  key={index}
                  style={[
                    styles.square,
                    {
                      backgroundColor:
                        completed
                          ? COLORS.success
                          : COLORS.surfaceLight,
                    },
                  ]}
                />

              );
            })}

          </View>

        ))}

      </View>

      <FieldLinesOverlay
        width={fieldWidth}
        height={fieldHeight}
      />

    </View>

  );
}

const styles = StyleSheet.create({

  wrapper: {
    position: 'relative',
    alignSelf: 'center',
  },

  field: {
    position: 'absolute',
    top: 0,
    left: 0,
  },

  row: {
    flexDirection: 'row',
    gap: GAP,
    marginBottom: GAP,
  },

  square: {
    width: SQUARE_SIZE,
    height: SQUARE_SIZE,
    borderRadius: 2,
  },

});