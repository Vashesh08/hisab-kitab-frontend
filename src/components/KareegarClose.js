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
    const [page] = useState(1);
    const [itemsPerPage] = useState(10000000000);
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


        const currentKareegarAllData = await fetchKareegarBookList(page, itemsPerPage, kareegarId, token);
        //console.log("test",currentKareegarAllData);
        let currentKareegarData = [];

        for (let eachEntry in currentKareegarAllData) {
          // console.log(allData[eachEntry].is_editable_flag);
          if (currentKareegarAllData[eachEntry].is_deleted_flag === false && (currentKareegarAllData[eachEntry].is_editable_flag === true)){
            currentKareegarData.push(currentKareegarAllData[eachEntry]);
          }
        }

        let currentKareegarIssueQty = 0.0;
        let currentKareegarRecvQty = 0.0;
        let currentKareegarLossQty = 0.0;
        let currentKareegarBeadsIssueQty = 0.0;
        let currentKareegarBeadsRecvQty = 0.0;
        currentKareegarData.forEach(({ issue_wt, recv_wt, loss_wt, beads_issue_wt, beads_recv_wt}) => {
          // console.log(weight24k, receive22k, issue22k, loss22k);
          if (isNaN(parseFloat(issue_wt))) {
            issue_wt = 0.0; // Set it to zero if it's NaN
          } 
          if (isNaN(parseFloat(recv_wt))) {
            recv_wt = 0.0; // Set it to zero if it's NaN
          } 
          if (isNaN(parseFloat(loss_wt))){
            loss_wt = 0.0; // Set it to zero if it's NaN
          }
          if (isNaN(parseFloat(beads_issue_wt))){
            beads_issue_wt = 0.0;  // Set it to zero if it's NaN
          }
          if (isNaN(parseFloat(beads_recv_wt))){
            beads_recv_wt = 0.0; // Set it to zero if it's NaN
          }
          currentKareegarIssueQty += parseFloat(issue_wt);
          currentKareegarRecvQty += parseFloat(recv_wt);
          currentKareegarLossQty += parseFloat(loss_wt);
          currentKareegarBeadsIssueQty += parseFloat(beads_issue_wt);
          currentKareegarBeadsRecvQty += parseFloat(beads_recv_wt);
        });

        let balance = parseFloat(currentKareegarIssueQty - currentKareegarRecvQty - currentKareegarLossQty).toFixed(2);
        let beads_balance = parseFloat(currentKareegarBeadsIssueQty - currentKareegarBeadsRecvQty).toFixed(2);

        const allKareegarDetails = await getKareegarData(1, 100000000, token);
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