import React, { useState, useEffect } from "react";
import { updateVijayBook } from "../../api/vijayBook.js";
import dayjs from 'dayjs'; // Import Day.js
import Loading from "../Loading.js";
import { Button, Form, InputNumber, Input, DatePicker, Select } from "antd";

function VijayJointUpdate({handleOk, textData}) {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
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

    
    useEffect(() => {
        setIsLoading(true);
        console.log("textData", textData);
        // console.log("val", textData.jointR2[textData.index]);
        // console.log("array", textData.jointR2);
        setIsLoading(false);
    }, [textData]);

    const onFinish = async ({ user }) => {
        const token = localStorage.getItem("token");
    
        setIsLoading(true);
        if (textData.is_joint_updated[textData.index] !== "-1"){
          const {
            jointDate,
            jointLotNo,
            jointItem,
            jointMelting,
            jointChainIssue,
            jointChainReceive,
            jointBhuka,
            jointR2,
          } = user;
          const jointTotal = parseFloat(jointChainReceive) + parseFloat(jointBhuka);
          const jointPowder = parseFloat(jointTotal) - parseFloat(textData.jointChainIssue);
          const jointR1 = (parseFloat(jointChainIssue) * parseFloat(jointMelting)) / parseFloat(jointTotal);
          
          const updatedData = { ...textData };
          updatedData.jointDate[textData.index] = jointDate;
          updatedData.jointLotNo[textData.index] = jointLotNo;
          updatedData.jointItem[textData.index] = jointItem;
          updatedData.jointMelting[textData.index] = parseFloat(jointMelting).toFixed(2);
          updatedData.jointChainIssue[textData.index] = parseFloat(jointChainIssue).toFixed(2);
          updatedData.jointChainReceive[textData.index] = parseFloat(jointChainReceive).toFixed(2);
          updatedData.jointBhuka[textData.index] = parseFloat(jointBhuka).toFixed(2);
          updatedData.jointR2[textData.index] = parseFloat(jointR2).toFixed(2);
          updatedData.jointTotal[textData.index] = parseFloat(jointTotal).toFixed(2);
          updatedData.jointPowder[textData.index] = parseFloat(jointPowder).toFixed(2);
          updatedData.jointR1[textData.index] = parseFloat(jointR1).toFixed(2);
          updatedData.is_joint_updated[textData.index] = 1;
          console.log("updated", updatedData, jointPowder, jointR1);

          // const temp = Array(updatedData.jointDate).fill("-1");

          const backendData = {
            _id: textData._id,
            jointDate: updatedData.jointDate,
            jointLotNo: updatedData.jointLotNo,
            jointItem: updatedData.jointItem,
            jointMelting: updatedData.jointMelting,
            jointChainIssue: updatedData.jointChainIssue,
            jointChainReceive: updatedData.jointChainReceive,
            jointPowder: updatedData.jointPowder,
            jointBhuka: updatedData.jointBhuka,
            jointTotal: updatedData.jointTotal,
            jointR1: updatedData.jointR1,
            jointR2: updatedData.jointR2,
            is_joint_updated: updatedData.is_joint_updated,
          }

          console.log("updatedData", backendData);
          await updateVijayBook(backendData, token);
        }else{
          const {
            jointDate,
            jointChainIssue,
          } = user;

          const updatedData = { ...textData };
          updatedData.jointDate[textData.index] = jointDate;
          updatedData.jointChainIssue[textData.index] = parseFloat(jointChainIssue).toFixed(2);
          updatedData.is_joint_updated[textData.index] = 1;
          
          const backendData = {
            _id: textData._id,
            jointDate: updatedData.jointDate,
            jointChainIssue: updatedData.jointChainIssue,
            is_joint_updated: updatedData.is_joint_updated,
          }

          console.log("updatedData", backendData);
          await updateVijayBook(backendData, token);
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
      {console.log("Vashesh test", textData, textData.is_joint_updated, textData.is_joint_updated[textData.index])}
    {(textData.jointChainIssue[textData.index] !== "-1" && textData.jointChainReceive[textData.index] === "-1")?(
      <>
      <Form.Item
        name={["user", "jointDate"]}
        label="Date"
        rules={[
          {
            type: "Date",
          },
        ]}
        initialValue={dayjs(textData.jointDate[textData.index])}
      >
        <DatePicker format="DD MMM, YYYY" disabledDate={disabledDate} />
      </Form.Item>

      <Form.Item name={["user", "jointLotNo"]} label="Lot no">
        <InputNumber />
      </Form.Item>

      <Form.Item name={["user", "jointItem"]} label="Item">
        <Input />
      </Form.Item>

      <Form.Item name={["user", "jointMelting"]} label="Melting">
        <InputNumber />
      </Form.Item>

      <Form.Item name={["user", "jointChainIssue"]} label="Chain(I)"
      initialValue={textData.jointChainIssue[textData.index]}>
        <InputNumber />
      </Form.Item>

      <Form.Item name={["user", "jointChainReceive"]} label="Chain(R)">
        <InputNumber />
      </Form.Item>

      <Form.Item name={["user", "jointBhuka"]} label="Bhuka">
        <InputNumber />
      </Form.Item>

      <Form.Item name={["user", "jointR2"]} label="R2">
        <InputNumber />
      </Form.Item>
      </>
    ): textData.is_joint_updated[textData.index] !== "-1"?(
      <>
      <Form.Item
        name={["user", "jointDate"]}
        label="Date"
        rules={[
          {
            type: "Date",
          },
        ]}
        initialValue={dayjs(textData.jointDate[textData.index])}
      >
        <DatePicker format="DD MMM, YYYY" disabledDate={disabledDate} />
      </Form.Item>

      <Form.Item name={["user", "jointLotNo"]} label="Lot no"
        initialValue={textData.jointLotNo[textData.index]}>
        <InputNumber />
      </Form.Item>

      <Form.Item name={["user", "jointItem"]} label="Item"
        initialValue={textData.jointItem[textData.index]}>
        <Input />
      </Form.Item>

      <Form.Item name={["user", "jointMelting"]} label="Melting"
      initialValue={textData.jointMelting[textData.index]}>
        <InputNumber />
      </Form.Item>

      <Form.Item name={["user", "jointChainIssue"]} label="Chain(I)"
      initialValue={textData.jointChainIssue[textData.index]}>
        <InputNumber />
      </Form.Item>

      <Form.Item name={["user", "jointChainReceive"]} label="Chain(R)"
      initialValue={textData.jointChainReceive[textData.index]}>
        <InputNumber />
      </Form.Item>

      <Form.Item name={["user", "jointBhuka"]} label="Bhuka"
      initialValue={textData.jointBhuka[textData.index]}>
        <InputNumber />
      </Form.Item>

      <Form.Item name={["user", "jointR2"]} label="R2"
      initialValue={textData.jointR2[textData.index]}>
        <InputNumber />
      </Form.Item>
      </>
    ) :(
      <>      
      <Form.Item
        name={["user", "jointDate"]}
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
      <Form.Item name={["user", "jointChainIssue"]} label="Chain(I)">
        <InputNumber />
      </Form.Item>
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

export default VijayJointUpdate;
