import { useState } from "react";
import React from "react";
import Loading from "./Loading";
import { Button, Form, Input, InputNumber, Select, DatePicker } from "antd";
import dayjs from 'dayjs'; // Import Day.js
import { postKareegarData } from "../api/kareegarDetail";

function AddKareegar({ handleOk}){
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [currentDate, setCurrentDate] = useState(dayjs()); // Initialize with Day.js

    const validateMessages = {
        // eslint-disable-next-line
        required: "${label} is required!",
        types: {
          // eslint-disable-next-line
          email: "${label} is not a valid email!",
          // eslint-disable-next-line
          number: "${label} is not a valid number!",
          integer: "${label} is not a valid integer"
        },
        number: {
          // eslint-disable-next-line
          range: "${label} must be between ${min} and ${max}",
        },
      };

      const disabledDate = (current) => {
        // Disable dates after the current date
        return current && dayjs(current).isAfter(dayjs().endOf('day'));
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
        
        setIsLoading(true);
        const token = localStorage.getItem("token");
        
        const {
            date,
            name,
            category
        } = user;

        const backendData = {
            date: date,
            name: name,
            category: category,
            kareegarCutoffDate: currentDate,
            is_hidden_flag: false
            }

        await postKareegarData(backendData,token);

    form.resetFields();
    setIsLoading(false);
    handleOk();
    }

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
        initialValue={currentDate}
      >
        <DatePicker format="DD MMM, YYYY" disabledDate={disabledDate} />
      </Form.Item>
      <Form.Item name={["user", "name"]} label="Name"
      rules={[
        {
          required: true,
        },
      ]}
      >
        <Input />
      </Form.Item>

      <Form.Item name={["user", "category"]} label="Category"
      rules={[
        {
          required: true,
        },
      ]}
      >
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

export default AddKareegar;