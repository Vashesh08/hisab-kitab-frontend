import { useState } from "react";
import React from "react";
import dayjs from 'dayjs'; // Import Day.js
import Loading from "./Loading.js";
import { Button, Form, InputNumber, DatePicker } from "antd";
import { postPolishStock } from "../api/polishBook.js";
import { getUtilityData, updateUtility } from "../api/utility.js";
import { postLossAcct } from "../api/LossAcct.js";

function PolishClose({handleOk}) {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  // const [currentDate, setCurrentDate] = useState(dayjs()); // Initialize with Day.js
  const currentDate = dayjs(); // Initialize with Day.js
  // const [lastDate, setLastDate] = useState(dayjs());
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

  // useEffect(() => {
  //   (async () => {
  //     const token = localStorage.getItem("token");
  //     const docs = await fetchPolishList(1,100000000, token);
  //     const lastEntry = docs[docs.length - 1];
  //     setLastDate(dayjs(lastEntry.date));
  //     form.setFieldsValue({ user: { date: dayjs(lastEntry.date) } });
  //     console.log(lastEntry, lastDate)
  //     setForceUpdate(prev => prev + 1);
  //   })();
  // }, [form]);

  const onFinish = async ({ user }) => {
    const token = localStorage.getItem("token");

    setIsLoading(true);
    // console.log(user);
    
    const {
      date,
      chill
    } = user;
    
    const utilityData = await getUtilityData(token);
    const polishChatkaLoss = utilityData[0]["polishChatkaLoss"]
    const polishLoss = utilityData[0]["polishLoss"]
    const polishFineLoss = utilityData[0]["polishFineLoss"]
    
    console.log("Vashesh",polishChatkaLoss, polishFineLoss, polishLoss);
    const data = {
      date: dayjs(date, "YYYY-MM-DD"),
      goods: "Acct Closing For Day " + getFormattedDate(dayjs(date, "YYYY-MM-DD")),
      // fine: parseFloat(polishFineLoss).toFixed(2),
      // chatka: parseFloat(polishChatkaLoss).toFixed(2),
      chill: parseFloat(chill).toFixed(2) 
    }
    const updatedData = await postPolishStock(data, token);
    // console.log(updatedData)

    if ((parseFloat(polishChatkaLoss)) > 0){
      const lossData = {
        "type": "Polish",
        "date": date,
        "lossWt": parseFloat(polishChatkaLoss).toFixed(2),
        "transactionId": updatedData.polish_id, 
        "description": " Polish Chatka Loss for " + getFormattedDate(date)
      }
      await postLossAcct(lossData, token)
    }

    if ((parseFloat(polishFineLoss)) > 0){
      const lossData = {
        "type": "Polish",
        "date": date,
        "lossWt": parseFloat(polishFineLoss).toFixed(2),
        "transactionId": updatedData.polish_id, 
        "description": " Polish Fine Loss for " + getFormattedDate(date)
      }
      await postLossAcct(lossData, token)
    }
    console.log(((parseFloat(polishLoss).toFixed(2) - parseFloat(chill).toFixed(2)).toFixed(2)));

    if (((parseFloat(polishLoss).toFixed(2) - parseFloat(chill).toFixed(2)).toFixed(2)) > 0){
      const lossData = {
        "type": "Polish",
        "date": date,
        "lossWt": ((parseFloat(polishLoss).toFixed(2) - parseFloat(chill).toFixed(2)).toFixed(2)),
        "transactionId": updatedData.polish_id, 
        "description": " Polish Chill Loss for " + getFormattedDate(date)
      }
      await postLossAcct(lossData, token)
    }

    const utilityBackendData = {
      _id: utilityData[0]["_id"],
      polishChatkaLoss: 0,
      polishLoss: 0,
      polishFineLoss: 0
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
        label="Chill Wt (gm)"
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

export default PolishClose;
