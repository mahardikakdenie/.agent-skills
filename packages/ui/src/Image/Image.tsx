import { ImageOff } from 'lucide-react';
import * as React from 'react';

import { cn } from '@repo/helper';

import { Box } from '../Box';
import type { ImageProps } from './Image.types';
import { imageElementVariants, imageFallbackVariants, imageRootVariants } from './Image.variants';

const DEFAULT_FALLBACK_LABEL = 'No image available';

type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error';

function toCssDimension(value?: number | string) {
  if (typeof value === 'number') {
    return `${value}px`;
  }

  return value;
}

/**
 * Shared image primitive for generic media display with optional fallback
 * content, object-fit control, and aspect-ratio presets.
 */
export const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      src,
      alt,
      fallback,
      ratio = 'auto',
      fit = 'cover',
      className,
      width,
      height,
      onLoad,
      onError,
      onClick,
      onKeyDown,
      onKeyUp,
      onFocus,
      onBlur,
      onMouseEnter,
      onMouseLeave,
      tabIndex,
      role,
      title,
      id,
      style,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-hidden': ariaHidden,
      ...props
    },
    forwardedRef,
  ) => {
    const imageRef = React.useRef<HTMLImageElement>(null);
    const [loadingStatus, setLoadingStatus] = React.useState<ImageLoadingStatus>('idle');

    React.useImperativeHandle(forwardedRef, () => imageRef.current as HTMLImageElement);

    React.useEffect(() => {
      setLoadingStatus(src ? 'loading' : 'error');
    }, [src]);

    const showFallback = !src || loadingStatus === 'error';
    const isInteractive =
      Boolean(onClick) || role === 'button' || role === 'link' || tabIndex !== undefined;
    const wrapperStyle = {
      width: ratio === 'auto' ? toCssDimension(width) : undefined,
      height: ratio === 'auto' ? toCssDimension(height) : undefined,
      aspectRatio: ratio === 'portrait' ? '3 / 4' : undefined,
    } satisfies React.CSSProperties;
    const fallbackLabel = typeof fallback === 'string' ? fallback : DEFAULT_FALLBACK_LABEL;
    const resolvedFallback =
      fallback && typeof fallback !== 'string' ? (
        fallback
      ) : (
        <Box className="flex flex-col items-center gap-3">
          <Box className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background shadow-none">
            <ImageOff aria-hidden="true" className="h-5 w-5" />
          </Box>
          <Box as="span" className="text-sm font-medium">
            {fallbackLabel}
          </Box>
        </Box>
      );

    return (
      <Box
        as="span"
        id={id}
        role={role}
        tabIndex={tabIndex}
        title={title}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-hidden={ariaHidden}
        data-slot="image"
        data-ratio={ratio}
        data-loading-status={loadingStatus}
        className={cn(imageRootVariants({ ratio, interactive: isInteractive }), className)}
        style={wrapperStyle}
        onClick={onClick as React.MouseEventHandler<HTMLSpanElement> | undefined}
        onKeyDown={onKeyDown as React.KeyboardEventHandler<HTMLSpanElement> | undefined}
        onKeyUp={onKeyUp as React.KeyboardEventHandler<HTMLSpanElement> | undefined}
        onFocus={onFocus as React.FocusEventHandler<HTMLSpanElement> | undefined}
        onBlur={onBlur as React.FocusEventHandler<HTMLSpanElement> | undefined}
        onMouseEnter={onMouseEnter as React.MouseEventHandler<HTMLSpanElement> | undefined}
        onMouseLeave={onMouseLeave as React.MouseEventHandler<HTMLSpanElement> | undefined}
      >
        {src ? (
          <Box
            as="img"
            ref={imageRef}
            src={src}
            alt={alt ?? ''}
            width={width}
            height={height}
            style={style}
            data-slot="image-element"
            data-loading-status={loadingStatus}
            className={imageElementVariants({ fit, visible: !showFallback })}
            onLoad={(event) => {
              setLoadingStatus('loaded');
              onLoad?.(event);
            }}
            onError={(event) => {
              setLoadingStatus('error');
              onError?.(event);
            }}
            {...props}
          />
        ) : null}

        <Box
          as="span"
          data-slot="image-fallback"
          data-visible={showFallback}
          aria-hidden={showFallback ? undefined : true}
          className={imageFallbackVariants({ visible: showFallback })}
        >
          {resolvedFallback}
        </Box>
      </Box>
    );
  },
);

Image.displayName = 'Image';
