import { useState } from "react";
import React from "react";
import Loading from "./Loading";
import { Button, Form, InputNumber,DatePicker } from "antd";
import { getKareegarData } from "../api/kareegarDetail.js";
import { postKareegarBook } from "../api/kareegarBook.js";
import dayjs from 'dayjs'; // Import Day.js
import { postLossAcct } from "../api/LossAcct.js";
import { fetchKareegarBookList } from "../api/kareegarBook.js";

function KareegarClose({ kareegarId, handleOk}){
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [currentDate] = useState(dayjs()); // Initialize with Day.js

    const disabledDate = (current) => {
      // Disable dates after the current date
      return current && dayjs(current).isAfter(dayjs().endOf('day'));
    };
  
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
            date,
            closingWt
        } = user;


        const kareegarDetails =  await getKareegarData(1,Number.MAX_SAFE_INTEGER, token);
        const kareegarUtilityData = kareegarDetails["data"];
        const thiskareegarData = kareegarUtilityData.find(item => item._id === kareegarId);

        const allKareegarData = await fetchKareegarBookList(1,Number.MAX_SAFE_INTEGER, kareegarId, token, "valid", thiskareegarData.kareegarCutoffStartDate.length);
        const totalQty = allKareegarData["totalQty"];

        let currentKareegarIssueQty = 0.0;
        let currentKareegarRecvQty = 0.0;
        let currentKareegarLossQty = 0.0;
        let currentKareegarBeadsIssueQty = 0.0;
        let currentKareegarBeadsRecvQty = 0.0;
        if (totalQty[0]["issue_wt"] === null){
          currentKareegarIssueQty = Number(0).toFixed(2);
        }
        else{
          currentKareegarIssueQty = totalQty[0]["issue_wt"].toFixed(2);
        }

        if (totalQty[0]["recv_wt"] === null){
          currentKareegarRecvQty = Number(0).toFixed(2);
        }
        else{
          currentKareegarRecvQty = totalQty[0]["recv_wt"].toFixed(2);
        }

        if (totalQty[0]["loss_wt"] === null){
          currentKareegarLossQty = Number(0).toFixed(2);
        }
        else{
          currentKareegarLossQty = totalQty[0]["loss_wt"].toFixed(2);
        }
        
        if (totalQty[0]["beads_issue_wt"] === null){
          currentKareegarBeadsIssueQty = Number(0).toFixed(2);
        }
        else{
          currentKareegarBeadsIssueQty = totalQty[0]["beads_issue_wt"].toFixed(2);
        }
        
        if (totalQty[0]["beads_recv_wt"] === null){
          currentKareegarBeadsRecvQty = Number(0).toFixed(2);
        }
        else{
          currentKareegarBeadsRecvQty = totalQty[0]["beads_recv_wt"].toFixed(2);  
        }

        let balance = parseFloat(currentKareegarIssueQty - currentKareegarRecvQty - currentKareegarLossQty).toFixed(2);
        let beads_balance = parseFloat(currentKareegarBeadsIssueQty - currentKareegarBeadsRecvQty).toFixed(2);

        const allKareegarDetails = await getKareegarData(1, Number.MAX_SAFE_INTEGER, token);
        const data = allKareegarDetails["data"];
        const kareegarData = data.find(item => item._id === kareegarId);
        let boxWt = parseFloat(kareegarData.boxWt);

        const backendData = {
          kareegar_id: kareegarId,
          type: "Receive",
          date: dayjs(date, "YYYY-MM-DD"),
          // date: currentDate,
          description: `Closing Acc - Loss for ${getFormattedDate(currentDate)}`,
          recv_wt: (parseFloat(closingWt) - parseFloat(boxWt)).toFixed(2),
          loss_wt: (parseFloat(balance) + parseFloat(boxWt) - parseFloat(closingWt)).toFixed(2),
          beads_recv_wt: (parseFloat(beads_balance).toFixed(2))
        }
        const updatedData = await postKareegarBook(backendData, token);

        const lossData = {
          "type": "Kareegar",
          "date": date,
          "lossWt": (parseFloat(balance) + parseFloat(boxWt) - parseFloat(closingWt)).toFixed(2),
          "transactionId": updatedData.kareegarBook_id, 
          "description": kareegarData.name + " Loss for " + getFormattedDate(date)
        }
        await postLossAcct(lossData, token)

        const tomorrow = date.add(1, 'day');

        const backendData2 = {
          kareegar_id: kareegarId,
          type: "Issue",
          date: tomorrow,
          description: `Opening Balance - ${getFormattedDate(tomorrow)}`,
          issue_wt: (parseFloat(closingWt) - parseFloat(boxWt)).toFixed(2),
          beads_issue_wt: (parseFloat(beads_balance).toFixed(2))
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