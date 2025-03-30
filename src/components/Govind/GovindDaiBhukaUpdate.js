import React, { useState, useEffect } from "react";
import { updateGovindBook } from "../../api/govindBook.js";
import dayjs from 'dayjs'; // Import Day.js
import Loading from "../Loading.js";
import { Button, Form, InputNumber, Input, DatePicker } from "antd";
import { updateLossBook } from "../../api/LossAcct.js";


function GovindDaiBhukaUpdate({handleOk, textData}) {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [numberOfDaiItems, setNumberOfDaiItems] = useState(textData.daiBhukaDai.length || 1);
    const [numberOfBhukaItems, setNumberOfBhukaItems] = useState(textData.daiBhukaBhuka.length || 1);
    const [daiItems, setDaiItems] = useState(textData.daiBhukaDai || [0, 0, 0, 0, 0]);
    const [bhukaItems, setBhukaItems] = useState(textData.daiBhukaBhuka || [0, 0, 0, 0, 0]);
    // const [lastDate, setDate] = useState(dayjs());
    const lastDate = dayjs();

    const disabledDate = (current) => {
      // Disable dates after the current date
      return current && dayjs(current).isAfter(dayjs().endOf('day'));
    };
  
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
    
    const layout = {
    labelCol: {
        span: 10,
    },
    wrapperCol: {
        span: 16,
    },
    };

    const handleNumberOfBhukaItems = (value) => {
        if (value >= 1 && value <= 5) {
          setNumberOfBhukaItems(value);
        }
      }
    
    const handleNumberOfDaiItems = (value) => {
        if (value >= 1 && value <= 5) {
          setNumberOfDaiItems(value);
        }
      }    

    
    useEffect(() => {
        setIsLoading(true);
        if (textData.daiBhukaDai.length > 0){
            setNumberOfDaiItems(textData.daiBhukaDai.length);
            setDaiItems(textData.daiBhukaDai);
          }
        if (textData.daiBhukaBhuka.length > 0){
            setNumberOfBhukaItems(textData.daiBhukaBhuka.length);
            setBhukaItems(textData.daiBhukaBhuka);
        }
        setIsLoading(false);
    }, [textData]);


    const renderDaiItems = ()  => {
        return [...Array(numberOfDaiItems)].map((_, index) => (
            <Form.Item
          name={["user", `daiBhukaDaiWeight${index}`]}
          label={`Dai Weight ${index+1}`}
          initialValue={Number(daiItems[index])}
          rules={[{ type: "number", min: 0, required: true }]}
          // onChange={(e) => onChangeWt(e, "weight", index)}
          >
          <InputNumber/>
          </Form.Item>
    ))
    }

    const renderBhukaItems = ()  => {
        return [...Array(numberOfBhukaItems)].map((_, index) => (
            <Form.Item
          name={["user", `daiBhukaBhukaWeight${index}`]}
          label={`Bhuka Weight ${index+1}`}
          initialValue={Number(bhukaItems[index])}
          rules={[{  type: "number", min: 0,
          //   onChange={(e) => onChangeWt(e, "weight", index)}
          validator: (_, value) => 
          (isNaN(value) || value >= 0) 
          ? Promise.resolve()
          : Promise.reject(new Error("Item is not a valid number!")),
            }
            ]}
          >
          <InputNumber/>
          </Form.Item>
    ))
    }

    const onFinish = async ({ user }) => {
        const token = localStorage.getItem("token");
    
        setIsLoading(true);
        // console.log(user);
        
        const {
          daiBhukaDate,
          daiBhukaDescription,
        } = user;

        
        const daiBhukaDaiWeightKeys = [...Array(numberOfDaiItems)].map((_, index) => `daiBhukaDaiWeight${index}`);
        const daiBhukaDaiWeightValues = daiBhukaDaiWeightKeys.map((key) => user[key]);

        const daiBhukaBhukaWeightKeys = [...Array(numberOfBhukaItems)].map((_, index) => `daiBhukaBhukaWeight${index}`);
        const daiBhukaBhukaWeightValues = daiBhukaBhukaWeightKeys.map((key) => user[key]);

        let totalIssueQty = 0;
        for (let index = 0; index < textData.machineIssue.length; index++) {
          totalIssueQty += parseFloat(textData.machineIssue[index]);
        }
        
        let totalReceiveQty = 0;
        let totalLossQty = 0;
        for (let index = 0; index < numberOfDaiItems; index++) {
          totalReceiveQty += parseFloat(daiBhukaDaiWeightValues[index]);
        }
        for (let index = 0; index < numberOfBhukaItems; index++) {
          totalReceiveQty += isNaN(parseFloat(daiBhukaBhukaWeightValues[index])) ? 0 : parseFloat(daiBhukaBhukaWeightValues[index]);
        }
        totalLossQty += totalIssueQty - totalReceiveQty;
        
        console.log(totalLossQty,totalIssueQty, totalReceiveQty);
        if (totalLossQty >= 0){
          const backendData = {
            _id: textData._id,
            daiBhukaDate: daiBhukaDate,
            daiBhukaDescription: daiBhukaDescription,
            daiBhukaDai: daiBhukaDaiWeightValues,
            daiBhukaBhuka: daiBhukaBhukaWeightValues,
            machineReceive: totalReceiveQty.toFixed(2),
            machineLoss: totalLossQty.toFixed(2),
          }

          await updateGovindBook(backendData, token);
          
          const lossData = {
            "type": "Govind Machine",
            date: lastDate,
            "transactionId": textData._id,
            "lossWt": totalLossQty.toFixed(2),
            "description": "Govind Machine Loss"
          }

          await updateLossBook(lossData, token);
          
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
        form={form}
        {...layout}
        name="nest-messages"
        onFinish={onFinish}
        style={{
        maxWidth: 600,
        }}
        validateMessages={validateMessages}
    >

          <Form.Item
            name={["user", "daiBhukaDate"]}
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

          <Form.Item name={["user", "daiBhukaDescription"]} label="Description" initialValue={textData.daiBhukaDescription || ""}>
            <Input/>
          </Form.Item>

        <Form.Item
          name={["user", "daiItems"]}
          label="Number of Dai Items"
          rules={[
            { type: "number", min: 1, max: 5, required: true, step:1 }
          ]}
          initialValue={numberOfDaiItems}
        >
        <InputNumber
          onChange={handleNumberOfDaiItems}
        />
      </Form.Item>
          {renderDaiItems()}
          

        <Form.Item
          name={["user", "daiBhukaItems"]}
          label="Number of Bhuka Items"
          rules={[
            { type: "number", min: 1, max: 5, step:1 }
          ]}
          initialValue={numberOfBhukaItems}
        >
        <InputNumber
          onChange={handleNumberOfBhukaItems}
        />
      </Form.Item>

          {renderBhukaItems()}
          
          
        <Form.Item
        wrapperCol={{
            ...layout.wrapperCol,
            offset: 10,
        }}
        >
        <Button className="bg-[#ABD6DFFF] text-black hover:!bg-gray-800 hover:!text-white active:!bg-gray-800 active:!text-white focus-visible:!outline-none" htmlType="submit">
            Submit
        </Button>
        </Form.Item>
    </Form>
    );    
}

export default GovindDaiBhukaUpdate;
