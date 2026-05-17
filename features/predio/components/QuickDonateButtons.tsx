import React, {
  useState,
} from 'react';

import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';

import useTheme
from '../../../hooks/useTheme';

import {
  SPACING,
  RADIUS,
  TYPOGRAPHY,
} from '../../../theme';

import CreateDonationModal
from './CreateDonationModal';

const amounts = [
  1000,
  2500,
  5000,
  10000,
];

export default function QuickDonateButtons() {

  const {
    COLORS,
  } = useTheme();

  const [
    modalVisible,
    setModalVisible,
  ] = useState(false);

  return (

    <>

      <View style={styles.container}>

        <Text
          style={[
            styles.title,
            {
              color:
                COLORS.text,
            },
          ]}
        >
          Colaborar
        </Text>

        <View style={styles.grid}>

          {amounts.map((amount) => (

            <Pressable
              key={amount}
              onPress={() =>
                setModalVisible(true)
              }
              style={[
                styles.button,
                {
                  backgroundColor:
                    COLORS.primary,
                },
              ]}
            >

              <Text
                style={[
                  styles.buttonText,
                  {
                    color:
                      COLORS.buttonText,
                  },
                ]}
              >
                $
                {amount.toLocaleString(
                  'es-AR'
                )}
              </Text>

            </Pressable>

          ))}

        </View>

      </View>

      <CreateDonationModal
        visible={modalVisible}
        onClose={() =>
          setModalVisible(false)
        }
      />

    </>

  );
}

const styles = StyleSheet.create({

  container: {
    marginBottom: SPACING.lg,
  },

  title: {
    fontSize: TYPOGRAPHY.subtitle,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },

  button: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },

  buttonText: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: '700',
  },

});