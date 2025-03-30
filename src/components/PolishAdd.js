import { useState, useEffect } from "react";
import React from "react";
import dayjs from 'dayjs'; // Import Day.js
import Loading from "./Loading.js";
import { Button, Form, Input, InputNumber, DatePicker } from "antd";
import { fetchPolishList, postPolishStock } from "../api/polishBook.js";
import { getUtilityData, updateUtility } from "../api/utility.js";

function PolishAdd({handleOk}) {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  // const [currentDate, setCurrentDate] = useState(dayjs()); // Initialize with Day.js
  const [lastDate, setLastDate] = useState(dayjs());
  const [forceUpdate, setForceUpdate] = useState(0);
  
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

    useEffect(() => {
      (async () => {
        const token = localStorage.getItem("token");
        const docs = await fetchPolishList(1, 100000000, token);
        // console.log(docs)
        if (docs.length > 0){
          const lastEntry = docs[docs.length - 1];
          setLastDate(dayjs(lastEntry.date));
          // console.log(lastEntry, lastDate)
        }
        setForceUpdate(1);
      })();
    }, []);


  const onFinish = async ({ user }) => {
    const token = localStorage.getItem("token");

    setIsLoading(true);
    // console.log(user);
    
    const {
      date,
      goods,
      fine,
      chatka,
      issueWeight,
      recvWeight
    } = user;

    let fineWt = 0;
    let chatkaWt = 0;
    console.log(fine,  isNaN(fine), !isNaN(fine))
    console.log(chatka,  isNaN(chatka), !isNaN(chatka))
    if (!isNaN(fine)){
      fineWt = parseFloat(fine).toFixed(2);
    }
    if (!isNaN(chatka)){
      chatkaWt = parseFloat(chatka).toFixed(2);
    }
    const issueWt = parseFloat(issueWeight).toFixed(2);
    const recvWt = parseFloat(recvWeight).toFixed(2);
    const lossWt = parseFloat(issueWt - recvWt).toFixed(2);

    const data = {
        date: dayjs(date, "YYYY-MM-DD"),
        goods: goods,
        fine: fineWt,
        chatka: chatkaWt,
        issueWeight: issueWt,
        recvWeight: recvWt,
        lossWeight: lossWt
    }
    await postPolishStock(data, token);

    const utitlityData = await getUtilityData(token);
    const utilityBackendData = {
      _id: utitlityData[0]["_id"],
      polishChatkaLoss: parseFloat(utitlityData[0]["polishChatkaLoss"]) + parseFloat(chatkaWt),
      polishFineLoss: parseFloat(utitlityData[0]["polishFineLoss"]) + parseFloat(fineWt),
      polishLoss: parseFloat(utitlityData[0]["polishLoss"]) + parseFloat(lossWt),
    }
    await updateUtility(utilityBackendData, token);

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

      <Form.Item name={["user", "goods"]} label="Goods">
        <Input />
      </Form.Item>

      <Form.Item
        name={["user", "fine"]}
        label="Fine (gm)"
        rules={[{ type: "number", min: 0}]}
      >
        <InputNumber
        // precision={4}
        // step={0.01}
      />
      </Form.Item>

      <Form.Item
        name={["user", "chatka"]}
        label="Chatka (gm)"
        rules={[{ type: "number", min: 0}]}
      >
        <InputNumber
        // precision={4}
        // step={0.01}
      />
      </Form.Item>

      <Form.Item
        name={["user", "issueWeight"]}
        label="Issue Wt (gm)"
        rules={[{ type: "number", min: 0, required: true}]}
      >
        <InputNumber
        // precision={4}
        // step={0.01}
      />
      </Form.Item>
      <Form.Item
        name={["user", "recvWeight"]}
        label="Receive Wt (gm)"
        rules={[{ type: "number", min: 0, required: true}]}
      >
        <InputNumber
        // precision={4}
        // step={0.01}
      />
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

export default PolishAdd;
