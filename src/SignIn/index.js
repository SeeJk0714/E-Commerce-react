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

export default function SignIn() {
    return (
        <Container>
            <Space h="50px" />
            <Header title="Sign In" page="signin" />
            <Space h="50px" />
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Space h="30px" />
                <TextInput label="Name" placeholder="Name" />
                <Space h="30px" />
                <TextInput label="Email" placeholder="example@gmail.com" />
                <Space h="30px" />
                <TextInput label="Password" placeholder="123456789" />
                <Space h="30px" />
                <TextInput label="Confirm-Password" placeholder="123456789" />

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
            <Button component={Link} to="/" variant="transparent">
                back to home
            </Button>
        </Container>
    );
}
