/** Lien externe — ouvre expo-web-browser en natif, nouvel onglet sur web. */
// Module : node_modules/expo-router
import { Link } from 'expo-router';
// Module : node_modules/expo-web-browser
import * as WebBrowser from 'expo-web-browser';
// Module : node_modules/react
import React from 'react';
// Module : node_modules/react-native
import { Platform } from 'react-native';

export function ExternalLink(
  props: Omit<React.ComponentProps<typeof Link>, 'href'> & { href: string }
) {
  return (
    <Link
      target="_blank"
      {...props}
      href={props.href}
      onPress={(e) => {
        if (Platform.OS !== 'web') {
          // Prevent the default behavior of linking to the default browser on native.
          e.preventDefault();
          // Open the link in an in-app browser.
          WebBrowser.openBrowserAsync(props.href as string);
        }
      }}
    />
  );
}
