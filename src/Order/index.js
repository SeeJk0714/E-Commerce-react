import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import {
    Container,
    Title,
    Table,
    Group,
    Button,
    Image,
    Space,
    TextInput,
    Divider,
    Grid,
    Text,
    Select,
} from "@mantine/core";
import { useNavigate, Link } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import Header from "../Header";
import { fetchOrders, getOrder, deleteOrder, updateStatus } from "../api/order";

export default function Orders() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [status, setStatus] = useState("");

    const { data: orders = [] } = useQuery({
        queryKey: ["orders"],
        queryFn: fetchOrders,
    });

    const { isLoading } = useQuery({
        queryKey: ["order", orders._id],
        queryFn: () => getOrder(orders._id),
        onSuccess: (data) => {
            setStatus(data.status);
        },
    });

    const updateMutation = useMutation({
        mutationFn: updateStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["orders"],
            });
            notifications.show({
                title: "Order Edited",
                color: "green",
            });
            navigate("/orders");
        },
        onError: (error) => {
            notifications.show({
                title: error.response.data.message,
                color: "red",
            });
        },
    });

    const handleUpdateStatus = async (o, item) => {
        updateMutation.mutate({
            id: o._id,
            data: JSON.stringify({
                status: item,
            }),
        });
    };

    const deleteMutation = useMutation({
        mutationFn: deleteOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["orders"],
            });
            notifications.show({
                title: "Order Deleted",
                color: "green",
            });
        },
    });
    return (
        <>
            <Container size="xl">
                <Header title="My Orders" page="orders" />
                <Space h="35px" />
                <Table>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th colSpan={2}>Products</th>
                            <th>Total Amount</th>
                            <th>Status</th>
                            <th>Payment Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders
                            ? orders.map((o) => {
                                  return (
                                      <tr key={o._id}>
                                          <td>
                                              {o.customerName}
                                              <br />({o.customerEmail})
                                          </td>
                                          <td>
                                              {o.products.map(
                                                  (product, index) => (
                                                      <div key={index}>
                                                          {product.image &&
                                                          product.image !==
                                                              "" ? (
                                                              <>
                                                                  <Image
                                                                      src={
                                                                          "http://localhost:5000/" +
                                                                          product.image
                                                                      }
                                                                      width="60px"
                                                                  />
                                                              </>
                                                          ) : (
                                                              <Image
                                                                  src={
                                                                      "https://www.aachifoods.com/templates/default-new/images/no-prd.jpg"
                                                                  }
                                                                  width="60px"
                                                              />
                                                          )}
                                                      </div>
                                                  )
                                              )}
                                          </td>
                                          <td>
                                              {o.products.map(
                                                  (product, index) => (
                                                      <div key={index}>
                                                          <p>{product.name}</p>
                                                      </div>
                                                  )
                                              )}
                                          </td>
                                          <td>{o.totalPrice}</td>
                                          <td>
                                              <Select
                                                  value={o.status}
                                                  onChange={(item) =>
                                                      handleUpdateStatus(
                                                          o,
                                                          item
                                                      )
                                                  }
                                                  data={[
                                                      {
                                                          value: "Pending",
                                                          label: "Pending",
                                                          disabled: true,
                                                      },
                                                      {
                                                          value: "Paid",
                                                          label: "Paid",
                                                      },
                                                      {
                                                          value: "Failed",
                                                          label: "Failed",
                                                      },
                                                      {
                                                          value: "Shipped",
                                                          label: "Shipped",
                                                      },
                                                      {
                                                          value: "Devlivered",
                                                          label: "Devlivered",
                                                      },
                                                  ]}
                                                  defaultValue={o.status}
                                                  disabled={
                                                      o.status === "Pending"
                                                          ? true
                                                          : false
                                                  }
                                              />
                                          </td>
                                          <td>{o.paid_at}</td>
                                          <td>
                                              {o.status === "Pending" ? (
                                                  <Button
                                                      variant="outline"
                                                      color="red"
                                                      onClick={() => {
                                                          deleteMutation.mutate(
                                                              o._id
                                                          );
                                                      }}
                                                  >
                                                      Delete
                                                  </Button>
                                              ) : (
                                                  ""
                                              )}
                                          </td>
                                      </tr>
                                  );
                              })
                            : null}
                    </tbody>
                    <Button component={Link} to="/">
                        Continue Shopping
                    </Button>
                </Table>
                <Space h="100px" />
            </Container>
        </>
    );
}
