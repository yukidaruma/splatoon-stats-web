import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  DrawerProps,
  HStack,
  Stack,
  Text,
} from '@chakra-ui/react';

export const AppDrawer: React.FC<Pick<DrawerProps, 'isOpen' | 'onClose'>> = ({
  children,
  isOpen,
  onClose,
}) => {
  return (
    <Drawer placement="left" isOpen={isOpen} onClose={onClose}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">
            <HStack align="center">
              <Text flex="1">{process.env.APP_NAME}</Text>
              <DrawerCloseButton top="initial" />
            </HStack>
          </DrawerHeader>

          <DrawerBody py="6">
            <Stack spacing="24px">{children}</Stack>
          </DrawerBody>

          {/* TODO
          <DrawerFooter borderTopWidth="1px" justifyContent="center">
          </DrawerFooter>
          */}
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
