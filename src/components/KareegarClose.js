import { useState } from "react";
import React from "react";
import Loading from "./Loading";
import { Button, Form, InputNumber } from "antd";
import { getKareegarData, updateKareegarBalance } from "../api/kareegarDetail.js";
import { postKareegarBook } from "../api/kareegarBook.js";
import dayjs from 'dayjs'; // Import Day.js
import { postLossAcct } from "../api/LossAcct.js";

function KareegarClose({ kareegarId, handleOk}){
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [currentDate, setCurrentDate] = useState(dayjs()); // Initialize with Day.js

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
          integer: "${label} is not a valid integer"
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
        
        setIsLoading(true);
        const token = localStorage.getItem("token");

        const {
            closingWt
        } = user;

        const data =  await getKareegarData(token);
        const kareegarData = data.find(item => item._id === kareegarId);
        let balance = parseFloat(kareegarData.balance)
        let boxWt = parseFloat(kareegarData.boxWt)
        let loss = (parseFloat(balance) + parseFloat(boxWt) - parseFloat(closingWt) ).toFixed(2)
        const kareegarBalanceData = {
          '_id': kareegarId,
          "balance": (balance - parseFloat(loss)).toFixed(2)
        }
        await updateKareegarBalance(kareegarBalanceData, token);

        const backendData = {
          kareegar_id: kareegarId,
          type: "Receive",
          date: currentDate,
          description: `Closing Acc - Loss for ${getFormattedDate(currentDate)}`,
          recv_wt: (parseFloat(closingWt) - parseFloat(boxWt)).toFixed(2),
          loss_wt: (parseFloat(balance) + parseFloat(boxWt) - parseFloat(closingWt) ).toFixed(2),
          beads_recv_wt: (parseFloat(kareegarData.beads_balance).toFixed(2))
        }

        const updatedData = await postKareegarBook(backendData, token);
        console.log("updatedData",updatedData);

        const lossData = {
          "type": "Kareegar",
          "date": dayjs(),
          "lossWt": (parseFloat(balance) + parseFloat(boxWt) - parseFloat(closingWt) ).toFixed(2),
          "transactionId": updatedData.kareegarBook_id, 
          "description": kareegarData.name + " Loss for " + getFormattedDate(dayjs())
        }
        await postLossAcct(lossData, token)

        const today = dayjs();
        const tomorrow = today.add(1, 'day');

        const backendData2 = {
          kareegar_id: kareegarId,
          type: "Issue",
          date: tomorrow,
          description: `Opening Balance - ${getFormattedDate(currentDate)}`,
          issue_wt: (parseFloat(closingWt) - parseFloat(boxWt)).toFixed(2),
          beads_issue_wt: (parseFloat(kareegarData.beads_balance).toFixed(2))
        }

        await postKareegarBook(backendData2, token);


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
        name={["user", "closingWt"]}
        label="Close Weight (gm)"
        rules={[{ type: "number", min: 0, required: true }]}
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

export default KareegarClose;