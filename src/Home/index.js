import { Container, Title, Space, Divider } from "@mantine/core";

import Products from "../Products";

function Home() {
    return (
        <Container>
            <Space h="50px" />
            <Title align="center">Welcome To My Store</Title>
            <Space h="20px" />
            <Divider />
            <Space h="30px" />
            <Products />
            <Space h="30px" />
        </Container>
    );
}

export default Home;
