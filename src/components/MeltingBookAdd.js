import React, { useState } from "react";
import { postMeltingBook } from "../api/meltingBook.js";
import moment from 'moment'
import Loading from "./Loading.js";
import { Button, Form, Input, InputNumber, Select, DatePicker, AutoComplete } from "antd";

function MeltingBookAdd({handleOk}) {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const purityOptions = [
    {
      label: "91.80",
      value: "91.80",
    },
    {
      label: "99.50",
      value: "99.50",
    },
    {
      label: "100",
      value: "100",
    },
  ];

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

  // const onSelect = (data) => {
  //   console.log('onSelect', data);
  // };

  // const onChange = (data) => {
  //   console.log('onSelect', data, typeof data);
  // };


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
      purity: originalPurity,
      weight: originalWt,
    } = user;

    const weight = originalWt.toFixed(2);
    const purity = parseFloat(originalPurity).toFixed(2);
    let number = (weight * purity)  / 91.8;
    let roundedNumber = Math.round(number * 100) / 100;

    const backendData = {
    date: moment(date).format("YYYY-MM-DD"),
    description,
    weight24k: weight,
    purity: purity,
    issue22k: (roundedNumber).toFixed(2),
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

      {/* <Form.Item
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
      </Form.Item> */}

      <Form.Item
        name={["user", "purity"]}
        label="Purity"
        rules={[
          {           
            validator: (_, value) => {
              const intValue = parseInt(value, 10);
              if (isNaN(intValue)) {
                return Promise.reject(new Error("Please enter a valid number."));
              } else if (intValue < 0) {
                return Promise.reject(new Error("Value must be greater than or equal to 0."));
              }
              return Promise.resolve();
            },
            required: true 
          }
        ]}
        transform={(value) => (value ? parseInt(value, 10) : NaN)} // Convert string to number
      >
        <AutoComplete
          options={purityOptions}
          // onSelect={onSelect}
          // onChange={onChange}            
        >
        </AutoComplete>
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

export default MeltingBookAdd;
