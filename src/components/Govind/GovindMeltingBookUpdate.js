import React, { useState } from "react";
import { updateGovindMeltingBook } from "../../api/govind/govindMeltingBook.js";
import Loading from "../Loading.js";
import { Button, Form, InputNumber } from "antd";
import { postLossAcct } from "../../api/LossAcct.js";
import { postGovindTarPattaBook } from "../../api/govind/govindTarPatta.js";

function GovindMeltingBookUpdate({handleOk, textData}) {
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
        // console.log(user);
        
        const {
          recv_weight,
          // issue22kActual
        } = user;
        // console.log(recv_weight);
        const backendData = {
        _id: textData._id,
        // issue22kActual: issue22kActual,
        receive22k: String(recv_weight),
        loss22k: (textData.issue22kActual - recv_weight).toFixed(2)
        };
        // console.log("Vashesh", backendData);
        await updateGovindMeltingBook(backendData, token);

        const tarpattaData = {
            meltingWt: recv_weight,
            meltingId: textData._id,
        }
        await postGovindTarPattaBook(tarpattaData, token);
        
        if ((textData.issue22kActual - recv_weight) >= 0){
          const lossData = {
            "type": "Melting",
            "date": textData.date,
            "lossWt": (textData.issue22kActual - recv_weight).toFixed(2),
            "transactionId": textData._id,
            "description": "Melting Loss"
          }
          await postLossAcct(lossData, token)
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
        {/* <Form.Item
        name={["user", "issue22kActual"]}
        label="Issue Wt (Actual)"
        rules={[{ type: "number", min: 0, required: true }]}
        initialValue={Number(textData.issue22k)}
        >
        <InputNumber />
        </Form.Item> */}

        <Form.Item
        name={["user", "recv_weight"]}
        label="Receive Weight (gm)"
        rules={[{ type: "number", min: 0, required: true }]}
        >
        <InputNumber />
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

export default GovindMeltingBookUpdate;
