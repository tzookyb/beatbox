import React from "react";
import { Row, Col } from "antd";
import Avatar from '@material-ui/core/Avatar';

export const MessageBox = ({ text, submitBy, submitAt, avatar, own, type }) => {
  const date = new Date(submitAt);
  const dateToString = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;

  if (type === 'chat') {
    if (!own) {
      return (
        <div className="not-user-message">
          <Row type="flex" gutter={6} justify="center" align="top">
            <Col span={3}>
            </Col>
            <Col className="submit-mess-data flex align-center" offset={1} span={20}>
              <Avatar alt="Remy Sharp" src={avatar} style={{ width: '20px', height: '20px' }} />
              <p className="submit-by">{submitBy}</p>
              <p style={{ fontSize: "0.7em", fontStyle: "italic" }}>
                {dateToString}
              </p>
            </Col>
          </Row>

          <Row type="flex">
            <Col>
              <div className="chat-message"
                style={{
                  backgroundColor: " #b0a5a7",
                  color: "black",
                  borderRadius: "10px",
                  padding: "10px",
                  margin: "0px 10px 15px 10px",
                  // boxShadow: "1px 2px 3px #ccc",
                  width: "fit-content"
                }}
              >
                {text}
              </div>
            </Col>
          </Row>
        </div>
      )
    } else {
      return (
        <div className="user-message flex column" style={{ textAlign: "right" }}>
          <Col className="flex align-center justify-end">
            <p className="submit-by">You</p>
            <p style={{ fontSize: "0.7em", fontStyle: "italic" }}>
              {dateToString}
            </p>
          </Col>
          <Row type="flex" justify="end">
            <Col className="flex justify-end">
              <div
                style={{
                  backgroundColor: "rgb(154 111 203)  ",
                  color: "black",
                  borderColor: "#333",
                  borderRadius: "10px",
                  padding: "10px",
                  margin: "0px 10px 15px 10px",
                  // boxShadow: "1px 2px 3px #ccc",
                  textAlign: "right",
                  width: "fit-content",
                }}
              >
                {text}
              </div>
            </Col>
          </Row>
        </div>
      )
    }
  }
  else { 
    return (
      <div className="system-message" style={{ textAlign: "center" }}>
        <Col>
          <p style={{ fontSize: "0.7em", fontStyle: "italic" }}>
            {dateToString}
          </p>
        </Col>
        <Row type="flex" justify="end">
          <Col>
            <div
              style={{
                backgroundColor: "white",
                color: "black",
                borderColor: "#333",
                borderRadius: "10px 10px 10px 10px",
                padding: "5px",
                marginBottom: "15px",
                boxShadow: "1px 2px 3px #ccc",
                textAlign: "center",
                width: "fit-content",
                // margin: "0 20px",
                margin: "0 auto"
              }}
            >
              {text}
            </div>
          </Col>
        </Row>
      </div>
    )
  }
};

