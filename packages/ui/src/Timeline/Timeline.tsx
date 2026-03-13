import * as React from 'react';

import { cn } from '@repo/helper';

import { Box } from '../Box';
import {
  timelineBodyVariants,
  timelineConnectorVariants,
  timelineDescriptionVariants,
  timelineItemVariants,
  timelineMarkerVariants,
  timelineRailVariants,
  timelineRootVariants,
  timelineTitleVariants,
} from './Timeline.variants';
import type { TimelineProps, TimelineStatusTone } from './Timeline.types';

function resolveTimelineTone(
  itemTone: TimelineStatusTone | undefined,
  rootTone: TimelineStatusTone | undefined,
) {
  return itemTone ?? rootTone ?? 'default';
}

/**
 * Presentation-only status or milestone timeline.
 *
 * The shared contract stays data-driven and app-agnostic: callers provide a
 * flat `items[]` array, optional shared `statusTone`, and the desired
 * orientation. Workflow logic, date math, and route-aware timelines stay
 * local to consuming apps.
 */
export const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(
  ({ items, orientation = 'vertical', statusTone = 'default', className, ...props }, ref) => {
    return (
      <Box
        ref={ref}
        role="list"
        data-slot="timeline"
        data-orientation={orientation}
        className={cn(timelineRootVariants({ orientation }), className)}
        {...props}
      >
        {items.map((item, index) => {
          const resolvedTone = resolveTimelineTone(item.statusTone, statusTone);
          const isLastItem = index === items.length - 1;

          return (
            <Box
              key={item.id}
              role="listitem"
              data-slot="timeline-item"
              data-orientation={orientation}
              className={timelineItemVariants({ orientation })}
            >
              <Box
                aria-hidden="true"
                data-slot="timeline-rail"
                className={timelineRailVariants({ orientation })}
              >
                <Box
                  data-slot="timeline-marker"
                  className={timelineMarkerVariants({ statusTone: resolvedTone })}
                >
                  <Box as="span" className="h-2 w-2 rounded-full bg-current" />
                </Box>
                {!isLastItem ? (
                  <Box
                    data-slot="timeline-connector"
                    className={timelineConnectorVariants({ orientation })}
                  />
                ) : null}
              </Box>

              <Box data-slot="timeline-body" className={timelineBodyVariants({ orientation })}>
                <Box data-slot="timeline-title" className={timelineTitleVariants()}>
                  {item.title}
                </Box>
                {item.description ? (
                  <Box data-slot="timeline-description" className={timelineDescriptionVariants()}>
                    {item.description}
                  </Box>
                ) : null}
              </Box>
            </Box>
          );
        })}
      </Box>
    );
  },
);

Timeline.displayName = 'Timeline';
