# `react-native-crostini`

Simple opinionless Toast with toppings.

### Description

This package is designed to be an ultra light-weight themable universal opinionless hooks-based react-native toast provider.

### Example

Wrap the provider around the app (or whever you want toasts to appear)

```tsx
import {ToastProvider} from 'react-native-crostini';

export function AppContainer() {
  return (
    <ToastProvider>
      <App />
    </ToastProvider>
  );
}
```

Then import the hook and create toasts

```tsx
import React, {useEffect} from 'react';
import {Text, View} from 'react-native';
import {useToast} from 'react-native-crostini';

export function MyComponent() {
  const {showToast} = useToast();
  useEffect(() => {
    showToast('MyComponent mounted!');
  }, [showToast]);

  return (
    <View>
      <Text>It works!</Text>
    </View>
  );
}
```
