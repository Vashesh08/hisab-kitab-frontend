import React, { useState, useEffect } from "react";
import { updateGovindBook } from "../../api/govindBook.js";
import dayjs from 'dayjs'; // Import Day.js
import Loading from "../Loading.js";
import { Button, Form, InputNumber, Input, DatePicker, Select } from "antd";
import { postLossAcct, updateLossBook } from "../../api/LossAcct.js";


function GovindMachineBookUpdate({handleOk, textData}) {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [numberOfIssueItems, setNumberOfIssueItems] = useState(textData.machineIssue.length || 1);
    const [issueItems, setIssueItems] = useState(textData.machineIssue || [0, 0, 0, 0, 0]);
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

    const handleNumberOfIssueItems = (value) => {
        if (value >= 1 && value <= 5) {
          setNumberOfIssueItems(value);
        }
      }    

    
    useEffect(() => {
        setIsLoading(true);
        if (textData.machineIssue.length > 0){
            setNumberOfIssueItems(textData.machineIssue.length);
            setIssueItems(textData.machineIssue);            
          }
        setIsLoading(false);
    }, [textData]);


    const renderIssueItems = ()  => {
        return [...Array(numberOfIssueItems)].map((_, index) => (
            <Form.Item
          name={["user", `issueWeight${index}`]}
          label={`Issue Weight ${index+1}`}
          initialValue={Number(issueItems[index])}
          rules={[{ type: "number", min: 0, required: true }]}
          // onChange={(e) => onChangeWt(e, "weight", index)}
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
          machineDate,
          machineDescription,
          // issue22kActual,
          is_assigned_to
        } = user;

        
        const issueWeightKeys = [...Array(numberOfIssueItems)].map((_, index) => `issueWeight${index}`);
        const issueWeightValues = issueWeightKeys.map((key) => user[key]);


        console.log("Vashesh", issueWeightValues, textData.machineReceive,is_assigned_to);
        if (textData.machineReceive.length === 0){
          const backendData = {
            _id: textData._id,
            machineDate: machineDate,
            machineIssue: issueWeightValues,
            machineDescription: machineDescription,
            is_assigned_to: is_assigned_to
          }
          await updateGovindBook(backendData, token);
          }
        else{
          let totalIssueQty = 0;
          for (let index = 0; index < numberOfIssueItems; index++) {
            totalIssueQty += parseFloat(issueWeightValues[index]);
          }
          let totalReceiveQty = parseFloat(textData.machineReceive);
          let totalLossQty = 0;
          totalLossQty += totalIssueQty - totalReceiveQty;
          
          if (totalLossQty >= 0){
            const backendData = {
              _id: textData._id,
              machineDate: machineDate,
              machineDescription: machineDescription,
              machineIssue: issueWeightValues,
              machineLoss: totalLossQty.toFixed(2),
              is_assigned_to: is_assigned_to,
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
            name={["user", "machineDate"]}
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
          
          <Form.Item name={["user", "machineDescription"]} label="Description">
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

          <Form.Item
        name={["user", `is_assigned_to`]}
        label={`Assigned To`}
        rules={[
          {
            required: false,
          },
        ]}
        initialValue={textData.is_assigned_to || ""}
      >
        <Select
          options={[
            { value: "Dai + Bhuka", label: "Dai + Bhuka" },
            { value: "83.50 + 75 A/C", label: "83.50 + 75 A/C" },
          ]}
        />
      </Form.Item>

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

export default GovindMachineBookUpdate;
