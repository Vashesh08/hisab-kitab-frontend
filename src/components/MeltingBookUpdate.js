import React, { useState } from "react";
import { updateMeltingBook } from "../api/meltingBook.js";
import Loading from "./Loading.js";
import { Button, Form, InputNumber } from "antd";

function MeltingBookUpdate({handleOk, textData}) {
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
        const token = localStorage.getItem("token");
    
        setIsLoading(true);
        console.log(user);
        
        const {
          recv_weight,
        } = user;
        console.log(recv_weight);
        const backendData = {
        _id: textData._id,
        receive22k: String(recv_weight),
        loss22k: (textData.issue22k - recv_weight).toFixed(3)
        };
        console.log("Vashesh", backendData);
        const updated = await updateMeltingBook(backendData, token);
        console.log("Added ",updated);
    
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
        <Form.Item
        name={["user", "recv_weight"]}
        label="Receive Weight (gm)"
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
        <Button type="primary" style={{ background: "green", borderColor: "yellow" }} htmlType="submit">
            Submit
        </Button>
        </Form.Item>
    </Form>
    );    
    
}

export default MeltingBookUpdate;
