import { useState } from "react";
import {
    Container,
    Title,
    Space,
    Divider,
    Group,
    Button,
    Table,
    Image,
    Checkbox,
} from "@mantine/core";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import Header from "../Header";
import { getCartItems, removeItemFromCart } from "../api/cart";

export default function Cart() {
    const [checkedList, setCheckedList] = useState([]);
    const [checkAll, setCheckAll] = useState(false);

    const queryClient = useQueryClient();
    const { data: cart = [] } = useQuery({
        queryKey: ["cart"],
        queryFn: getCartItems,
    });

    const checkBoxAll = (event) => {
        if (event.target.checked) {
            const newCheckedList = [];
            cart.forEach((cart) => {
                newCheckedList.push(cart._id);
            });
            setCheckedList(newCheckedList);
            setCheckAll(true);
        } else {
            setCheckedList([]);
            setCheckAll(false);
        }
    };
    const checkboxOne = (event, id) => {
        if (event.target.checked) {
            const newCheckedList = [...checkedList];
            newCheckedList.push(id);
            setCheckedList(newCheckedList);
        } else {
            const newCheckedList = checkedList.filter((cart) => cart !== id);
            setCheckedList(newCheckedList);
        }
    };

    const deleteCheckedItems = () => {
        const newCart = cart.filter((item) => !checkedList.includes(item._id));

        queryClient.setQueryData(["cart"], newCart);

        setCheckedList([]);
        localStorage.setItem("cart", JSON.stringify(newCart));

        setCheckAll(false);
        setCheckedList([]);
    };

    const calculateTotal = () => {
        let total = 0;
        cart.map((item) => (total = total + item.quantity * item.price));
        return total;
    };

    const deleteCartMutation = useMutation({
        mutationFn: removeItemFromCart,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["cart"],
            });
            notifications.show({
                title: "Product Delete to Cart",
                color: "green",
            });
        },
    });

    const rows = cart.map((element) => (
        <tr key={element._id}>
            <td>
                <Checkbox
                    checked={
                        checkedList && checkedList.includes(element._id)
                            ? true
                            : false
                    }
                    type="checkbox"
                    onChange={(event) => {
                        checkboxOne(event, element._id);
                    }}
                />
            </td>
            <td>
                <Group>
                    <Image
                        src={"http://localhost:5000/" + element.image}
                        width="150px"
                    />
                    {element.name}
                </Group>
            </td>
            <td>${element.price}</td>
            <td>{element.quantity}</td>
            <td>${element.price * element.quantity}</td>
            <td>
                <Button
                    variant="outline"
                    color="red"
                    onClick={() => {
                        deleteCartMutation.mutate(element._id);
                    }}
                >
                    Remove
                </Button>
            </td>
        </tr>
    ));

    return (
        <Container>
            <Space h="50px" />
            <Header />
            <Space h="20px" />
            <Title order={3} align="center">
                Carts
            </Title>
            <Space h="20px" />
            <Container>
                <Table>
                    <thead>
                        <tr>
                            <th>
                                <Checkbox
                                    type="checkbox"
                                    checked={checkAll}
                                    disabled={
                                        cart && cart.length > 0 ? false : true
                                    }
                                    onChange={(event) => {
                                        checkBoxAll(event);
                                    }}
                                />
                            </th>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={4} className="text-end me-5"></td>
                            <td>${calculateTotal()}</td>
                            <td></td>
                        </tr>
                    </tfoot>
                </Table>
                <Space h="20px" />
                <Group position="apart">
                    <Button
                        disabled={checkedList.length === 0}
                        variant="outline"
                        color="red"
                        onClick={(event) => {
                            event.preventDefault();
                            deleteCheckedItems();
                        }}
                    >
                        Delete Selected
                    </Button>
                    <Button>Checkout</Button>
                </Group>
            </Container>
        </Container>
    );
}
