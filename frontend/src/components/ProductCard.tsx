import React, { useState } from "react";
import {
  Box,
  Button,
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useProductStore } from "../store/product";

export default function ProductCard({ product }) {
  //Variáveis para atualizar o produto
  const [updateProduct, setUpdatedProduct] = useState(product);

  //Variaveis de interface
  const textColor = useColorModeValue("gray.600", "gray.200");
  const bg = useColorModeValue("white", "gray.800");

  //Variaveis para o modal
  const { isOpen, onOpen, onClose } = useDisclosure();

  //Toast
  const toast = useToast();

  //Acessando o método deletar Produtor
  const { deleteProduct, updatedProduct } = useProductStore();

  //Função para deletar produto
  const handleDeleteProduct = async (pid) => {
    const { success, message } = await deleteProduct(pid);
    if (!success) {
      toast({
        title: "Falhou!",
        description: message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Sucesso!",
        description: message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  //Atualizar Producto
  const handleUpdateProduct = async (pid, updateProduct) => {
    const { success, message } = await updatedProduct(pid, updateProduct);
    onClose();

    if (success) {
      toast({
        title: "Sucesso!",
        description: message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Falhou!",
        description: message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      shadow={"lg"}
      rounded={"lg"}
      overflow={"hidden"}
      transition={"all 0.3s"}
      _hover={{ transform: "translateY(-5px)", shadow: "xl" }}
      bg={bg}
    >
      <Image
        src={product.image}
        alt={product.name}
        h={48}
        w={"full"}
        objectFit={"cover"}
      />
      <Box p={4}>
        <Heading as={"h3"} size={"md"} mb={2}>
          {product.name}
        </Heading>

        <Text fontWeight={"bold"} fontSize={"xl"} color={textColor} mb={4}>
          {product.price}
        </Text>

        <HStack spacing={2}>
          <IconButton
            aria-label="editar"
            icon={<EditIcon />}
            onClick={onOpen}
            colorScheme="blue"
          />
          <IconButton
            aria-label="deletar"
            icon={<DeleteIcon />}
            onClick={() => handleDeleteProduct(product._id)}
            colorScheme="red"
          />
        </HStack>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar Produto</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Input
                placeholder="Nome do Produto"
                name="name"
                value={updateProduct.name}
                onChange={(e) =>
                  setUpdatedProduct({ ...updateProduct, name: e.target.value })
                }
              />
              <Input
                placeholder="Preço"
                name="price"
                value={updateProduct.price}
                onChange={(e) =>
                  setUpdatedProduct({ ...updateProduct, price: e.target.value })
                }
              />
              <Input
                placeholder="URL da Imagem"
                name="image"
                value={updateProduct.image}
                onChange={(e) =>
                  setUpdatedProduct({ ...updateProduct, image: e.target.value })
                }
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant={"ghost"} mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button
              colorScheme={"blue"}
              onClick={() => handleUpdateProduct(product._id, updateProduct)}
            >
              Atualizar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
