import { Title, Space, Divider, Group, Button } from "@mantine/core";
import { Link } from "react-router-dom";
export default function Header({ title, page = "" }) {
    return (
        <>
            <Title align="center">{title}</Title>
            <Space h="20px" />
            <Group position="center">
                <Button
                    component={Link}
                    to="/"
                    variant={page === "home" ? "filled" : "light"}
                >
                    Home
                </Button>
                <Button
                    component={Link}
                    to="/cart"
                    variant={page === "cart" ? "filled" : "light"}
                >
                    Cart
                </Button>
                <Button
                    component={Link}
                    to="/orders"
                    variant={page === "order" ? "filled" : "light"}
                >
                    My Orders
                </Button>
            </Group>
            <Space h="20px" />
            <Divider />
        </>
    );
}
