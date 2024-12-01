import React, { useState, useEffect } from "react";
import { updateGovindBook } from "../../api/govindBook.js";
import dayjs from 'dayjs'; // Import Day.js
import Loading from "../Loading.js";
import { Button, Form, InputNumber, Input, DatePicker, Select } from "antd";
import { postLossAcct, updateLossBook } from "../../api/LossAcct.js";


function GovindDaiBhuka835Update({handleOk, textData}) {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [numberOfDai835Items, setNumberOfDai835Items] = useState(textData.daiBhuka835Dai.length || 1);
    const [numberOfBhuka835Items, setNumberOfBhuka835Items] = useState(textData.daiBhuka835Bhuka.length || 1);
    const [dai835Items, setDai835Items] = useState(textData.daiBhuka835Dai || [0, 0, 0, 0, 0]);
    const [bhuka835Items, setBhuka835Items] = useState(textData.daiBhuka835Bhuka || [0, 0, 0, 0, 0]);
    const [lastDate, setDate] = useState(dayjs());

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
          setNumberOfBhuka835Items(value);
        }
      }
    
    const handleNumberOfDaiItems = (value) => {
        if (value >= 1 && value <= 5) {
          setNumberOfDai835Items(value);
        }
      }    

    
    useEffect(() => {
        setIsLoading(true);
        if (textData.daiBhuka835Dai.length > 0){
            setNumberOfDai835Items(textData.daiBhuka835Dai.length);
            setDai835Items(textData.daiBhuka835Dai);
          }
        if (textData.daiBhuka835Bhuka.length > 0){
            setNumberOfBhuka835Items(textData.daiBhuka835Bhuka.length);
            setBhuka835Items(textData.daiBhuka835Bhuka);
        }
        setIsLoading(false);
    }, [textData]);


    const renderDaiItems = ()  => {
        return [...Array(numberOfDai835Items)].map((_, index) => (
            <Form.Item
          name={["user", `daiBhuka835DaiWeight${index}`]}
          label={`Dai Weight ${index+1}`}
          initialValue={Number(dai835Items[index])}
          rules={[{ type: "number", min: 0, required: true }]}
          // onChange={(e) => onChangeWt(e, "weight", index)}
          >
          <InputNumber/>
          </Form.Item>
    ))
    }

    const renderBhukaItems = ()  => {
        return [...Array(numberOfBhuka835Items)].map((_, index) => (
            <Form.Item
          name={["user", `daiBhuka835BhukaWeight${index}`]}
          label={`Bhuka Weight ${index+1}`}
          initialValue={Number(bhuka835Items[index])}
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
          daiBhuka835Date,
          daiBhuka835Description,
        } = user;

        
        const daiBhuka835DaiWeightKeys = [...Array(numberOfDai835Items)].map((_, index) => `daiBhuka835DaiWeight${index}`);
        const daiBhuka835DaiWeightValues = daiBhuka835DaiWeightKeys.map((key) => user[key]);

        const daiBhuka835BhukaWeightKeys = [...Array(numberOfBhuka835Items)].map((_, index) => `daiBhuka835BhukaWeight${index}`);
        const daiBhuka835BhukaWeightValues = daiBhuka835BhukaWeightKeys.map((key) => user[key]);

        console.log(daiBhuka835BhukaWeightValues, daiBhuka835DaiWeightValues);
        let totalIssueQty = 0.0;
        for (let index = 0; index < textData.machine835Issue.length; index++) {
          totalIssueQty += parseFloat(textData.machine835Issue[index]);
        }
        
        let totalReceiveQty = 0.0;
        let totalLossQty = 0.0;
        for (let index = 0; index < numberOfDai835Items; index++) {
          totalReceiveQty += parseFloat(daiBhuka835DaiWeightValues[index]);
        }
        for (let index = 0; index < numberOfBhuka835Items; index++) {
          totalReceiveQty += isNaN(parseFloat(daiBhuka835BhukaWeightValues[index])) ? 0 : parseFloat(daiBhuka835BhukaWeightValues[index]);
        }
        totalLossQty += totalIssueQty - totalReceiveQty;
        
        console.log(totalLossQty,totalIssueQty, totalReceiveQty);
        if (totalLossQty >= 0){
          const backendData = {
            _id: textData._id,
            daiBhuka835Date: daiBhuka835Date,
            daiBhuka835Description: daiBhuka835Description,
            daiBhuka835Dai: daiBhuka835DaiWeightValues,
            daiBhuka835Bhuka: daiBhuka835BhukaWeightValues,
            machine835Receive: totalReceiveQty.toFixed(2),
            machine835Loss: totalLossQty.toFixed(2),
          }

          await updateGovindBook(backendData, token);
          
          const lossData = {
            "type": "Govind Machine 83.5",
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
            name={["user", "daiBhuka835Date"]}
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

          <Form.Item name={["user", "daiBhuka835Description"]} label="Description" initialValue={textData.daiBhuka835Description || ""}>
            <Input/>
          </Form.Item>

        <Form.Item
          name={["user", "dai835Items"]}
          label="Number of Dai Items"
          rules={[
            { type: "number", min: 1, max: 5, required: true, step:1 }
          ]}
          initialValue={numberOfDai835Items}
        >
        <InputNumber
          onChange={handleNumberOfDaiItems}
        />
      </Form.Item>
          {renderDaiItems()}
          

        <Form.Item
          name={["user", "daiBhuka835Items"]}
          label="Number of Bhuka Items"
          rules={[
            { type: "number", min: 1, max: 5, step:1 }
          ]}
          initialValue={numberOfBhuka835Items}
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

export default GovindDaiBhuka835Update;
