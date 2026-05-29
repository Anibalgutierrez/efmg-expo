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
  memo,
  useCallback,
  useMemo,
} from 'react';

import {
  useRouter,
} from 'expo-router';

import {
  Image,
} from 'expo-image';

import Animated, {
  SharedValue,
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

import {
  Banner,
  BannerImage,
} from '../types/banner.types';

import Skeleton
  from '@/components/ui/Skeleton';

const {
  width: SCREEN_WIDTH,
} = Dimensions.get('window');

const MAX_WIDTH = 1200;

const ITEM_WIDTH =
  Math.min(
    SCREEN_WIDTH,
    MAX_WIDTH,
  );

const AUTO_PLAY_INTERVAL =
  5000;

const BANNER_HEIGHT =
  320;

const AnimatedFlatList =
  Animated.createAnimatedComponent(
    FlatList<Banner>,
  );

// =========================
// IMAGE HELPER
// =========================
function getBannerImageUri(
  image?: string | BannerImage
) {

  if (!image) {
    return '';
  }

  if (
    typeof image ===
    'string'
  ) {

    return image;
  }

  // NEVER ORIGINAL IN FEED
  return (

    image.medium ||

    image.thumb ||

    ''
  );
}

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
    useRef<FlatList<Banner>>(null);

  const currentIndexRef =
    useRef(0);

  const intervalRef =
    useRef<ReturnType<typeof setInterval> | null>(
      null
    );

  const [
    activeIndex,
    setActiveIndex,
  ] = useState(0);

  const scrollX =
    useSharedValue(0);

  // =========================
  // PREFETCH
  // =========================
  useEffect(() => {

    const urls = banners
      .map((banner) =>

        getBannerImageUri(
          banner.image
        )
      )
      .filter(Boolean);

    if (urls.length > 0) {

      Image.prefetch(
        urls
      );
    }

  }, [banners]);

  // =========================
  // AUTOPLAY
  // =========================
  useEffect(() => {

    if (
      banners.length <= 1
    ) {
      return;
    }

    intervalRef.current =
      setInterval(() => {

        let nextIndex =
          currentIndexRef.current + 1;

        if (
          nextIndex >=
          banners.length
        ) {

          nextIndex = 0;
        }

        flatListRef.current?.scrollToOffset({

          offset:
            nextIndex *
            ITEM_WIDTH,

          animated: true,
        });

        currentIndexRef.current =
          nextIndex;

        setActiveIndex(
          nextIndex
        );

      }, AUTO_PLAY_INTERVAL);

    return () => {

      if (
        intervalRef.current
      ) {

        clearInterval(
          intervalRef.current
        );
      }
    };

  }, [banners.length]);

  // =========================
  // SCROLL
  // =========================
  const onScroll =
    useAnimatedScrollHandler({

      onScroll: (
        event
      ) => {

        scrollX.value =
          event.contentOffset.x;
      },
    });

  // =========================
  // MOMENTUM
  // =========================
  const handleMomentumEnd =
    useCallback((
      event: any
    ) => {

      const index =
        Math.round(

          event.nativeEvent
            .contentOffset.x /

          ITEM_WIDTH
        );

      currentIndexRef.current =
        index;

      setActiveIndex(
        index
      );

    }, []);

  // =========================
  // RENDER ITEM
  // =========================
  const renderItem =
    useCallback(({
      item,
      index,
    }: {
      item: Banner;
      index: number;
    }) => (

      <CarouselItem
        banner={item}
        index={index}
        scrollX={scrollX}
        router={router}
        COLORS={COLORS}
      />

    ), [
      scrollX,
      router,
      COLORS,
    ]);

  // =========================
  // PAGINATION
  // =========================
  const pagination =
    useMemo(() => (

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

        {banners.map(((
          _,
          index
        ) => {

          const isActive =
            index ===
            activeIndex;

          return (

            <View
              key={index}

              style={{

                width:
                  isActive
                    ? 28
                    : 8,

                height: 8,

                borderRadius:
                  999,

                backgroundColor:
                  isActive
                    ? COLORS.primary
                    : COLORS.border,
              }}
            />
          );
        }))}

      </View>

    ), [
      activeIndex,
      banners,
      COLORS,
    ]);

  // =========================
  // EMPTY
  // =========================
  if (
    banners.length === 0
  ) {

    return (

      <View
        style={{
          height: BANNER_HEIGHT,
          marginBottom: SPACING.xl,
          overflow: 'hidden',
        }}
      >

        <Skeleton
          width="100%"
          height={BANNER_HEIGHT}
          radius={0}
        />

      </View>

    );
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

        data={banners}

        horizontal

        pagingEnabled={false}

        snapToInterval={
          ITEM_WIDTH
        }

        decelerationRate="fast"

        bounces={false}

        removeClippedSubviews

        maxToRenderPerBatch={2}

        windowSize={3}

        initialNumToRender={1}

        showsHorizontalScrollIndicator={
          false
        }

        style={{
          width:
            ITEM_WIDTH,
        }}

        keyExtractor={(
          item
        ) => item.id}

        onMomentumScrollEnd={
          handleMomentumEnd
        }

        onScroll={
          onScroll
        }

        scrollEventThrottle={
          16
        }

        renderItem={
          renderItem
        }
      />

      {pagination}

    </View>
  );
}

// =========================
// ITEM
// =========================
const CarouselItem = memo(
  function CarouselItem({
    banner,
    index,
    scrollX,
    router,
    COLORS,
  }: {
    banner: Banner;
    index: number;
    scrollX: SharedValue<number>;
    router: ReturnType<typeof useRouter>;
    COLORS: any;
  }) {

    const imageUri =
      getBannerImageUri(
        banner.image
      );

    // =========================
    // CARD ANIMATION
    // =========================
    const animatedStyle =
      useAnimatedStyle(() => {

        const inputRange = [

          (index - 1) *
          ITEM_WIDTH,

          index *
          ITEM_WIDTH,

          (index + 1) *
          ITEM_WIDTH,
        ];

        const scale =
          interpolate(

            scrollX.value,

            inputRange,

            [
              0.97,
              1,
              0.97,
            ],

            Extrapolation.CLAMP,
          );

        return {

          transform: [
            { scale },
          ],
        };
      });

    // =========================
    // IMAGE ANIMATION
    // =========================
    const imageAnimatedStyle =
      useAnimatedStyle(() => {

        const inputRange = [

          (index - 1) *
          ITEM_WIDTH,

          index *
          ITEM_WIDTH,

          (index + 1) *
          ITEM_WIDTH,
        ];

        const translateX =
          interpolate(

            scrollX.value,

            inputRange,

            [
              -10,
              0,
              10,
            ],

            Extrapolation.CLAMP,
          );

        return {

          transform: [
            {
              translateX,
            },
          ],
        };
      });

    return (

      <Animated.View
        style={[
          {
            width:
              ITEM_WIDTH,
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

              height:
                BANNER_HEIGHT,

              overflow:
                'hidden',

              backgroundColor:
                COLORS.surface,
            }}
          >

            {imageUri ? (

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
                    uri:
                      imageUri,
                  }}

                  contentFit="cover"

                  transition={120}

                  cachePolicy="memory-disk"

                  allowDownscaling

                  recyclingKey={
                    banner.id
                  }

                  style={{

                    width: '100%',
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

            {/* OVERLAY */}
            <LinearGradient
              colors={[
                'transparent',

                'rgba(0,0,0,0.15)',

                'rgba(0,0,0,0.82)',
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

                paddingHorizontal:
                  SPACING.lg,

                paddingVertical:
                  SPACING.xl,

                paddingBottom:
                  32,
              }}
            >

              <AppText
                style={{

                  color: '#fff',

                  fontSize: 28,

                  fontWeight:
                    'bold',
                }}
              >
                {banner.title}
              </AppText>

              {!!banner.subtitle && (

                <AppText
                  style={{

                    color:
                      'rgba(255,255,255,0.9)',

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

                    marginTop:
                      SPACING.md,

                    alignSelf:
                      'flex-start',

                    backgroundColor:
                      'rgba(255,255,255,0.16)',

                    borderWidth: 1,

                    borderColor:
                      'rgba(255,255,255,0.18)',

                    paddingHorizontal:
                      18,

                    paddingVertical:
                      10,

                    borderRadius:
                      999,
                  }}
                >

                  <AppText
                    style={{

                      color:
                        '#fff',

                      fontWeight:
                        '700',

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
);