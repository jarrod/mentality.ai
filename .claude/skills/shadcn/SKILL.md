---
name: shadcn
description: Use for any React UI/component work involving shadcn/ui, Base UI, styling patterns, component composition, or UI design changes in this repo.
user-invocable: true
---

## Overview

Use this skill when building or modifying UI with shadcn components. Prefer existing component patterns, theme tokens, and styling conventions in the repo.

## Comopnent Design

- If provided a sample directly reference it
- If provided a URL to an online sample read it completely
- _IMPORTANT:_ User file system examples as your primary reference. Inventory of local components at [LOCAL_COMPONENTS](./references/LOCAL_COMPONENTS.md).

## Rules

- _DO NOT_ use TailwindCSS to style components, a default style system is aleady configured
- User TailwindCSS for layout page comonents only
- Use `baseUI` for comopnent rendering with the `render` prop. Example provided below

## BaseUI Example

Example showing the use of BaseUI `render` when coding shadcn component.

```jsx title="Base UI render prop"
<Button
  variant="link"
  className="text-muted-foreground"
  render={<a href="#" />}
>
  Learn more <ArrowUpRightIcon />
</Button>
```

## Additional Resources

- See [shadCN document link](references/SHADCN_DOC_LINKS.md) for shadcn/ui docs link index (use `.md` links)
