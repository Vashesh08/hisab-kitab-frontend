import { useState, useEffect } from "react";
import React from "react";
import Loading from "../Loading";
import { Button, Form, InputNumber,DatePicker } from "antd";
import dayjs from 'dayjs'; // Import Day.js
import { postLossAcct } from "../../api/LossAcct.js";
import { fetchGovindCapStockList, postGovindCapStock } from "../../api/govindCapBook.js";

function GovindCapBookClose({handleOk}){
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [currentDate, setCurrentDate] = useState(dayjs()); // Initialize with Day.js
    const [forceUpdate, setForceUpdate] = useState(0);
  
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

      useEffect(() => {
        (async () => {
          const token = localStorage.getItem("token");
          const GovindCapData =  await fetchGovindCapStockList(1, 1, token, "valid");
          const docs = GovindCapData["data"];    
          if (docs.length > 0){
            const lastEntry = docs[docs.length - 1];
            setCurrentDate(dayjs(lastEntry.date));
          }
          setForceUpdate(1);
        })();
      }, []);    

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

        const allGovindCapMeltingData = await fetchGovindCapStockList(1, Number.MAX_SAFE_INTEGER, token, "valid");
        const totalQty = allGovindCapMeltingData["totalQty"];

        let totalIssueQty = totalQty[0]["capAcctIssue"];
        let totalReceiveQty = totalQty[0]["capAcctReceive"];
        let totalLossPrevQty = totalQty[0]["capAcctLoss"];

        let totalLossQty = Math.round(((totalIssueQty - totalReceiveQty - totalLossPrevQty) * 100) / 100);

        if (totalLossQty > 0){
            const backendData = {
                capAcctDate: dayjs(date, "YYYY-MM-DD"),
                capAcctType: "Receive",
                capAcctReceive: parseFloat(closingWt),
                capAcctLoss: parseFloat(totalLossQty)
            }
            const updatedData = await postGovindCapStock(backendData, token);

            const tomorrow = date.add(1, 'day');

            const backendData2 = {
                capAcctDate: dayjs(tomorrow, "YYYY-MM-DD"),
                capAcctType: "Issue",
                capAcctIssue: parseFloat(closingWt),
            }
            await postGovindCapStock(backendData2, token);

            // console.log("updatedData",updatedData);

            const lossData = {
                    "type": "Govind Cap Account",
                    "date": dayjs(date, "YYYY-MM-DD"),
                    "lossWt": parseFloat(totalLossQty).toFixed(2),
                    "transactionId": updatedData.govindBook_id, 
                    "description": "Govind Cap Acct Loss for " + getFormattedDate(date)
                }
            await postLossAcct(lossData, token);
        }


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
          initialValue={currentDate}
        >
          <DatePicker format="DD MMM, YYYY" disabledDate={disabledDate} />
        </Form.Item>
        
             <Form.Item
        name={["user", "closingWt"]}
        label="Close Weight (gm)"
        rules={[{ type: "number", min: 0, required: true }]}
      >
        <InputNumber/>
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

export default GovindCapBookClose;