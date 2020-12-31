import { AppDrawer } from '@/components/AppDrawer';
import useEnterKey from '@/hooks/useEnterKey';
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
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactNode, useEffect, useRef } from 'react';
import { FaBars, FaGithub, FaSearch, FaTwitter } from 'react-icons/fa';

type Props = {
  children?: ReactNode;
  headerTitle?: Nullable<string>;
  title?: Nullable<string>;
};

const MenuItem: React.FC = ({ children }) => <Text>{children}</Text>;

const menuItems: Array<{ title: string; to: string }> = [
  { title: 'Trends', to: '/' },
  { title: 'Rankings', to: '/' },
  { title: 'Players', to: '/' },
  { title: 'Records', to: '/' },
];

const HeaderSearchField: React.FC = () => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null) as React.MutableRefObject<HTMLInputElement>;

  useEffect(() => {
    inputRef.current.value = ((router.query.q as string) ?? '').trim();
  });

  const openSearchResult = () => {
    const query = inputRef.current.value.trim();
    if (query && query !== router.query.q) {
      router.push({
        pathname: '/search',
        query: { q: query },
      });
    }
  };
  useEnterKey(openSearchResult, inputRef);

  return (
    <InputGroup size="sm">
      <InputLeftElement>
        <Icon as={FaSearch} />
      </InputLeftElement>
      <Input ref={inputRef} placeholder="Search by player name" />
    </InputGroup>
  );
};

const Layout = ({ children, headerTitle, title }: Props): React.ReactElement => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const route = useRouter();
  const { t } = useTranslation('ui');

  let headTitle = t(`title.${route.pathname}`);
  if (title) {
    headTitle = `${title} - ${headTitle}`;
  }
  headTitle += ` - ${process.env.APP_NAME}`;

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
            {headerTitle ?? title}
          </Heading>
          <Box w="100%">{children}</Box>
        </VStack>

        <VStack mt="6" py="4" as="footer">
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
