import { useState } from "react";
import dayjs from 'dayjs'; // Import Day.js
import Loading from "./Loading.js";
import { Button, Form, DatePicker } from "antd";

function PrintModel({handlePrintUpdate}) {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  // const [currentDate, setCurrentDate] = useState(dayjs()); // Initialize with Day.js
  const startDate= dayjs();
  const endDate= dayjs();
  
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

    const {
      startDate,
      endDate
    } = user;

    setIsLoading(true);

    form.resetFields();
    setIsLoading(false);
    console.log("date", startDate,endDate);
    handlePrintUpdate(startDate, endDate);

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
        name={["user", "startDate"]}
        label="Start Date"
        rules={[
          {
            type: "Date",
          },
        ]}
        initialValue={startDate}
      >
        <DatePicker format="DD MMM, YYYY" disabledDate={disabledDate} />
      </Form.Item>
            <Form.Item
        name={["user", "endDate"]}
        label="End Date"
        rules={[
          {
            type: "Date",
          },
        ]}
        initialValue={endDate}
      >
        <DatePicker format="DD MMM, YYYY" disabledDate={disabledDate} />
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

export default PrintModel;
