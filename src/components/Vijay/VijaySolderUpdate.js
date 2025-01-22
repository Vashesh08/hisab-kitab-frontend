import React, { useState, useEffect } from "react";
import { updateVijayBook } from "../../api/vijayBook.js";
import dayjs from 'dayjs'; // Import Day.js
import Loading from "../Loading.js";
import { Button, Form, InputNumber, Input, DatePicker, Select } from "antd";

function VijaySolderUpdate({handleOk, textData}) {
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
        // console.log("val", textData.solderR2[textData.index]);
        // console.log("array", textData.solderR2);
        setIsLoading(false);
    }, [textData]);

    const onFinish = async ({ user }) => {
        const token = localStorage.getItem("token");
    
        setIsLoading(true);
        const {
          solderDate,
          solderLotNo,
          solderItem,
          solderMelting,
          solderChainReceive,
          solderBhuka,
          solderR2,
        } = user;
        const solderTotal = parseFloat(solderChainReceive) + parseFloat(solderBhuka);
        const solderPowder = parseFloat(solderTotal) - parseFloat(textData.solderChainIssue[textData.index]);
        const solderR1 = (parseFloat(textData.solderChainIssue[textData.index]) * parseFloat(solderMelting)) / parseFloat(solderTotal);
        
        const updatedData = { ...textData };
        updatedData.solderDate[textData.index] = solderDate;
        updatedData.solderLotNo[textData.index] = solderLotNo;
        updatedData.solderItem[textData.index] = solderItem;
        updatedData.solderMelting[textData.index] = parseFloat(solderMelting).toFixed(2);
        updatedData.solderChainReceive[textData.index] = parseFloat(solderChainReceive).toFixed(2);
        updatedData.solderBhuka[textData.index] = parseFloat(solderBhuka).toFixed(2);
        updatedData.solderR2[textData.index] = parseFloat(solderR2).toFixed(2);
        updatedData.solderTotal[textData.index] = parseFloat(solderTotal).toFixed(2);
        updatedData.solderPowder[textData.index] = parseFloat(solderPowder).toFixed(2);
        updatedData.solderR1[textData.index] = parseFloat(solderR1).toFixed(2);
        updatedData.is_solder_updated[textData.index] = 1;
        console.log("updated", updatedData, solderPowder, solderR1);

        // const temp = Array(updatedData.solderChainReceive.length).fill("-1");

        const backendData = {
          _id: textData._id,
          solderDate: updatedData.solderDate,
          solderLotNo: updatedData.solderLotNo,
          solderItem: updatedData.solderItem,
          solderMelting: updatedData.solderMelting,
          solderChainReceive: updatedData.solderChainReceive,
          solderPowder: updatedData.solderPowder,
          solderBhuka: updatedData.solderBhuka,
          solderTotal: updatedData.solderTotal,
          solderR1: updatedData.solderR1,
          solderR2: updatedData.solderR2,
          is_solder_updated: updatedData.is_solder_updated,
        }

        console.log("updatedData", backendData);
        await updateVijayBook(backendData, token);

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
    {(textData.is_solder_updated[textData.index] !== "-1") ?(
      <>
      <Form.Item
        name={["user", "solderDate"]}
        label="Date"
        rules={[
          {
            type: "Date",
          },
        ]}
        initialValue={dayjs(textData.solderDate[textData.index])}
      >
        <DatePicker format="DD MMM, YYYY" disabledDate={disabledDate} />
      </Form.Item>

      <Form.Item name={["user", "solderLotNo"]} label="Lot no"
        initialValue={textData.solderLotNo[textData.index]}>
        <InputNumber />
      </Form.Item>

      <Form.Item name={["user", "solderItem"]} label="Item"
        initialValue={textData.solderItem[textData.index]}>
        <Input />
      </Form.Item>

      <Form.Item name={["user", "solderMelting"]} label="Melting"
      initialValue={textData.solderMelting[textData.index]}>
        <InputNumber />
      </Form.Item>

      <Form.Item name={["user", "solderChainIssue"]} label="Chain(I)">
        {textData.solderChainIssue[textData.index]}
      </Form.Item>

      <Form.Item name={["user", "solderChainReceive"]} label="Chain(R)"
      initialValue={textData.solderChainReceive[textData.index]}>
        <InputNumber />
      </Form.Item>

      <Form.Item name={["user", "solderBhuka"]} label="Bhuka"
      initialValue={textData.solderBhuka[textData.index]}>
        <InputNumber />
      </Form.Item>

      <Form.Item name={["user", "solderR2"]} label="R2"
      initialValue={textData.solderR2[textData.index]}>
        <InputNumber />
      </Form.Item>
      </>
    ):(
      <>
      <Form.Item
        name={["user", "solderDate"]}
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

      <Form.Item name={["user", "solderLotNo"]} label="Lot no">
        <InputNumber />
      </Form.Item>

      <Form.Item name={["user", "solderItem"]} label="Item">
        <Input />
      </Form.Item>

      <Form.Item name={["user", "solderMelting"]} label="Melting">
        <InputNumber />
      </Form.Item>

      <Form.Item name={["user", "solderChainIssue"]} label="Chain(I)">
        {textData.solderChainIssue[textData.index]}
      </Form.Item>

      <Form.Item name={["user", "solderChainReceive"]} label="Chain(R)">
        <InputNumber />
      </Form.Item>

      <Form.Item name={["user", "solderBhuka"]} label="Bhuka">
        <InputNumber />
      </Form.Item>

      <Form.Item name={["user", "solderR2"]} label="R2">
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

export default VijaySolderUpdate;
