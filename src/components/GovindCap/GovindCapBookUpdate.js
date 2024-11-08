import React, { useState } from "react";
import { updateKareegarBook } from "../api/kareegarBook.js";
import Loading from "./Loading.js";
import { Button, Form, InputNumber } from "antd";
import { postLossAcct } from "../api/LossAcct.js";
import dayjs from 'dayjs';
import { getKareegarData, updateKareegarBalance } from "../api/kareegarDetail.js";

function GovindCapBookUpdate({handleOk, textData, kareegarId}) {
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
        
        const data =  await getKareegarData(1,100000000,token);
        const kareegarData = data.find(item => item._id === kareegarId);
        let balance = (parseFloat(kareegarData.balance));
        let beads_balance_last = (parseFloat(kareegarData.beads_balance));
  
        const {
          recv_weight,
          beads_recv_weight,
          // issue22kActual
        } = user;
        // console.log(recv_weight);
        if (!isNaN(beads_recv_weight)){
            const backendData = {
                _id: textData._id,
                recv_wt: recv_weight.toFixed(2),
                beads_recv_wt: beads_recv_weight.toFixed(2),
            };
            balance -= parseFloat(recv_weight);
            beads_balance_last -= parseFloat(beads_recv_weight);
            await updateKareegarBook(backendData, token);
        }
        else{
            const backendData = {
                _id: textData._id,
                recv_wt: recv_weight.toFixed(2),
            }
            balance -= parseFloat(recv_weight);
            await updateKareegarBook(backendData, token);
        }
        // console.log("Vashesh", backendData);
        
        // const updated = await updateMeltingBook(backendData, token);
        // console.log("Added ",updated);
        
        const kareegarBalanceData = {
            '_id': kareegarId,
            "balance": parseFloat(balance).toFixed(2),
            "beads_balance": parseFloat(beads_balance_last).toFixed(2)
        }
        await updateKareegarBalance(kareegarBalanceData, token);

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
        name={["user", "beads_recv_weight"]}
        label="Beads Receive"
        rules={[{ type: "number", min: 0 }]}
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

export default GovindCapBookUpdate;
