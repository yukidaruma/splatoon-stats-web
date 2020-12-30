import { AppDrawer } from '@/components/AppDrawer';
import {
  Box,
  Container,
  Flex,
  HStack,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  Stack,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import Head from 'next/head';
import NextLink from 'next/link';
import React, { ReactNode } from 'react';
import { FaBars, FaGithub, FaSearch, FaTwitter } from 'react-icons/fa';

type Props = {
  children?: ReactNode;
  title: string;
};

const MenuItem: React.FC = ({ children }) => <Text>{children}</Text>;

const menuItems: Array<{ title: string; to: string }> = [
  { title: 'Trends', to: '/' },
  { title: 'Rankings', to: '/' },
  { title: 'Players', to: '/' },
  { title: 'Records', to: '/' },
];

const HeaderSearchField: React.FC = () => {
  return (
    <InputGroup size="sm">
      <InputLeftElement>
        <Icon as={FaSearch} />
      </InputLeftElement>
      <Input borderRadius="0" placeholder="Search by player name" />
    </InputGroup>
  );
};

const Layout = ({ children, title }: Props): React.ReactElement => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  let headTitle = process.env.APP_NAME;
  if (title) {
    headTitle += ` - ${title}`;
  }

  const NavigationItems = menuItems.map((item, i) => (
    <NextLink key={i} href={item.to}>
      <Link>
        <MenuItem>{item.title}</MenuItem>
      </Link>
    </NextLink>
  ));

  // TODO: use lg instead of magic number https://github.com/chakra-ui/chakra-ui/issues/2730
  return (
    <>
      <Head>
        <title>{headTitle}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Flex as="header" align="center" backgroundColor="blue.800" color="white" px="6" py="3">
        <Box onClick={isOpen ? onClose : onOpen}>
          <Icon as={FaBars} />
        </Box>

        <HStack spacing="10" ml="6" as="nav" flex="1">
          <Box display={{ base: 'none', md: 'block' }}>
            <NextLink href="/">
              <Heading as="h1" fontSize="26px" letterSpacing={'.05rem'}>
                <a>{process.env.APP_NAME}</a>
              </Heading>
            </NextLink>
          </Box>

          <Stack direction="row-reverse" justifyContent="space-between" flex="1">
            <Box>
              <HeaderSearchField />
            </Box>

            <HStack display={{ base: 'none', lg: 'flex' }} spacing="4">
              {NavigationItems}
            </HStack>
          </Stack>
        </HStack>
      </Flex>

      <AppDrawer isOpen={isOpen} onClose={onClose}>
        {NavigationItems}
      </AppDrawer>

      <Container maxW="1280px" centerContent>
        <VStack alignItems="start" w="100%" spacing="3">
          <Heading mt="6" as="h2" fontSize="22px">
            {title}
          </Heading>
          <div>{children}</div>
        </VStack>

        <VStack mt="6" as="footer">
          <HStack spacing="3">
            <Link isExternal href="https://twitter.com/SplatoonStats">
              <Icon boxSize="18px" as={FaTwitter} color="#1da1f2" />
            </Link>
            <Link isExternal href={process.env.REPO_URL}>
              <Icon boxSize="18px" as={FaGithub} />
            </Link>
          </HStack>

          <Box mt="4">
            Made with ❄ by&nbsp;
            <Link color="teal.300" href="https://twitter.com/Yukinkling" isExternal>
              @Yukinkling
            </Link>
          </Box>
        </VStack>
      </Container>
    </>
  );
};

export default Layout;
