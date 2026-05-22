
import {
  Dimensions,
  Pressable,
  View,
  FlatList,
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

import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import {
  LinearGradient,
} from 'expo-linear-gradient';

import AppText
from '../../../components/ui/AppText';

import useBanners
from '../hooks/useBanners';

import {
  handleBannerAction,
} from '../utils/handleBannerAction';

import {
  getBannerColor,
} from '../../../utils/getRandomColor';

import {
  SPACING,
} from '../../../theme';

import useTheme
from '../../../hooks/useTheme';

const {
  width: SCREEN_WIDTH,
} = Dimensions.get('window');

const MAX_WIDTH = 1200;

const ITEM_WIDTH =
  Math.min(
    SCREEN_WIDTH,
    MAX_WIDTH,
  );

const ITEM_SPACING =
  12;

const AUTO_PLAY_INTERVAL =
  5000;

type Banner = {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  buttonText?: string;
};

const AnimatedFlatList =
  Animated.createAnimatedComponent(
    FlatList<Banner>,
  );

export default function HeroCarousel() {

  const router =
    useRouter();

  const {
    COLORS,
  } = useTheme();

  const {
    banners,
  } = useBanners();

  const flatListRef =
    useRef<FlatList>(null);

  const currentIndexRef =
    useRef(0);

  const [activeIndex, setActiveIndex] =
    useState(0);

  const scrollX =
    useSharedValue(0);

  useEffect(() => {

    if (
      banners.length <= 1
    ) {
      return;
    }

    const interval = setInterval(() => {

      let nextIndex =
        currentIndexRef.current + 1;

      if (
        nextIndex >= banners.length
      ) {
        nextIndex = 0;
      }

      flatListRef.current?.scrollToOffset({
        offset:
          nextIndex * ITEM_WIDTH,

        animated: true,
      });

      currentIndexRef.current =
        nextIndex;

      setActiveIndex(nextIndex);

    }, AUTO_PLAY_INTERVAL);

    return () =>
      clearInterval(interval);

  }, [banners.length]);

  const onScroll =
    useAnimatedScrollHandler({

      onScroll: (event) => {

        scrollX.value =
          event.contentOffset.x;
      },
    });

  if (
    banners.length === 0
  ) {
    return null;
  }

  return (

    <View
      style={{
        marginBottom:
          SPACING.xl,

        alignItems:
          'center',
      }}
    >

      <AnimatedFlatList
        ref={flatListRef}

        style={{
          width: ITEM_WIDTH,
        }}

        data={banners}

        keyExtractor={(item) =>
          item.id
        }

        horizontal

        pagingEnabled={false}

        snapToInterval={
          ITEM_WIDTH
        }

        decelerationRate="fast"

        bounces={false}

        showsHorizontalScrollIndicator={
          false
        }

        contentContainerStyle={{
          paddingHorizontal: 0,
        }}

        onMomentumScrollEnd={(event) => {

          const index = Math.round(
            event.nativeEvent.contentOffset.x /
            ITEM_WIDTH,
          );

          currentIndexRef.current =
            index;

          setActiveIndex(index);
        }}

        onScroll={onScroll}

        scrollEventThrottle={16}

        renderItem={({
          item,
          index,
        }: {
          item: Banner;
          index: number;
        }) => {

          return (
            <CarouselItem
              banner={item}
              index={index}
              scrollX={scrollX}
              router={router}
              COLORS={COLORS}
            />
          );
        }}
      />

      {/* PAGINATION */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: SPACING.lg,
          gap: 8,
        }}
      >

        {banners.map((_, index) => {

          const isActive =
            index === activeIndex;

          return (
            <View
              key={index}
              style={{
                width:
                  isActive ? 28 : 8,

                height: 8,

                borderRadius: 999,

                backgroundColor:
                  isActive
                    ? COLORS.primary
                    : COLORS.border,
              }}
            />
          );
        })}

      </View>

    </View>
  );
}

function CarouselItem({
  banner,
  index,
  scrollX,
  router,
  COLORS,
}: any) {

  const animatedStyle =
    useAnimatedStyle(() => {

      const inputRange = [
        (index - 1) * ITEM_WIDTH,
        index * ITEM_WIDTH,
        (index + 1) * ITEM_WIDTH,
      ];

      const scale = interpolate(
        scrollX.value,
        inputRange,
        [0.94, 1, 0.94],
        Extrapolation.CLAMP,
      );

      const opacity = interpolate(
        scrollX.value,
        inputRange,
        [0.7, 1, 0.7],
        Extrapolation.CLAMP,
      );

      return {
        transform: [{ scale }],
        opacity,
      };
    });

  const imageAnimatedStyle =
    useAnimatedStyle(() => {

      const inputRange = [
        (index - 1) * ITEM_WIDTH,
        index * ITEM_WIDTH,
        (index + 1) * ITEM_WIDTH,
      ];

      const translateX = interpolate(
        scrollX.value,
        inputRange,
        [-18, 0, 18],
        Extrapolation.CLAMP,
      );

      return {
        transform: [{ translateX }],
      };
    });

  return (

    <Animated.View
      style={[
        {
          width: ITEM_WIDTH,
          paddingHorizontal: 0,
        },

        animatedStyle,
      ]}
    >

      <Pressable
        onPress={() =>
          handleBannerAction(
            banner,
            router,
          )
        }
      >

        <View
          style={{
            height: 320,
            borderRadius: 0,
            overflow: 'hidden',
            backgroundColor: COLORS.surface,
            shadowColor: '#000',
            shadowOpacity: 0.25,
            shadowRadius: 20,
            shadowOffset: {
              width: 0,
              height: 10,
            },
            elevation: 10,
          }}
        >

          {banner.image ? (

            <Animated.View
              style={[
                {
                  width: '100%',
                  height: '100%',
                },
                imageAnimatedStyle,
              ]}
            >

              <Image
                source={{
                  uri: banner.image,
                }}

                contentFit="cover"

                transition={300}

                cachePolicy="memory-disk"

                style={{
                  width: '104%',
                  height: '100%',
                }}
              />

            </Animated.View>

          ) : (

            <View
              style={{
                flex: 1,
                backgroundColor:
                  getBannerColor(
                    banner.id,
                  ),
              }}
            />
          )}

          {/* GRADIENT OVERLAY */}
          <LinearGradient
            colors={[
              'transparent',
              'rgba(0,0,0,0.15)',
              'rgba(0,0,0,0.82)',
            ]}

          style={{
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,

  justifyContent: 'flex-end',

  paddingHorizontal:
    SPACING.lg,

  paddingVertical:
    SPACING.xl,

  paddingBottom: 32,
}}
          >

            <AppText
              style={{
                color: '#fff',
                fontSize: 28,
                fontWeight: 'bold',
              }}
            >
              {banner.title}
            </AppText>

            {!!banner.subtitle && (

              <AppText
                style={{
                  color: 'rgba(255,255,255,0.9)',
                  marginTop: 6,
                  fontSize: 15,
                  lineHeight: 22,
                }}
              >
                {banner.subtitle}
              </AppText>
            )}

            {!!banner.buttonText && (

              <View
                style={{
                  marginTop: SPACING.md,
                  alignSelf: 'flex-start',
                  backgroundColor:
                    'rgba(255,255,255,0.16)',
                  borderWidth: 1,
                  borderColor:
                    'rgba(255,255,255,0.18)',
                  paddingHorizontal: 18,
                  paddingVertical: 10,
                  borderRadius: 999,
                }}
              >

                <AppText
                  style={{
                    color: '#fff',
                    fontWeight: '700',
                    fontSize: 14,
                  }}
                >
                  {banner.buttonText}
                </AppText>

              </View>
            )}

          </LinearGradient>

        </View>

      </Pressable>

    </Animated.View>
  );
}