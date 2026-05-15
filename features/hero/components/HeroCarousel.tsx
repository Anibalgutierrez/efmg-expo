import {
  Dimensions,
  ScrollView,
  View,
} from 'react-native';

import {
  Image,
} from 'expo-image';

import AppText
from '../../../components/ui/AppText';

import useBanners
from '../hooks/useBanners';

import {
  SPACING,
} from '../../../theme';

import useTheme
from '../../../hooks/useTheme';

const WIDTH =
  Dimensions.get(
    'window'
  ).width;

export default function HeroCarousel() {

  const {
    COLORS,
  } = useTheme();

  const {
    banners,
  } = useBanners();

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
      }}
    >

      <ScrollView
        horizontal

        pagingEnabled

        showsHorizontalScrollIndicator={
          false
        }
      >

        {banners.map(
          (banner) => (

            <View
              key={banner.id}

              style={{

                width:
                  WIDTH,

                paddingHorizontal:
                  SPACING.md,
              }}
            >

              <View
                style={{

                  height: 220,

                  borderRadius: 8,

                  overflow:
                    'hidden',

                  backgroundColor:
                    COLORS.surface,
                }}
              >

                <Image
                  source={
                    banner.image
                  }

                  contentFit=
                    "cover"

                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                />

                {/* OVERLAY */}
                <View
                  style={{

                    position:
                      'absolute',

                    bottom: 0,

                    width: '100%',

                    padding:
                      SPACING.lg,

                    backgroundColor:
                      COLORS.overlay,
                  }}
                >

                  <AppText
                    style={{

                      color:
                        '#fff',

                      fontSize: 24,

                      fontWeight:
                        'bold',
                    }}
                  >
                    {banner.title}
                  </AppText>

                  <AppText
                    style={{

                      color:
                        '#fff',

                      marginTop: 4,
                    }}
                  >
                    {
                      banner.subtitle
                    }
                  </AppText>

                </View>

              </View>

            </View>
          )
        )}

      </ScrollView>

    </View>
  );
}