import { useState } from "react";
import React from "react";
import Loading from "./Loading";
import { Button, Form, InputNumber } from "antd";
import { updateKareegarBalance } from "../api/kareegarDetail.js";

function KareegarChangeBoxWt({ kareegarId, handleOk}) {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    
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
            boxWt
        } = user;

        const kareegarBalanceData = {
            '_id': kareegarId,
            "boxWt": boxWt
          }
          await updateKareegarBalance(kareegarBalanceData, token);
        

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
        name={["user", "boxWt"]}
        label="Box Weight (gm)"
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
export default KareegarChangeBoxWt;