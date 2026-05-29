import {
  ScrollViewStyleReset,
} from 'expo-router/html';

export default function Html({
  children,
}: any) {

  return (

    <html
      lang="es"
      style={{
        backgroundColor: '#0B0F1A',
      }}
    >

      <head>

        <meta
          charSet="utf-8"
        />

        <meta
          httpEquiv="X-UA-Compatible"
          content="IE=edge"
        />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />

        <ScrollViewStyleReset />

      </head>

      <body
        style={{
          backgroundColor: '#0B0F1A',
          margin: 0,
        }}
      >

        {children}

      </body>

    </html>
  );
}