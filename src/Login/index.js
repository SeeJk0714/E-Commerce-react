import {
    Card,
    Button,
    Group,
    Container,
    Space,
    TextInput,
    Title,
} from "@mantine/core";
import { Link } from "react-router-dom";
import Header from "../Header";

export default function Login() {
    return (
        <Container>
            <Space h="50px" />
            <Header title="Login" page="login" />
            <Space h="50px" />
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Space h="30px" />
                <TextInput label="Email" placeholder="example@gmail.com" />
                <Space h="30px" />
                <TextInput label="Password" placeholder="123456789" />
                <Space h="30px" />
                <Button
                    variant="light"
                    color="blue"
                    fullWidth
                    mt="md"
                    radius="md"
                >
                    Submit
                </Button>
            </Card>
            <Group position="apart">
                <Button component={Link} to="/" variant="transparent">
                    back to home
                </Button>
                <Button component={Link} to="/signin" variant="transparent">
                    Sign In
                </Button>
            </Group>
        </Container>
    );
}
