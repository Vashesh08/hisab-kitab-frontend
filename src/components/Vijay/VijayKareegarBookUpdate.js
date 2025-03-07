import React, { useState, useEffect } from "react";
import { updateVijayBook } from "../../api/vijayBook.js";
import dayjs from 'dayjs'; // Import Day.js
import Loading from "../Loading.js";
import { Button, Form, InputNumber, Input, DatePicker } from "antd";
import { postLossAcct, updateLossBook } from "../../api/LossAcct.js";


function VijayKareegarBookUpdate({handleOk, textData}) {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [numberOfIssueItems, setNumberOfIssueItems] = useState(textData.vijayIssue.length || 1);
    const [numberOfReceiveItems, setNumberOfReceiveItems] = useState(textData.vijayReceive.length || 1);
    const [numberOfBhukaItems, setNumberOfBhukaItems] = useState(textData.vijayBhuka.length || 1);
    const [issueItems, setIssueItems] = useState(textData.vijayIssue || [0, 0, 0, 0, 0]);
    const [receiveItems, setReceiveItems] = useState(textData.vijayReceive || [0, 0, 0, 0, 0]);
    const [bhukaItems, setBhukaItems] = useState(textData.vijayBhuka || [0, 0, 0, 0, 0]);
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
        if (textData.vijayIssue.length > 0){
            setNumberOfIssueItems(textData.vijayIssue.length);
            setIssueItems(textData.vijayIssue);            
          }
        if (textData.vijayReceive.length > 0){
            setNumberOfReceiveItems(textData.vijayReceive.length);
            setReceiveItems(textData.vijayReceive);
        }
        if (textData.vijayBhuka.length > 0){
            setNumberOfBhukaItems(textData.vijayBhuka.length);
            setBhukaItems(textData.vijayBhuka);
        }
        //("loaded");
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
            vijayDate,
            vijayDescription,
          // issue22kActual
        //   issue_to_kareegar
        } = user;

        
        const issueWeightKeys = [...Array(numberOfIssueItems)].map((_, index) => `issueWeight${index}`);
        const issueWeightValues = issueWeightKeys.map((key) => user[key]);

        const receiveWeightKeys = [...Array(numberOfReceiveItems)].map((_, index) => `receiveWeight${index}`);
        const receiveWeightValues = receiveWeightKeys.map((key) => user[key]);

        const bhukaWeightKeys = [...Array(numberOfBhukaItems)].map((_, index) => `bhukaWeight${index}`);
        const bhukaWeightValues = bhukaWeightKeys.map((key) => user[key]);

        //console.log("Vashesh", issueWeightValues, receiveWeightValues, bhukaWeightValues, textData);
        if (textData.vijayIssue.length === 0){
          const backendData = {
            _id: textData._id,
            vijayDate: vijayDate,
            vijayIssue: issueWeightValues,
            vijayDescription: vijayDescription
          }
          await updateVijayBook(backendData, token);
        }
        else if (textData.vijayLoss === undefined){
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
          
          // const temp = Array(numberOfReceiveItems).fill("-1");
          if (totalLossQty > 0){
            const backendData = {
              _id: textData._id,
              vijayDescription: vijayDescription,
              vijayIssue: issueWeightValues,
              vijayReceive: receiveWeightValues,
              solderChainIssue: receiveWeightValues,
              vijayBhuka: bhukaWeightValues,
              vijayLoss: totalLossQty.toFixed(2),
              // solderDate: temp,
              // solderLotNo: temp,
              // solderItem: temp,
              // solderMelting: temp,
              // solderChainReceive: temp,
              // solderPowder: temp,
              // solderBhuka: temp,
              // solderTotal: temp,
              // solderR1: temp,
              // solderR2: temp,
              // is_solder_updated: temp,
              // jointDate: temp,
              // jointLotNo: temp,
              // jointItem: temp,
              // jointMelting: temp,
              // jointChainIssue: temp,
              // jointChainReceive: temp,
              // jointPowder: temp,
              // jointBhuka: temp,
              // jointTotal: temp,
              // jointR1: temp,
              // jointR2: temp,
              // is_joint_updated: temp,
            }

            await updateVijayBook(backendData, token);
            
            const lossData = {
              "type": "Vijay Kareegar",
              date: lastDate,
              "transactionId": textData._id,
              "lossWt": totalLossQty.toFixed(2),
              "description": "Vijay Kareegar Loss"
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
          
          // const temp = Array(numberOfReceiveItems).fill("-1");
          
          if (totalLossQty > 0){
            const backendData = {
              _id: textData._id,
              vijayDescription: vijayDescription,
              vijayIssue: issueWeightValues,
              vijayReceive: receiveWeightValues,
              solderChainIssue: receiveWeightValues,
              vijayBhuka: bhukaWeightValues,
              vijayLoss: totalLossQty.toFixed(2),
              // solderDate: temp,
              // solderLotNo: temp,
              // solderItem: temp,
              // solderMelting: temp,
              // solderChainReceive: temp,
              // solderPowder: temp,
              // solderBhuka: temp,
              // solderTotal: temp,
              // solderR1: temp,
              // solderR2: temp,
              // is_solder_updated: temp,
              // jointDate: temp,
              // jointLotNo: temp,
              // jointItem: temp,
              // jointMelting: temp,
              // jointChainIssue: temp,
              // jointChainReceive: temp,
              // jointPowder: temp,
              // jointBhuka: temp,
              // jointTotal: temp,
              // jointR1: temp,
              // jointR2: temp,
              // is_joint_updated: temp,
            }

            await updateVijayBook(backendData, token);
            
            const lossData = {
              "type": "Vijay Kareegar",
              date: lastDate,
              "transactionId": textData._id,
              "lossWt": totalLossQty.toFixed(2),
              "description": "Vijay Kareegar Loss"
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


      {(textData.vijayIssue.length === 0) ?(
        <>
          <Form.Item
            name={["user", "vijayDate"]}
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
          
          <Form.Item name={["user", "vijayDescription"]} label="Description">
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

        <Form.Item name={["user", "vijayDescription"]} label="Description" initialValue={textData.vijayDescription || ""}>
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

export default VijayKareegarBookUpdate;
