### Install Nextjs 

```sh
npx  create-next-app@latest [file name]
```

# My selection list nextjs option pack 

Would you like to use TypeScript? yes
Would you like to use ESLint ? yes
Would you like to use Tailwind CSS ? yes
Would you like your code inside a `src/`directory? no
Would you like to use App Router? yes
Would you like to use Turbopack for next dev? yes
Would you like to costomize the import alias(@/* by default)? no

### Getting Started

First, run the development server:

```sh
npm run dev
```

## Create the pages 



## Shadcn/ui
```sh
npx shadcn@latest init
```

add the ui style as you want 
example 

```sh
npx shadcn@latest add button 
```

##  Theme - Setting Dark & light mode on Web 

[Theming Option](https://ui.shadcn.com/docs/theming)

[Themes colors](https://ui.shadcn.com/themes)

- relplace css variable in globals.css

-Create app/providers.tsx

```tsx
'use client';

function Providers({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
export default Providers;
```

layout.tsx
```tsx
import Providers from './providers';

return (
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className}`}>
        <Providers>
          <Navigation />
          <main className='container py-10'>
            {children}
          </main>
        </Providers>
      </body>
    </html>
);
```

** DarkMode

```sh
npm install next-themes
```
create app/theme-provider.tsx
```tsx
'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

providers.tsx
```tsx
'use client';
import { ThemeProvider } from './theme-provider';

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='system'
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
export default Providers;
```

DarkMode.tsx
```sh
npx shadcn@latest add dropdown-menu button
````

```tsx
'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Button } from '../ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Moon, SunMedium } from 'lucide-react';

export default function DarkMode() {
    const { theme, resolvedTheme, setTheme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='outline' size='icon'>
                    <SunMedium className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
                    <Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
                    <span className='sr-only'>Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                <DropdownMenuItem onClick={() => setTheme('light')}>
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
```



## Add login with Google







