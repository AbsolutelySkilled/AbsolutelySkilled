<!-- Part of the react-native AbsolutelySkilled skill. Load this file when
     working with native modules, TurboModules, JSI, or bridging Swift/Kotlin code. -->

# Native Modules Reference

## Choosing Your Approach

| Approach | When to use | Complexity |
|---|---|---|
| Expo Modules API | New modules in Expo projects | Low |
| TurboModules (New Arch) | High-performance, RN-only projects | Medium |
| Legacy Bridge Modules | Maintaining old code (avoid for new work) | Medium |
| JSI Direct | Ultra-low-latency (database drivers, crypto) | High |

## Expo Modules API

The recommended way to write native modules. Provides a unified Swift/Kotlin API with automatic TypeScript type generation.

### Scaffold a new module

```bash
# Local module (lives inside your project)
npx create-expo-module my-module --local

# Standalone module (publishable to npm)
npx create-expo-module my-module
```

### Module definition (iOS - Swift)

```swift
// modules/my-module/ios/MyModule.swift
import ExpoModulesCore

public class MyModule: Module {
  public func definition() -> ModuleDefinition {
    // Module name (used in JS import)
    Name("MyModule")

    // Synchronous function
    Function("add") { (a: Int, b: Int) -> Int in
      return a + b
    }

    // Async function with Promise
    AsyncFunction("fetchUser") { (userId: String, promise: Promise) in
      DispatchQueue.global().async {
        // Network call or heavy work
        let user = UserService.fetch(id: userId)
        promise.resolve(["name": user.name, "email": user.email])
      }
    }

    // Constants exposed to JS
    Constants {
      return ["PI": Double.pi, "platform": "ios"]
    }

    // Events emitted to JS
    Events("onProgress", "onComplete")

    // Native view component
    View(MyNativeView.self) {
      Prop("color") { (view, color: UIColor) in
        view.backgroundColor = color
      }

      Events("onTap")
    }
  }
}
```

### Module definition (Android - Kotlin)

```kotlin
// modules/my-module/android/src/main/java/expo/modules/mymodule/MyModule.kt
package expo.modules.mymodule

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class MyModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("MyModule")

    Function("add") { a: Int, b: Int ->
      a + b
    }

    AsyncFunction("fetchUser") { userId: String ->
      val user = UserService.fetch(userId)
      mapOf("name" to user.name, "email" to user.email)
    }

    Constants(
      "PI" to Math.PI,
      "platform" to "android"
    )

    Events("onProgress", "onComplete")

    View(MyNativeView::class) {
      Prop("color") { view: MyNativeView, color: Int ->
        view.setBackgroundColor(color)
      }

      Events("onTap")
    }
  }
}
```

### TypeScript interface

```typescript
// modules/my-module/index.ts
import MyModule from './src/MyModuleModule';

export function add(a: number, b: number): number {
  return MyModule.add(a, b);
}

export async function fetchUser(userId: string): Promise<{ name: string; email: string }> {
  return MyModule.fetchUser(userId);
}

export const PI: number = MyModule.PI;
```

### Native view component

```typescript
// modules/my-module/src/MyNativeView.tsx
import { requireNativeView } from 'expo';
import { ViewProps } from 'react-native';

interface MyNativeViewProps extends ViewProps {
  color?: string;
  onTap?: () => void;
}

const NativeView = requireNativeView<MyNativeViewProps>('MyNativeView');

export function MyNativeView(props: MyNativeViewProps) {
  return <NativeView {...props} />;
}
```

## TurboModules (New Architecture)

For React Native projects not using Expo, TurboModules provide JSI-based native module access.

### Codegen spec

```typescript
// NativeMyModule.ts (Codegen reads this)
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  add(a: number, b: number): number;
  fetchUser(userId: string): Promise<{ name: string; email: string }>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('MyModule');
```

### Enable New Architecture

```json
// android/gradle.properties
newArchEnabled=true

// ios - set in Podfile or via env
// ENV['RCT_NEW_ARCH_ENABLED'] = '1'
```

Or in Expo:

```json
// app.json
{
  "expo": {
    "newArchEnabled": true
  }
}
```

## JSI (JavaScript Interface)

JSI allows C++ code to be called directly from JavaScript without serialization. Used by libraries like `react-native-mmkv`, `react-native-reanimated`, and `expo-sqlite`.

```cpp
// C++ JSI host object (simplified)
#include <jsi/jsi.h>

class MyHostObject : public facebook::jsi::HostObject {
public:
  facebook::jsi::Value get(
    facebook::jsi::Runtime& runtime,
    const facebook::jsi::PropNameID& name
  ) override {
    auto methodName = name.utf8(runtime);
    if (methodName == "add") {
      return facebook::jsi::Function::createFromHostFunction(
        runtime, name, 2,
        [](facebook::jsi::Runtime& rt, const facebook::jsi::Value& thisVal,
           const facebook::jsi::Value* args, size_t count) {
          return facebook::jsi::Value(args[0].asNumber() + args[1].asNumber());
        }
      );
    }
    return facebook::jsi::Value::undefined();
  }
};
```

JSI is low-level. Prefer Expo Modules API or TurboModules unless you need sub-millisecond call overhead.

## Common Native Module Patterns

### Emitting events to JavaScript

```swift
// iOS (Expo Modules)
self.sendEvent("onProgress", ["percent": 0.75])
```

```kotlin
// Android (Expo Modules)
sendEvent("onProgress", mapOf("percent" to 0.75))
```

```typescript
// JavaScript listener
import { EventEmitter } from 'expo-modules-core';
import MyModule from './MyModuleModule';

const emitter = new EventEmitter(MyModule);
const subscription = emitter.addListener('onProgress', ({ percent }) => {
  console.log(`Progress: ${percent * 100}%`);
});

// Clean up
subscription.remove();
```

### Handling platform differences

```typescript
import { Platform } from 'react-native';

export function getDeviceInfo() {
  if (Platform.OS === 'ios') {
    return MyModule.getIOSSpecificInfo();
  } else {
    return MyModule.getAndroidSpecificInfo();
  }
}
```

## Debugging Native Modules

- **iOS**: Open `ios/*.xcworkspace` in Xcode. Add breakpoints in Swift code. Use `NSLog()` or `print()`.
- **Android**: Open `android/` in Android Studio. Add breakpoints in Kotlin. Use `Log.d("MyModule", message)`.
- **Flipper**: Inspect bridge messages, network calls, and layout from a desktop app.
- **Metro logs**: Native errors often surface in Metro terminal as red screens with stack traces.

## Migration: Bridge to New Architecture

1. Replace `NativeModules.MyModule` imports with TurboModule codegen specs
2. Convert `RCT_EXPORT_METHOD` to C++ TurboModule methods (or use Expo Modules API)
3. Enable New Architecture in gradle.properties / Podfile
4. Test all native module calls - synchronous returns work differently under JSI
5. Update third-party libraries to New Architecture compatible versions

> Check https://reactnative.directory for library compatibility with the New Architecture.
