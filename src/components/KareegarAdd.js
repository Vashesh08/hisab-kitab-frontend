import React, { useState } from "react";
import { postKareegarData } from "../api/kareegarDetail.js";
import Loading from "./Loading.js";
import { Button, Form, Input } from "antd";

function KareegarAdd({handleOk}) {
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
      name,
      category,
      description,
    } = user;

    const backendData = {
        name,
        category,
        description,
    };
    await postKareegarData(backendData, token);
    // const updated = await postKareegarData(backendData, token);
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
      <Form.Item name={["user", "name"]} label="Name"
         rules={[{ required: true }]}
        >
        <Input />
      </Form.Item>
      <Form.Item name={["user", "category"]} label="Category">
        <Input />
      </Form.Item>
      <Form.Item name={["user", "description"]} label="Description">
        <Input />
      </Form.Item>
      <Form.Item
        wrapperCol={{
          ...layout.wrapperCol,
          offset: 8,
        }}
      >
        <Button className="bg-[#ABD6DFFF] text-black hover:!bg-gray-800 hover:!text-white active:!bg-gray-800 active:!text-white focus-visible:!outline-none" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}

export default KareegarAdd;
