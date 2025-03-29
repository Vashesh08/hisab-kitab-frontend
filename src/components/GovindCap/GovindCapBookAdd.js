import { useState, useEffect } from "react";
import React from "react";
import dayjs from 'dayjs'; // Import Day.js
import Loading from "../Loading.js";
import { Button, Form, Input, InputNumber, Select, DatePicker } from "antd";
import { fetchGovindCapStockList, postGovindCapStock } from "../../api/govindCapBook.js";

function GovindCapBookAdd({handleOk}) {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [transactionType, setTransactionType] = useState("Issue");
  const [lastDate, setLastDate] = useState(dayjs());
  const [forceUpdate, setForceUpdate] = useState(0);
  
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      const docs =  await fetchGovindCapStockList(1,100000000, token);
      if (docs.length > 0){
        const lastEntry = docs[docs.length - 1];
        setLastDate(dayjs(lastEntry.date));
        if (lastEntry.type === "Issue" || lastEntry.type === "Receive" || lastEntry.type === "Issue & Receive"){
          setTransactionType(lastEntry.type);
        }
        // console.log(lastEntry, lastDate)
      }
      setForceUpdate(1);
    })();
  }, []);

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

  const handleTransactionType = (value) => {
    // console.log(`selected transaction type ${value}`);
    setTransactionType(value);
  }

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
    const token = localStorage.getItem("token");

    setIsLoading(true);
    // console.log(user);
    
    const {
      date,
      description,
      issueReceive,
      issue_wt,
      recv_wt,
    } = user;

    if (issueReceive === "Issue"){
      const backendData = {
        capAcctType: "Issue",
        capAcctDate: dayjs(date, "YYYY-MM-DD"),
        capAcctDescription: description,
        capAcctIssue: issue_wt,
        is_receiver_updated: false,
      };
      await postGovindCapStock(backendData, token);
    }
    else if (issueReceive === "Receive"){
      const backendData = {
        capAcctType: "Receive",
        capAcctDate: dayjs(date, "YYYY-MM-DD"),
        capAcctDescription: description,
        capAcctReceive: recv_wt,
        is_receiver_updated: false,
      };
      await postGovindCapStock(backendData, token);
    }
    else{
      if (parseFloat(issue_wt) > parseFloat(recv_wt)){
      const backendData = {
        capAcctType: "Issue & Receive",
        capAcctDate: dayjs(date, "YYYY-MM-DD"),
        capAcctDescription: description,
        capAcctIssue: issue_wt,
        capAcctReceive: recv_wt,
        is_receiver_updated: false,
      };
      await postGovindCapStock(backendData, token);
    }
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
      key={forceUpdate}
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
        initialValue={lastDate}
      >
        <DatePicker format="DD MMM, YYYY" disabledDate={disabledDate} />
      </Form.Item>
      

      <Form.Item
        name={["user", "issueReceive"]}
        label="Issue / Receive"
        rules={[
          {
            required: true,
          },
        ]}
        initialValue={transactionType}
      >
        <Select
          onChange={handleTransactionType}
          options={[
            { value: "Issue", label: "Issue" },
            { value: "Receive", label: "Receive" },
            { value: "IssueReceive", label: "Issue & Receive" },
          ]}
        />
      </Form.Item>

      <Form.Item name={["user", "description"]} label="Description">
        <Input />
      </Form.Item>

        { transactionType === "Receive" ? (
      
      <>
      
      <Form.Item
        name={["user", "recv_wt"]}
        label="Receive Weight (gm)"
        rules={[{ type: "number", min: 0, required: true }]}
      >
        <InputNumber/>
      </Form.Item>
      </>
      
        ):transactionType === "Issue" ?(
          <>
          <Form.Item
            name={["user", "issue_wt"]}
            label="Issue Weight (gm)"
            rules={[{ type: "number", min: 0, required: true }]}
          >
            <InputNumber/>
          </Form.Item>
        </>
        ) : (
          <>
        <Form.Item
            name={["user", "issue_wt"]}
            label="Issue Weight (gm)"
            rules={[{ type: "number", min: 0, required: true }]}
          >
            <InputNumber/>
          </Form.Item>
          <Form.Item
          name={["user", "recv_wt"]}
          label="Receive Weight (gm)"
          rules={[{ type: "number", min: 0, required: true }]}
        >
          <InputNumber/>
        </Form.Item>
  
        </>
      )
        }
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

export default GovindCapBookAdd;