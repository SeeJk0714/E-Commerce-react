import { useState, useMemo } from "react";
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
import { Link, useNavigate, useParams } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useCookies } from "react-cookie";
import { getProduct, updateProduct, uploadProductImage } from "../api/products";

function ProductEdit() {
    const [cookies] = useCookies(["currentUser"]);
    const { currentUser } = cookies;
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState("");
    const [uploading, setUploading] = useState(false);
    const { isLoading } = useQuery({
        queryKey: ["product", id],
        queryFn: () => getProduct(id),
        onSuccess: (data) => {
            setName(data.name);
            setDescription(data.description);
            setPrice(data.price);
            setCategory(data.category);
            setImage(data.image);
        },
    });

    const isAdmin = useMemo(() => {
        return cookies &&
            cookies.currentUser &&
            cookies.currentUser.role === "admin"
            ? true
            : false;
    }, [cookies]);

    const updateMutation = useMutation({
        mutationFn: updateProduct,
        onSuccess: () => {
            notifications.show({
                title: "Product Edited",
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

    const handleUpdateProduct = async (event) => {
        event.preventDefault();
        updateMutation.mutate({
            id: id,
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
        mutationFn: uploadProductImage,
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
                Edit Product
            </Title>
            <Space h="50px" />
            <Card withBorder shadow="md" p="20px">
                <TextInput
                    value={name}
                    placeholder="Enter the product title here"
                    label="Name"
                    description="The title of the product"
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
                    placeholder="Enter the product description here"
                    label="description"
                    description="The description of the product"
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
                    description="The price of the product"
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
                    description="The category of the product"
                    withAsterisk
                    onChange={setCategory}
                />
                <Space h="20px" />
                {isAdmin ? (
                    <Button fullWidth onClick={handleUpdateProduct}>
                        Edit Product
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
export default ProductEdit;
