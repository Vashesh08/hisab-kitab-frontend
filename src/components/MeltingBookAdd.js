import React, { useState } from "react";
import { postMeltingBook } from "../api/meltingBook.js";
import moment from 'moment'
import Loading from "./Loading.js";
import { Button, Form, Input, InputNumber, Select, DatePicker } from "antd";

function MeltingBookAdd({handleOk}) {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

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
      purity,
      weight,
    } = user;

    const backendData = {
    date: moment(date).format("YYYY-MM-DD"),
    description,
    weight24k: weight,
    purity: purity,
    issue22k: ((weight * purity)  / 91.8).toFixed(3),
    };
    await postMeltingBook(backendData, token);
    // const updated = await postMeltingBook(backendData, token);
    // console.log("Added ",updated);

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
      <Form.Item name={["user", "description"]} label="Description">
        <Input />
      </Form.Item>
      <Form.Item
        name={["user", "weight"]}
        label="Weight (gm)"
        rules={[{ type: "number", min: 0, required: true }]}
      >
        <InputNumber/>
      </Form.Item>

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

export default MeltingBookAdd;
