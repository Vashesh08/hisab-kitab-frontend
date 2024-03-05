import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import { postMasterStock } from "../api/masterStock.js";
import moment from 'moment'

import { Button, Form, Input, InputNumber, Select, DatePicker } from "antd";
function ModelAdd({handleOk}) {
  const [form] = Form.useForm();

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

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  const onDateChange = (date, dateString) => {
    console.log(date, dateString);
  };

  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
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
      date: moment(user.date).format("YYYY-MM-DD"),
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

    form.resetFields();

  };

  return (
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
        <Button type="primary" style={{ background: "green", borderColor: "yellow" }} htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}

export default ModelAdd;
