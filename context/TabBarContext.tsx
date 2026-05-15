import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react';

type ContextType = {

  visible: boolean;

  showTabBar: () => void;

  hideTabBar: () => void;
};

const TabBarContext =
  createContext<ContextType>(
    {} as ContextType
  );

type Props = {
  children: ReactNode;
};

export function TabBarProvider({
  children,
}: Props) {

  const [
    visible,
    setVisible,
  ] = useState(true);

  function showTabBar() {

    setVisible(true);
  }

  function hideTabBar() {

    setVisible(false);
  }

  return (

    <TabBarContext.Provider
      value={{

        visible,

        showTabBar,

        hideTabBar,
      }}
    >
      {children}
    </TabBarContext.Provider>
  );
}

export default function useTabBar() {

  return useContext(
    TabBarContext
  );
}