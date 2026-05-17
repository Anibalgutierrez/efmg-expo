import React, {
  useState,
} from 'react';

import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';

import useTheme
from '../../../hooks/useTheme';

import {
  RADIUS,
  SPACING,
  TYPOGRAPHY,
} from '../../../theme';

import {
  createPredioDonation,
} from '../services/predio.service';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function CreateDonationModal({
  visible,
  onClose,
}: Props) {

  const {
    COLORS,
  } = useTheme();

  const [
    donorName,
    setDonorName,
  ] = useState('');

  const [
    amount,
    setAmount,
  ] = useState('');

  const [
    loading,
    setLoading,
  ] = useState(false);

  async function handleSubmit() {

    if (!amount) {
      return;
    }

    try {

      setLoading(true);

      await createPredioDonation({
        nombreDonador:
          donorName || 'Anónimo',
        monto:
          Number(amount),
      });

      setDonorName('');
      setAmount('');

      onClose();

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  }

  return (

    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >

      <View
        style={[
          styles.overlay,
          {
            backgroundColor:
              COLORS.overlay,
          },
        ]}
      >

        <View
          style={[
            styles.container,
            {
              backgroundColor:
                COLORS.surface,
            },
          ]}
        >

          <Text
            style={[
              styles.title,
              {
                color:
                  COLORS.text,
              },
            ]}
          >
            Colaborar con el predio
          </Text>

          <TextInput
            placeholder="Tu nombre"
            placeholderTextColor={
              COLORS.textSecondary
            }
            value={donorName}
            onChangeText={
              setDonorName
            }
            style={[
              styles.input,
              {
                color:
                  COLORS.text,
                borderColor:
                  COLORS.border,
                backgroundColor:
                  COLORS.surfaceLight,
              },
            ]}
          />

          <TextInput
            placeholder="Monto"
            placeholderTextColor={
              COLORS.textSecondary
            }
            keyboardType="numeric"
            value={amount}
            onChangeText={
              setAmount
            }
            style={[
              styles.input,
              {
                color:
                  COLORS.text,
                borderColor:
                  COLORS.border,
                backgroundColor:
                  COLORS.surfaceLight,
              },
            ]}
          />

          <Pressable
            onPress={handleSubmit}
            disabled={loading}
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
              {
                loading
                  ? 'Enviando...'
                  : 'Colaborar'
              }
            </Text>

          </Pressable>

          <Pressable
            onPress={onClose}
          >

            <Text
              style={[
                styles.cancel,
                {
                  color:
                    COLORS.textSecondary,
                },
              ]}
            >
              Cancelar
            </Text>

          </Pressable>

        </View>

      </View>

    </Modal>

  );
}

const styles = StyleSheet.create({

  overlay: {
    flex: 1,
    justifyContent: 'center',
    padding: SPACING.lg,
  },

  container: {
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
  },

  title: {
    fontSize: TYPOGRAPHY.subtitle,
    fontWeight: '700',
    marginBottom: SPACING.lg,
  },

  input: {
    borderWidth: 1,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    fontSize: TYPOGRAPHY.body,
  },

  button: {
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },

  buttonText: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: '700',
  },

  cancel: {
    textAlign: 'center',
    marginTop: SPACING.md,
  },

});