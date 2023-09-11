import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Title, Grid, Card, Badge, Group, Space, Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const fetchProducts = async (category = "") => {
    const response = await axios.get(
        "http://localhost:5000/products?" +
            (category !== "" ? "category=" + category : "")
    );
    return response.data;
};

const deleteProduct = async (product_id = "") => {
    const response = await axios({
        method: "DELETE",
        url: "http://localhost:5000/products/" + product_id,
    });
    return response.data;
};

function Products() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [category, setCategory] = useState("");
    const {
        isLoading,
        isError,
        data: products,
        error,
    } = useQuery({
        queryKey: ["products", category],
        queryFn: () => fetchProducts(category),
    });

    const memoryProducts = queryClient.getQueryData(["products", ""]);
    const categoryOptions = useMemo(() => {
        let options = [];
        if (memoryProducts && memoryProducts.length > 0) {
            memoryProducts.forEach((product) => {
                if (!options.includes(product.category)) {
                    options.push(product.category);
                }
            });
        }
        return options;
    }, [memoryProducts]);

    const deleteMutation = useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["products", category],
            });
            notifications.show({
                title: "Product Deleted",
                color: "green",
            });
        },
    });

    return (
        <>
            <Group position="apart">
                <Title order={3} align="center">
                    Products
                </Title>
                <Button component={Link} to="/product_add" color="green">
                    Add New
                </Button>
            </Group>
            <Space h="20px" />
            <Group>
                <select
                    onChange={(event) => {
                        setCategory(event.target.value);
                    }}
                >
                    <option value="">All Category</option>
                    {categoryOptions.map((category) => {
                        return (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        );
                    })}
                </select>
            </Group>
            <Space h="20px" />
            <Grid>
                {products
                    ? products.map((product) => {
                          return (
                              <Grid.Col key={product._id} lg={4} sm={6} xs={12}>
                                  <Card withBorder shadow="sm" p="20px">
                                      <Title order={5}>{product.name}</Title>
                                      <Space h="20px" />
                                      <Group position="apart" spacing="5px">
                                          <Badge color="green">
                                              ${product.price}
                                          </Badge>
                                          <Badge color="yellow">
                                              {product.category}
                                          </Badge>
                                      </Group>
                                      <Space h="20px" />
                                      <Button fullWidth> Add To Cart</Button>
                                      <Space h="20px" />
                                      <Group position="apart">
                                          <Button
                                              component={Link}
                                              to={"/products/" + product._id}
                                              color="blue"
                                              size="xs"
                                              radius="50px"
                                          >
                                              Edit
                                          </Button>
                                          <Button
                                              color="red"
                                              size="xs"
                                              radius="50px"
                                              onClick={() => {
                                                  deleteMutation.mutate(
                                                      product._id
                                                  );
                                              }}
                                          >
                                              Delete
                                          </Button>
                                      </Group>
                                  </Card>
                              </Grid.Col>
                          );
                      })
                    : null}
            </Grid>
        </>
    );
}

export default Products;
