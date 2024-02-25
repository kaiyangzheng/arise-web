// @ts-nocheck

import { Flex, Box } from '@chakra-ui/react';

const TileTouchableOpacities = ({ tilePass, tilePassIndex }) => {
  return (
    <Flex align="center" h="100vh">
      <Flex wrap="wrap">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number, index) => (
          <Box
            key={number}
            w="100px"
            h="100px"
            bg={tilePass[tilePassIndex] == number ? "red" : "#3498db"}
            color="white"
            textAlign="center"
            lineHeight="100px"
            fontSize="xl"
            m="5px"
            borderRadius="md"
            cursor="pointer"
            _hover={{ opacity: 0.8 }}
          >
            {number}
          </Box>
        ))}
      </Flex>
    </Flex>
  );
};

export default TileTouchableOpacities;
