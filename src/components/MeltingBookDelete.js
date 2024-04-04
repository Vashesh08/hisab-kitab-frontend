import React, { useState } from "react";
import { deleteMeltingBookList } from "../api/meltingBook.js";
import Loading from "./Loading.js";
import { Button, Form } from "antd";

function MeltingBookDelete({handleOk, textData}) {
    const [isLoading, setIsLoading] = useState(false);
      
    const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
    };

    const onFinish = async () => {
        console.log(textData);
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
    > 
        Are you sure you want to delete the selected rows?
        <Button className="bg-[#ABD6DFFF] text-black hover:!bg-gray-800 hover:!text-white active:!bg-gray-800 active:!text-white focus-visible:!outline-none" htmlType="submit">
            Yes
        </Button>
        <Button className="bg-[#ABD6DFFF] text-black hover:!bg-gray-800 hover:!text-white active:!bg-gray-800 active:!text-white focus-visible:!outline-none" htmlType="submit">
            No
        </Button>
    </Form>
    );    
    
}

export default MeltingBookDelete;
