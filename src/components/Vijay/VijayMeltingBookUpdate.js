import React, { useState } from "react";
import { updateVijayBook } from "../../api/vijayBook.js";
import Loading from "../Loading.js";
import { Button, Form, InputNumber } from "antd";
import { postLossAcct } from "../../api/LossAcct.js";


function VijayMeltingBookUpdate({handleOk, textData}) {
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
        
        const temp = Array(5).fill("-1");

        // console.log(recv_weight);
        const backendData = {
        _id: textData._id,
        // issue22kActual: issue22kActual,
        meltingReceive: String(recv_weight.toFixed(2)),
        meltingLoss: (textData.meltingIssueActual - recv_weight).toFixed(2),
        is_melting_receiver_updated: true,
        solderDate: temp,
        solderLotNo: temp,
        solderItem: temp,
        solderMelting: temp,
        solderChainReceive: temp,
        solderPowder: temp,
        solderBhuka: temp,
        solderTotal: temp,
        solderR1: temp,
        solderR2: temp,
        is_solder_updated: temp,
        jointDate: temp,
        jointLotNo: temp,
        jointItem: temp,
        jointMelting: temp,
        jointChainIssue: temp,
        jointChainReceive: temp,
        jointPowder: temp,
        jointBhuka: temp,
        jointTotal: temp,
        jointR1: temp,
        jointR2: temp,
        is_joint_updated: temp,
        };
        // console.log("Vashesh", backendData);
        await updateVijayBook(backendData, token);

        // const tarpattaData = {
        //     meltingWt: recv_weight,
        //     meltingId: textData._id,
        // }
        // await postGovindTarPattaBook(tarpattaData, token);
        
        if ((textData.meltingIssueActual - recv_weight) > 0){
          const lossData = {
            "type": "Vijay Melting",
            "date": textData.meltingDate,
            "lossWt": (textData.meltingIssueActual - recv_weight).toFixed(2),
            "transactionId": textData._id,
            "description": "Vijay Melting Loss"
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

export default VijayMeltingBookUpdate;
