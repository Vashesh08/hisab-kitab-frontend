/* eslint-disable no-template-curly-in-string */
import React, { useState } from "react";
import {
  Divider,
  Table,
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Modal,
} from "antd";
import { getMasterStock, postMasterStock } from "../api/allapi.js";

const MasterStock = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [dataAe, setDataAe] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Weight",
      dataIndex: "weight",
    },
    {
      title: "Purity",
      dataIndex: "purity",
    },
    {
      title: "Issue 22k",
      dataIndex: "issue22k",
    },
    {
      title: "Receive 22k",
      dataIndex: "receive22k",
    },
    {
      title: "Issuer",
      dataIndex: "issuer",
    },
    {
      title: "Receiver",
      dataIndex: "receiver",
    },
  ];
  const data = [
    {
      date: "03/02/2024",
      description: "agag",
      category: "gaga",
      weight: "100",
      purity: "99.5",
      issue22k: "gaga",
      receive22k: "gagag",
      issuer: "gagag",
      receiver: "iuioga",
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      name: record.name,
    }),
  };

  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  const onDateChange = (date, dateString) => {
    console.log(date, dateString);
  };

  const validateMessages = {
    required: "${label} is required!",
    types: {
      email: "${label} is not a valid email!",
      number: "${label} is not a valid number!",
    },
    number: {
      range: "${label} must be between ${min} and ${max}",
    },
  };

  const onFinish = async ({ user }) => {
    const token = localStorage.getItem("token");

    console.log(user);
    const {
      date,
      description,
      goodsType,
      issueReceive,
      issuerName,
      purity,
      weight,
    } = user;
    const backendData = {
      type: "issues",
      // date,
      category: "category",
      description,
      weight,
      issuer: issuerName,
      receiver: issueReceive,
      purity,
    };

    const updated = await postMasterStock(backendData, token);
    console.log(updated);
    handleOk();
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button type="primary" onClick={showModal}>
          Add Item
        </Button>
        <Button type="primary">Delete</Button>
      </div>
      <Modal
        title="Add Item"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          {...layout}
          name="nest-messages"
          onFinish={onFinish}
          style={{
            maxWidth: 600,
          }}
          validateMessages={validateMessages}
        >
          <Form.Item
            name={["user", "issueReceive"]}
            label="Issue / Receive"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              defaultValue={"Issue"}
              onChange={handleChange}
              options={[
                { value: "issue", label: "Issue" },
                { value: "receive", label: "Receive" },
              ]}
            />
          </Form.Item>
          <Form.Item
            name={["user", "date"]}
            label="Date (DD/MM/YYYY)"
            rules={[
              {
                type: "Date",
              },
            ]}
          >
            <DatePicker onChange={onDateChange} />
          </Form.Item>
          <Form.Item name={["user", "goodsType"]} label="Goods Type">
            <Input />
          </Form.Item>
          <Form.Item name={["user", "description"]} label="Description">
            <Input />
          </Form.Item>
          <Form.Item
            name={["user", "weight"]}
            label="Weight"
            rules={[{ type: "number", min: 0, required: true }]}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            name={["user", "purity"]}
            label="Purity"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              defaultValue={"99.5"}
              onChange={handleChange}
              options={[
                { value: "99.5", label: "99.5" },
                { value: "100", label: "100" },
              ]}
            />
          </Form.Item>
          <Form.Item name={["user", "issuerName"]} label="Issuer Name">
            <Input />
          </Form.Item>
          <Form.Item name={["user", "receiverName"]} label="Receiver Name">
            <Input />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              ...layout.wrapperCol,
              offset: 8,
            }}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Divider />
      <Table
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        columns={columns}
        dataSource={data}
      />
      <Divider />
    </div>
  );
};

export default MasterStock;
