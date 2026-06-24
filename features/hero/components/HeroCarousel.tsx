import {
  Dimensions,
  FlatList,
  Pressable,
  View,
} from 'react-native';

import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  useRouter,
} from 'expo-router';

import {
  Image,
} from 'expo-image';

import {
  LinearGradient,
} from 'expo-linear-gradient';

import AppText
from '../../../components/ui/AppText';

import {
  SPACING,
} from '../../../theme';

import {
  LOCAL_BANNERS,
} from '../data/localBanners';

const {
  width: SCREEN_WIDTH,
} = Dimensions.get(
  'window',
);

const ITEM_WIDTH =
  Math.min(
    SCREEN_WIDTH,
    1200,
  );

const BANNER_HEIGHT =
  320;

const AUTO_PLAY_INTERVAL =
  5000;

export default function HeroCarousel() {

  const router =
    useRouter();

  const flatListRef =
    useRef<FlatList>(
      null,
    );

  const currentIndexRef =
    useRef(0);

  const [
    activeIndex,
    setActiveIndex,
  ] = useState(0);

  // =========================
  // AUTOPLAY
  // =========================
  useEffect(
    () => {

      const interval =
        setInterval(
          () => {

            let next =
              currentIndexRef.current +
              1;

            if (
              next >=
              LOCAL_BANNERS.length
            ) {

              next = 0;
            }

            flatListRef.current
              ?.scrollToOffset({

                offset:
                  next *
                  ITEM_WIDTH,

                animated:
                  true,
              });

            currentIndexRef.current =
              next;

            setActiveIndex(
              next,
            );

          },

          AUTO_PLAY_INTERVAL,
        );

      return () =>
        clearInterval(
          interval,
        );
    },

    [],
  );

  return (

    <View>

      <FlatList
        ref={flatListRef}

        horizontal

        pagingEnabled

        showsHorizontalScrollIndicator={
          false
        }

        data={
          LOCAL_BANNERS
        }

        keyExtractor={(
          item,
        ) => item.id}

        onMomentumScrollEnd={(
          event,
        ) => {

          const index =
            Math.round(

              event
                .nativeEvent
                .contentOffset.x /

              ITEM_WIDTH,
            );

          currentIndexRef.current =
            index;

          setActiveIndex(
            index,
          );
        }}

        renderItem={({
          item,
        }) => (

          <Pressable
            onPress={() => {

              if (
                item.actionType ===
                'route'
              ) {

                router.push(
                  item.actionValue as any,
                );
              }
            }}
          >

            <View
              style={{

                width:
                  ITEM_WIDTH,

                height:
                  BANNER_HEIGHT,
              }}
            >

              <Image
                source={
                  item.image
                }

                contentFit="cover"

                style={{

                  width:
                    '100%',

                  height:
                    '100%',
                }}
              />

              <LinearGradient
                colors={[
                  'transparent',
                  'rgba(0,0,0,0.8)',
                ]}

                style={{

                  position:
                    'absolute',

                  left: 0,

                  right: 0,

                  top: 0,

                  bottom: 0,

                  justifyContent:
                    'flex-end',

                  padding:
                    SPACING.lg,
                }}
              >

                <AppText
                  style={{

                    color:
                      '#fff',

                    fontSize:
                      28,

                    fontWeight:
                      'bold',
                  }}
                >
                  {
                    item.title
                  }
                </AppText>

                <AppText
                  style={{

                    color:
                      'rgba(255,255,255,0.9)',

                    marginTop:
                      6,
                  }}
                >
                  {
                    item.subtitle
                  }
                </AppText>

              </LinearGradient>

            </View>

          </Pressable>
        )}
      />

      <View
        style={{

          flexDirection:
            'row',

          justifyContent:
            'center',

          marginTop:
            SPACING.lg,

          gap: 8,
        }}
      >

        {LOCAL_BANNERS.map(
          (
            _,
            index,
          ) => (

            <View
              key={index}

              style={{

                width:

                  activeIndex ===
                  index

                    ? 28

                    : 8,

                height: 8,

                borderRadius:
                  999,

                backgroundColor:

                  activeIndex ===
                  index

                    ? '#3B82F6'

                    : '#444',
              }}
            />
          ),
        )}

      </View>

    </View>
  );
}