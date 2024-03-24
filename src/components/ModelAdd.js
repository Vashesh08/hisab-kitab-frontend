import { useState } from "react";
import React from "react";
import { postMasterStock } from "../api/masterStock.js";
import moment from 'moment'
import Loading from "./Loading.js";
import { Button, Form, Input, InputNumber, Select, DatePicker } from "antd";

function ModelAdd({handleOk}) {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [transactionType, setTransactionType] = useState("issue");

  const validateMessages = {
    // eslint-disable-next-line
    required: "${label} is required!",
    types: {
      // eslint-disable-next-line
      email: "${label} is not a valid email!",
      // eslint-disable-next-line
      number: "${label} is not a valid number!",
    },
    number: {
      // eslint-disable-next-line
      range: "${label} must be between ${min} and ${max}",
    },
  };

  const handleChange = (value) => {
    // console.log(`selected ${value}`);
  };

  const handleTransactionType = (value) => {
    // console.log(`selected transaction type ${value}`);
    setTransactionType(value);
  }

  const onDateChange = (date, dateString) => {
    // console.log(date, dateString);
  };
  const disabledDate = current => {
    // Disable dates after the current date
    return current && current > moment().endOf('day');
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

    setIsLoading(true);
    // console.log(user);
    
    const {
      date,
      description,
      goodsType,
      issueReceive,
      issuerName,
      receiverName,
      purity,
      weight,
    } = user;

    if (issueReceive === "issue"){
      const backendData = {
        type: "issues",
        date: moment(date).format("YYYY-MM-DD"),
        category: goodsType,
        description,
        weight,
        issuer: issuerName,
        receiver: receiverName,
        issue22k: weight
      };
      await postMasterStock(backendData, token);
      // const updated = await postMasterStock(backendData, token);
      // console.log("Added ",updated);
    }
    else{
      const backendData = {
        type: "issues",
        date: moment(date).format("YYYY-MM-DD"),
        category: goodsType,
        description,
        weight,
        issuer: issuerName,
        receiver: issueReceive,
        purity,
        receive22k: ((weight * purity)  / 91.8).toFixed(3)
      };
      await postMasterStock(backendData, token);
      // const updated = await postMasterStock(backendData, token);
      // console.log("Added ",updated);
    }

    form.resetFields();
    setIsLoading(false);
    handleOk();

  };

  if (isLoading){
    return <Loading />
  }

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
        initialValue="issue"
      >
        <Select
          onChange={handleTransactionType}
          options={[
            { value: "issue", label: "Issue" },
            { value: "receive", label: "Receive" },
          ]}
        />
      </Form.Item>
      <Form.Item
        name={["user", "date"]}
        label="Date"
        rules={[
          {
            type: "Date",
          },
        ]}
      >
        <DatePicker format="DD MMM, YYYY" onChange={onDateChange} disabledDate={disabledDate} />
      </Form.Item>
      <Form.Item name={["user", "goodsType"]} label="Category">
        <Input />
      </Form.Item>
      <Form.Item name={["user", "description"]} label="Description">
        <Input />
      </Form.Item>
      <Form.Item
        name={["user", "weight"]}
        label="Weight (gm)"
        rules={[{ type: "number", min: 0, required: true }]}
      >
        <InputNumber
        // precision={4}
        // step={0.01}
      />
      </Form.Item>

        { transactionType === "receive" ? (
      <Form.Item
        name={["user", "purity"]}
        label="Purity"
        initialValue="99.5"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          onChange={handleChange}
          options={[
            { value: "99.5", label: "99.5" },
            { value: "100", label: "100" },
            { value: "91.80", label: "91.80" },
          ]}
        />
      </Form.Item>
        ):(
          <div></div>
        )
        }
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
