import {
  Modal,
  Pressable,
  View,
  FlatList,
  useWindowDimensions,
} from 'react-native';

import {
  useMemo,
  useRef,
} from 'react';

import { Ionicons }
from '@expo/vector-icons';

import {
  Image,
} from 'expo-image';

type Props = {
  visible: boolean;
  images: string[];
  initialIndex?: number;
  onClose: () => void;
};

export default function ImageViewerModal({
  visible,
  images,
  initialIndex = 0,
  onClose,
}: Props) {

  const {
    width,
    height,
  } = useWindowDimensions();

  const flatListRef =
    useRef<FlatList>(
      null
    );

  // =========================
  // FILTER INVALID IMAGES
  // =========================
  const validImages =
    useMemo(() => {

      return images.filter(
        (image) =>

          !!image &&
          typeof image ===
            'string'
      );

    }, [images]);

  return (

    <Modal
      visible={
        visible
      }

      transparent

      animationType=
        "fade"

      statusBarTranslucent
    >

      <View
        style={{

          flex: 1,

          backgroundColor:
            'rgba(0,0,0,0.97)',
        }}
      >

        {/* CLOSE TOUCH */}
        <Pressable
          onPress={
            onClose
          }

          style={{

            position:
              'absolute',

            top: 0,
            left: 0,
            right: 0,

            height: 120,

            zIndex: 20,
          }}
        />

        {/* CLOSE BUTTON */}
        <Pressable
          onPress={
            onClose
          }

          style={{

            position:
              'absolute',

            top: 54,

            right: 20,

            zIndex: 50,

            width: 44,

            height: 44,

            borderRadius:
              999,

            backgroundColor:
              'rgba(0,0,0,0.45)',

            justifyContent:
              'center',

            alignItems:
              'center',
          }}
        >

          <Ionicons
            name="close"
            size={26}
            color="#fff"
          />

        </Pressable>

        {/* IMAGES */}
        <FlatList
          ref={
            flatListRef
          }

          horizontal

          pagingEnabled

          initialScrollIndex={
            initialIndex
          }

          data={
            validImages
          }

          keyExtractor={(
            item,
            index
          ) =>
            `${item}-${index}`
          }

          showsHorizontalScrollIndicator={
            false
          }

          bounces={false}

          overScrollMode="never"

          removeClippedSubviews={
            false
          }

          windowSize={3}

          initialNumToRender={1}

          maxToRenderPerBatch={2}

          getItemLayout={(
            _,
            index
          ) => ({

            length:
              width,

            offset:
              width * index,

            index,
          })}

          renderItem={({
            item,
          }) => (

            <View
              style={{

                width,

                height,

                justifyContent:
                  'center',

                alignItems:
                  'center',
              }}
            >

              <Image
                source={{
                  uri: item,
                }}

                contentFit=
                  "contain"

                cachePolicy=
                  "memory-disk"

                transition={
                  180
                }

                style={{

                  width:
                    '100%',

                  height:
                    '100%',
                }}
              />

            </View>
          )}
        />

      </View>

    </Modal>
  );
}