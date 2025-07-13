import React, { useState, useEffect } from "react";
import dayjs from 'dayjs'; // Import Day.js
import Loading from "./Loading.js";
import { Button, Form, InputNumber, DatePicker } from "antd";
import { postPolishStock } from "../api/polishBook.js";
import { getUtilityData, updateUtility } from "../api/utility.js";
import { postLossAcct } from "../api/LossAcct.js";

function PolishChillClose({handleOk}) {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  // const [currentDate, setCurrentDate] = useState(dayjs()); // Initialize with Day.js
  const currentDate = dayjs(); // Initialize with Day.js
  const [lossWeight, setLossWeight] = useState(0);
  const [chillWeight, setChillWeight] = useState(0);
  // const [forceUpdate, setForceUpdate] = useState(0);

  const getFormattedDate = (date) => {
    const dateEntry = date;
    const curDateEntry = new Date(dateEntry);
    
    const day = curDateEntry.getDate().toString().padStart(2, '0');
    // const month = (curDateEntry.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const month = curDateEntry.toLocaleString('en-US', {month: 'short'})
    const year = curDateEntry.getFullYear().toString().slice(-2); // Get the last two digits of the year          
    const formattedDate = `${day}-${month}-${year}`;

    return formattedDate
  }

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
        const utilityData = await getUtilityData(token);
        const chillWeight = parseFloat(utilityData[0]["polishChill"]).toFixed(2);
        setChillWeight(chillWeight);
    })();
  }, []);

  const onChangeWt = (value) => {
    setLossWeight((chillWeight - parseFloat(value)).toFixed(2));
  };

  const onFinish = async ({ user }) => {
    const token = localStorage.getItem("token");

    setIsLoading(true);
    // console.log(user);
    
    const {
      date,
      melting
    } = user;
    
    const utilityData = await getUtilityData(token);
    
    // console.log("Vashesh",polishChatkaLoss, polishFineLoss, polishLoss);
    const data = {
      date: dayjs(date, "YYYY-MM-DD"),
      goods: "Chill Melting and Loss",
      // fine: parseFloat(polishFineLoss).toFixed(2),
      // chatka: parseFloat(polishChatkaLoss).toFixed(2),
      melting: parseFloat(melting).toFixed(2),
      lossWeight: parseFloat(lossWeight).toFixed(2) 
    }
    const updatedData = await postPolishStock(data, token);
    // console.log(updatedData)

    if ((parseFloat(lossWeight)) > 0){
      const lossData = {
        "type": "Polish",
        "date": date,
        "lossWt": parseFloat(lossWeight).toFixed(2),
        "transactionId": updatedData.polish_id, 
        "description": " Polish Chill Melting and Loss for " + getFormattedDate(date)
      }
      await postLossAcct(lossData, token)
    }

    const utilityBackendData = {
      _id: utilityData[0]["_id"],
      polishChill: 0
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
      // key={forceUpdate}
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

          <Form.Item
          name={["user", "chill"]}
          label="Chill Balance"
          >
            {chillWeight}
          </Form.Item>

      <Form.Item
        name={["user", "melting"]}
        label="Melting Wt (gm)"
        rules={[{ type: "number", min: 0, required: true}]}
      >
        <InputNumber
        onChange={onChangeWt}
      />
      </Form.Item>

        <Form.Item
        name={["user", "lossWeight"]}
        label="Loss"
        >
        {lossWeight}
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

export default PolishChillClose;
