import type { Meta, StoryObj } from '@storybook/react';
import { useState, type ComponentPropsWithoutRef, type ReactNode } from 'react';

import { Box } from '../Box';
import { Button } from '../Button';
import { Input } from '../Input';
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHandle,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './Drawer';

type DrawerRootProps = ComponentPropsWithoutRef<typeof Drawer>;
type DrawerContentProps = ComponentPropsWithoutRef<typeof DrawerContent>;

type Direction = NonNullable<DrawerRootProps['direction']>;

const directions: Direction[] = ['left', 'right', 'top', 'bottom'];

const meta = {
  title: 'Components/Drawer',
  component: Drawer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    shouldScaleBackground: {
      control: 'boolean',
      description: 'Scales the background content when the drawer is open',
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Whether the drawer should be open on initial render',
    },
    direction: {
      control: 'inline-radio',
      options: directions,
      description: 'Which side the drawer should slide from',
    },
  },
  args: {
    shouldScaleBackground: true,
    defaultOpen: false,
    direction: 'left',
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

function DrawerCanvas({ children }: { children: ReactNode }) {
  return (
    <Box className="flex min-h-screen items-center justify-center bg-gray-50 p-8">{children}</Box>
  );
}

function renderBasicDrawer(rootProps: DrawerRootProps, contentProps: DrawerContentProps = {}) {
  const { children, ...restContentProps } = contentProps;

  const direction = rootProps.direction ?? 'left';
  const showHandle = direction === 'bottom' || direction === 'top';

  const defaultContent = (
    <>
      {showHandle && <DrawerHandle />}
      <DrawerHeader>
        <DrawerTitle>Policy summary</DrawerTitle>
        <DrawerDescription>Review the plan details before confirming changes.</DrawerDescription>
      </DrawerHeader>
      <DrawerBody className="px-4 pb-4">
        <Box className="flex flex-col gap-3 text-sm text-gray-600">
          <Box className="flex items-center justify-between">
            <Box className="font-medium text-gray-900">Coverage</Box>
            <Box>Enhanced</Box>
          </Box>
          <Box className="flex items-center justify-between">
            <Box className="font-medium text-gray-900">Deductible</Box>
            <Box>$500</Box>
          </Box>
          <Box className="flex items-center justify-between">
            <Box className="font-medium text-gray-900">Monthly premium</Box>
            <Box>$124.00</Box>
          </Box>
        </Box>
      </DrawerBody>
      <DrawerFooter>
        <Button>Confirm changes</Button>
        <DrawerClose asChild>
          <Button variant="outline">Keep current plan</Button>
        </DrawerClose>
      </DrawerFooter>
    </>
  );

  return (
    <DrawerCanvas>
      <Drawer {...rootProps}>
        <DrawerTrigger asChild>
          <Button>View policy summary</Button>
        </DrawerTrigger>
        <DrawerContent {...restContentProps}>{children ?? defaultContent}</DrawerContent>
      </Drawer>
    </DrawerCanvas>
  );
}

export const Default: Story = {
  render: (args: DrawerRootProps) => renderBasicDrawer(args),
};

export const DefaultOpen: Story = {
  args: {
    defaultOpen: true,
  },
  render: (args: DrawerRootProps) => renderBasicDrawer(args),
};

export const ScrollableContent: Story = {
  render: (args: DrawerRootProps) =>
    renderBasicDrawer(args, {
      children: (
        <>
          <DrawerHeader>
            <DrawerTitle>Driver list</DrawerTitle>
            <DrawerDescription>Review all drivers attached to your policy.</DrawerDescription>
          </DrawerHeader>
          <DrawerBody className="px-4 pb-4">
            <Box className="flex flex-col gap-3 text-sm text-gray-600">
              {Array.from({ length: 16 }).map((_, index) => (
                <Box
                  key={`driver-${index}`}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2"
                >
                  <Box>
                    <Box className="font-medium text-gray-900">Driver {index + 1}</Box>
                    <Box className="text-xs text-gray-500">Active</Box>
                  </Box>
                  <Button size="sm" variant="secondary">
                    View
                  </Button>
                </Box>
              ))}
            </Box>
          </DrawerBody>
          <DrawerFooter>
            <Button>Save updates</Button>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </>
      ),
    }),
};

export const FormLayout: Story = {
  render: (args: DrawerRootProps) =>
    renderBasicDrawer(args, {
      children: (
        <>
          <DrawerHeader>
            <DrawerTitle>Update contact details</DrawerTitle>
            <DrawerDescription>
              Keep your phone and email current for claim updates.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerBody className="px-4 pb-4">
            <Box className="flex flex-col gap-4">
              <Box className="flex flex-col gap-2">
                <Box as="label" className="text-xs font-medium text-gray-600">
                  Email
                </Box>
                <Input placeholder="name@example.com" />
              </Box>
              <Box className="flex flex-col gap-2">
                <Box as="label" className="text-xs font-medium text-gray-600">
                  Phone
                </Box>
                <Input placeholder="(555) 123-4567" />
              </Box>
            </Box>
          </DrawerBody>
          <DrawerFooter>
            <Button>Save changes</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </>
      ),
    }),
};

export const Positions: Story = {
  render: () => (
    <DrawerCanvas>
      <Box className="flex flex-wrap items-center justify-center gap-3">
        {directions.map((direction) => {
          const showHandle = direction === 'bottom' || direction === 'top';

          return (
            <Drawer key={direction} direction={direction} shouldScaleBackground>
              <DrawerTrigger asChild>
                <Button variant="outline" className="min-w-28 capitalize">
                  {direction}
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                {showHandle && <DrawerHandle />}
                <DrawerHeader>
                  <DrawerTitle className="capitalize">{direction} drawer</DrawerTitle>
                  <DrawerDescription>This drawer slides in from the {direction}.</DrawerDescription>
                </DrawerHeader>
                <DrawerBody className="px-4 pb-4 text-sm text-gray-700">
                  Use the direction prop to place drawers on any side.
                </DrawerBody>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button variant="outline">Close</Button>
                  </DrawerClose>
                  <Button>Continue</Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          );
        })}
      </Box>
    </DrawerCanvas>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <DrawerCanvas>
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button variant="secondary">{open ? 'Hide details' : 'Show details'}</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Billing details</DrawerTitle>
              <DrawerDescription>
                Your next payment is scheduled for February 12, 2026.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerBody className="px-4 pb-4 text-sm text-gray-600">
              Keep a card on file to avoid missed payments and late fees.
            </DrawerBody>
            <DrawerFooter>
              <Button onClick={() => setOpen(false)}>Close drawer</Button>
              <DrawerClose asChild>
                <Button variant="outline">Dismiss</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </DrawerCanvas>
    );
  },
};
