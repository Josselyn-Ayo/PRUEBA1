type Style = Record<string, any>;

const spacing: Record<number, number> = { 
  0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40 
};

const colorMap: Record<string, string> = {
  'blue-500': '#1D9BF0',
  'blue-700': '#006391', // El azul oscuro que usamos en botones
  'red-500': '#E21837',  // Rojo principal
  'red-600': '#b3132b',
  'red-400': '#f87171',
  'green-500': '#10B981',
  'gray-50': '#f9fafb',
  'gray-100': '#f3f4f6',
  'gray-200': '#eee',
  'gray-300': '#ddd',
  'gray-400': '#9ca3af',
  'gray-500': '#6B7280',
  'gray-600': '#4b5563',
  'gray-700': '#374151',
  'gray-800': '#1f2937',
  'white': '#ffffff',
};

export function tw(classNames: string): Style {
  const classes = classNames.split(/\s+/).filter(Boolean);
  const style: any = {};

  for (const c of classes) {
    // Layout & Flex
    if (c === 'flex-1') style.flex = 1;
    else if (c === 'flex-row') style.flexDirection = 'row';
    else if (c === 'justify-center') style.justifyContent = 'center';
    else if (c === 'justify-between') style.justifyContent = 'space-between';
    else if (c === 'items-center') style.alignItems = 'center';
    
    // Spacing (Padding)
    else if (c.startsWith('p-')) {
      const n = Number(c.split('-')[1]);
      style.padding = spacing[n] ?? 16;
    } else if (c.startsWith('px-')) {
      const n = Number(c.split('-')[1]);
      style.paddingHorizontal = spacing[n] ?? 16;
    } else if (c.startsWith('py-')) {
      const n = Number(c.split('-')[1]);
      style.paddingVertical = spacing[n] ?? 16;
    }

    // Spacing (Margin)
    else if (c.startsWith('mb-')) {
      const n = Number(c.split('-')[1]);
      style.marginBottom = spacing[n] ?? 12;
    } else if (c.startsWith('mt-')) {
      const n = Number(c.split('-')[1]);
      style.marginTop = spacing[n] ?? 12;
    }

    // Sizing
    else if (c === 'w-full') style.width = '100%';

    // Borders & Radius
    else if (c === 'border') style.borderWidth = 1;
    else if (c === 'border-b') style.borderBottomWidth = 1;
    else if (c === 'border-l-2') style.borderLeftWidth = 2;
    else if (c === 'rounded-md') style.borderRadius = 8;
    else if (c === 'rounded-lg') style.borderRadius = 12;
    else if (c === 'rounded-xl') style.borderRadius = 16;
    else if (c === 'rounded-full') style.borderRadius = 9999;
    else if (c.startsWith('border-')) {
      const col = c.split('-').slice(1).join('-');
      style.borderColor = colorMap[col] ?? colorMap['gray-300'];
    }

    // Colors (Background)
    else if (c.startsWith('bg-')) {
      const col = c.split('-').slice(1).join('-');
      style.backgroundColor = colorMap[col] ?? undefined;
    }
    else if (c === 'bg-[#006391]') style.backgroundColor = '#006391';
    else if (c === 'bg-[#E21837]') style.backgroundColor = '#E21837';

    // Typography
    else if (c.startsWith('text-')) {
      const parts = c.split('-');
      if (parts[1] === 'white') style.color = colorMap['white'];
      else if (parts[1] === 'center') style.textAlign = 'center';
      else if (parts[1] === '3xl') style.fontSize = 30;
      else if (parts[1] === '2xl') style.fontSize = 24;
      else if (parts[1] === 'xl') style.fontSize = 20;
      else if (parts[1] === 'lg') style.fontSize = 18;
      else if (parts[1] === 'sm') style.fontSize = 14;
      else if (parts[1] === 'xs') style.fontSize = 12;
      else {
        const col = parts.slice(1).join('-');
        style.color = colorMap[col] ?? undefined;
      }
    }
    else if (c === 'font-bold') style.fontWeight = '700';
    else if (c === 'font-semibold') style.fontWeight = '600';
    else if (c === 'uppercase') style.textTransform = 'uppercase';

    // Shadow (Sombra básica para tarjetas y botones)
    else if (c === 'shadow-sm') {
      style.shadowColor = '#000';
      style.shadowOffset = { width: 0, height: 1 };
      style.shadowOpacity = 0.1;
      style.shadowRadius = 2;
      style.elevation = 1;
    }
    else if (c === 'shadow-md') {
      style.shadowColor = '#000';
      style.shadowOffset = { width: 0, height: 2 };
      style.shadowOpacity = 0.2;
      style.shadowRadius = 4;
      style.elevation = 3;
    }
  }

  return style as Style;
}

export default tw;