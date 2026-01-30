# Base UI useRender

## Overview

Source: https://base-ui.com/react/utils/use-render.md
Use this reference when working with the newer shadcn/ui base UI components and when migrating away from Radix UI patterns.
Always prefer Base UI guidance for render strategy and slot/children handling.
If you see shadCN examples that use `asChild` refer to the below to migrate over to `render`.

## Migrating from Radix UI

Radix UI uses an `asChild` prop, while Base UI uses a `render` prop. Learn more about how composition works in Base UI in the [composition guide](/react/handbook/composition.md).

In Radix UI, the `Slot` component lets you implement an `asChild` prop.

```jsx title="Radix UI Slot component"
import { Slot } from 'radix-ui'

function Button({ asChild, ...props }) {
  const Comp = asChild ? Slot.Root : 'button'
  return <Comp {...props} />
}

// Usage
;<Button asChild>
  <a href="/contact">Contact</a>
</Button>
```

In Base UI, `useRender` lets you implement a `render` prop. The example below is the equivalent implementation to the Radix example above.

```jsx title="Base UI render prop"
import { useRender } from '@base-ui/react/use-render'

function Button({ render, ...props }) {
  return useRender({
    defaultTagName: 'button',
    render,
    props,
  })
}

// Usage
;<Button render={<a href="/contact" />}>Contact</Button>
```
