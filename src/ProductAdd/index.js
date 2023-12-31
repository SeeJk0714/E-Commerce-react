import { useState, useMemo } from "react";
import { useCookies } from "react-cookie";
import {
    Container,
    Title,
    Space,
    Card,
    TextInput,
    NumberInput,
    Divider,
    Button,
    Group,
    Image,
} from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { addProduct, addProductImage } from "../api/products";

function ProductAdd() {
    const [cookies] = useCookies(["currentUser"]);
    const { currentUser } = cookies;
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState("");
    const [uploading, setUploading] = useState(false);

    const isAdmin = useMemo(() => {
        return cookies &&
            cookies.currentUser &&
            cookies.currentUser.role === "admin"
            ? true
            : false;
    }, [cookies]);

    const createMutation = useMutation({
        mutationFn: addProduct,
        onSuccess: () => {
            notifications.show({
                title: "Product Added",
                color: "green",
            });
            navigate("/");
        },
        onError: (error) => {
            notifications.show({
                title: error.response.data.message,
                color: "red",
            });
        },
    });

    const handleAddNewProduct = async (event) => {
        event.preventDefault();
        createMutation.mutate({
            data: JSON.stringify({
                name: name,
                description: description,
                price: price,
                category: category,
                image: image,
            }),
            token: currentUser ? currentUser.token : "",
        });
    };

    const uploadMutaion = useMutation({
        mutationFn: addProductImage,
        onSuccess: (data) => {
            setImage(data.image_url);
        },
        onError: (error) => {
            notifications.show({
                title: error.response.data.message,
                color: "red",
            });
        },
    });

    const handleImageUpload = (files) => {
        uploadMutaion.mutate(files[0]);
        setUploading(true);
    };

    return (
        <Container>
            <Space h="50px" />
            <Title order={2} align="center">
                Add New Movie
            </Title>
            <Space h="50px" />
            <Card withBorder shadow="md" p="20px">
                <TextInput
                    value={name}
                    placeholder="Enter the movie name here"
                    label="Name"
                    description="The name of the movie"
                    withAsterisk
                    onChange={(event) => setName(event.target.value)}
                />
                <Space h="20px" />
                <Divider />
                <Space h="20px" />
                {image && image !== "" ? (
                    <>
                        <Image
                            src={"http://10.1.104.8:5000/" + image}
                            width="100%"
                        />
                        <Button
                            color="dark"
                            mt="15px"
                            onClick={() => setImage("")}
                        >
                            Remove Image
                        </Button>
                    </>
                ) : (
                    <Dropzone
                        multiple={false}
                        accept={IMAGE_MIME_TYPE}
                        onDrop={(files) => {
                            handleImageUpload(files);
                        }}
                    >
                        <Title order={4} align="center" py="20px">
                            Click to upload or Drag image to upload
                        </Title>
                    </Dropzone>
                )}
                <Space h="20px" />
                <Divider />
                <Space h="20px" />
                <TextInput
                    value={description}
                    placeholder="Enter the movie description here"
                    label="Description"
                    description="The description of the movie"
                    withAsterisk
                    onChange={(event) => setDescription(event.target.value)}
                />
                <Space h="20px" />
                <Divider />
                <Space h="20px" />
                <NumberInput
                    value={price}
                    placeholder="Enter the price here"
                    label="Price"
                    precision={2}
                    description="The price of the movie"
                    withAsterisk
                    onChange={setPrice}
                />
                <Space h="20px" />
                <Divider />
                <Space h="20px" />
                <TextInput
                    value={category}
                    placeholder="Enter the category here"
                    label="Category"
                    description="The category of the movie"
                    withAsterisk
                    onChange={(event) => setCategory(event.target.value)}
                />
                <Space h="20px" />
                {isAdmin ? (
                    <Button fullWidth onClick={handleAddNewProduct}>
                        Add New Product
                    </Button>
                ) : null}
            </Card>
            <Space h="20px" />
            <Group position="center">
                <Button
                    component={Link}
                    to="/"
                    variant="subtle"
                    size="xs"
                    color="gray"
                >
                    Go back to Home
                </Button>
            </Group>
            <Space h="100px" />
        </Container>
    );
}
export default ProductAdd;
