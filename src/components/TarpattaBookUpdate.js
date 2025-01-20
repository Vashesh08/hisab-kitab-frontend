import React, { useState, useEffect } from "react";
import { updateMeltingBook } from "../api/meltingBook.js";
import Loading from "./Loading.js";
import { Button, Form, InputNumber, Input, DatePicker } from "antd";
import { postLossAcct, updateLossBook } from "../api/LossAcct.js";
import dayjs from 'dayjs';

function TarpattaBookUpdate({handleOk, textData}) {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [numberOfIssueItems, setNumberOfIssueItems] = useState(textData.tarpattaIssue.length || 1);
    const [numberOfReceiveItems, setNumberOfReceiveItems] = useState(textData.tarpattaReceive.length || 1);
    const [numberOfBhukaItems, setNumberOfBhukaItems] = useState(textData.tarpattaBhuka.length || 1);
    const [issueItems, setIssueItems] = useState(textData.tarpattaIssue || [0, 0, 0, 0, 0]);
    const [receiveItems, setReceiveItems] = useState(textData.tarpattaReceive || [0, 0, 0, 0, 0]);
    const [bhukaItems, setBhukaItems] = useState(textData.tarpattaBhuka || [0, 0, 0, 0, 0]);
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
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
    };

    const handleNumberOfBhukaItems = (value) => {
        // console.log(value);
        if (value >= 1 && value <= 5) {
            setNumberOfBhukaItems(value);
          }
          // console.log(numberOfBhukaItems);
        }
  
    const handleNumberOfReceiveItems = (value) => {
        if (value >= 1 && value <= 5) {
            setNumberOfReceiveItems(value);
        }
        }
    
    const handleNumberOfIssueItems = (value) => {
        if (value >= 1 && value <= 5) {
            setNumberOfIssueItems(value);
        }
        }    

    
    useEffect(() => {
        setIsLoading(true);
        if (textData.tarpattaIssue.length > 0){
            setNumberOfIssueItems(textData.tarpattaIssue.length);
            setIssueItems(textData.tarpattaIssue);            
            }
        if (textData.tarpattaReceive.length > 0){
            setNumberOfReceiveItems(textData.tarpattaReceive.length);
            setReceiveItems(textData.tarpattaReceive);
        }
        if (textData.tarpattaBhuka.length > 0){
            setNumberOfBhukaItems(textData.tarpattaBhuka.length);
            setBhukaItems(textData.tarpattaBhuka);
        }
        
        setIsLoading(false);
    }, [textData]);

    const renderIssueItems = ()  => {
        return [...Array(numberOfIssueItems)].map((_, index) => (
            <Form.Item
            name={["user", `issueWeight${index}`]}
            label={`Issue Weight ${index+1}`}
            // initialValue={meltingIssueWt}
            initialValue={Number(issueItems[index])}
            rules={[{ type: "number", min: 0, required: true }]}
            // onChange={(e) => onChangeWt(e, "weight", index)}
            >
            <InputNumber/>
            </Form.Item>
    ))
    }

    const renderReceiveItems = ()  => {
        return [...Array(numberOfReceiveItems)].map((_, index) => (
            <Form.Item
            name={["user", `receiveWeight${index}`]}
            label={`Receive Weight ${index+1}`}
            // initialValue={meltingIssueWt}
            initialValue={Number(receiveItems[index])}
            rules={[{ type: "number", min: 0, required: true }]}
        //   onChange={(e) => onChangeWt(e, "weight", index)}
            >
            <InputNumber/>
            </Form.Item>
    ))
    }

    const renderBhukaItems = ()  => {
        return [...Array(numberOfBhukaItems)].map((_, index) => (
            <Form.Item
            name={["user", `bhukaWeight${index}`]}
            label={`Bhuka Weight ${index+1}`}
            // initialValue={meltingIssueWt}
            initialValue={Number(bhukaItems[index])}
            rules={[{ type: "number", min: 0, required: true }]}
        //   onChange={(e) => onChangeWt(e, "weight", index)}
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
            tarpattaDate,
            tarpattaDescription,
        } = user;
        
        const issueWeightKeys = [...Array(numberOfIssueItems)].map((_, index) => `issueWeight${index}`);
        const issueWeightValues = issueWeightKeys.map((key) => user[key]);

        const receiveWeightKeys = [...Array(numberOfReceiveItems)].map((_, index) => `receiveWeight${index}`);
        const receiveWeightValues = receiveWeightKeys.map((key) => user[key]);

        const bhukaWeightKeys = [...Array(numberOfBhukaItems)].map((_, index) => `bhukaWeight${index}`);
        const bhukaWeightValues = bhukaWeightKeys.map((key) => user[key]);


        if (textData.tarpattaIssue.length === 0){
        
            const backendData = {
                _id: textData._id,
                tarpattaDate: tarpattaDate,
                tarpattaDescription: tarpattaDescription,
                tarpattaIssue: issueWeightValues,
            };
            // console.log("Vashesh", backendData);
            await updateMeltingBook(backendData, token);

        }
        else if (textData.tarpattaLoss === undefined){
            let totalIssueQty = 0;
            for (let index = 0; index < numberOfIssueItems; index++) {
              totalIssueQty += issueWeightValues[index];
            }
            let totalReceiveQty = 0;
            let totalBhukaQty = 0;
            let totalLossQty = 0;
            for (let index = 0; index < numberOfReceiveItems; index++) {
              totalReceiveQty += receiveWeightValues[index];
            }
            for (let index = 0; index < numberOfBhukaItems; index++) {
              totalBhukaQty += bhukaWeightValues[index];
            }
            totalLossQty += totalIssueQty - totalReceiveQty - totalBhukaQty;
  
          if (totalLossQty >= 0){
            
            const backendData = {
              _id: textData._id,
              tarpattaIssue: issueWeightValues,
              tarpattaReceive: receiveWeightValues,
              tarpattaBhuka: bhukaWeightValues,
              tarpattaLoss: totalLossQty.toFixed(2),
              tarpattaDescription: tarpattaDescription,
            }

            await updateMeltingBook(backendData, token);
            
            const lossData = {
              "type": "Main Tarpatta",
              date: lastDate,
              "transactionId": textData._id,
              "lossWt": totalLossQty.toFixed(2),
              "description": "Main Tarpatta Loss"
            }

            await postLossAcct(lossData, token);
            
          }
        }
        else{

            let totalIssueQty = 0;
            for (let index = 0; index < numberOfIssueItems; index++) {
              totalIssueQty += issueWeightValues[index];
            }
            let totalReceiveQty = 0;
            let totalBhukaQty = 0;
            let totalLossQty = 0;
            for (let index = 0; index < numberOfReceiveItems; index++) {
              totalReceiveQty += receiveWeightValues[index];
            }
            for (let index = 0; index < numberOfBhukaItems; index++) {
              totalBhukaQty += bhukaWeightValues[index];
            }
            totalLossQty += totalIssueQty - totalReceiveQty - totalBhukaQty;
  
          if (totalLossQty >= 0){
            
            const backendData = {
              _id: textData._id,
              tarpattaIssue: issueWeightValues,
              tarpattaReceive: receiveWeightValues,
              tarpattaBhuka: bhukaWeightValues,
              tarpattaLoss: totalLossQty.toFixed(2),
              tarpattaDescription: tarpattaDescription,
            }

            await updateMeltingBook(backendData, token);
            
            const lossData = {
              "type": "Main Tarpatta",
              date: lastDate,
              "transactionId": textData._id,
              "lossWt": totalLossQty.toFixed(2),
              "description": "Main Tarpatta Loss"
            }

            await updateLossBook(lossData, token);
          
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
        name="nest-messages"
        onFinish={onFinish}
        style={{
        maxWidth: 600,
        }}
        validateMessages={validateMessages}
    >
        
    {(textData.tarpattaIssue.length === 0) ?(
        <>
        <Form.Item
            name={["user", "tarpattaDate"]}
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

          <Form.Item name={["user", "tarpattaDescription"]} label="Description">
            <Input />
          </Form.Item>

        <Form.Item
          name={["user", "issueItems"]}
          label="Number of Issue Items"
          rules={[
            { type: "number", min: 1, max: 5, required: true, step:1 }
          ]}
          initialValue={numberOfIssueItems}
        >
            <InputNumber
                onChange={handleNumberOfIssueItems}
            />
        </Form.Item>
        {renderIssueItems()}
        </>
    ): (
    <>

    <Form.Item name={["user", "tarpattaDescription"]} label="Description" initialValue={textData.tarpattaDescription || ""}>
        <Input/>
    </Form.Item>

    <Form.Item
        name={["user", "issueItems"]}
        label="Number of Issue Items"
        rules={[
        { type: "number", min: 1, max: 5, required: true, step:1 }
        ]}
        initialValue={numberOfIssueItems}
    >
    <InputNumber
        onChange={handleNumberOfIssueItems}
    />
    </Form.Item>
        {renderIssueItems()}
        

    <Form.Item
        name={["user", "receiveItems"]}
        label="Number of Receive Items"
        rules={[
        { type: "number", min: 1, max: 5, required: true, step:1 }
        ]}
        initialValue={numberOfReceiveItems}
    >
    <InputNumber
        onChange={handleNumberOfReceiveItems}
    />
    </Form.Item>

        {renderReceiveItems()}

    <Form.Item
        name={["user", "bhukaItems"]}
        label="Number of Bhuka Items"
        rules={[
        { type: "number", min: 1, max: 5, required: true, step:1 }
        ]}
        initialValue={numberOfBhukaItems}
    >

        <InputNumber
        onChange={handleNumberOfBhukaItems}
        />
    </Form.Item>

        {renderBhukaItems()}


    </>
    )}

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

export default TarpattaBookUpdate;
