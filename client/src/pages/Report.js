import React, { Component, Suspense } from "react";
import Nav from "../components/Nav";
import { SuccessBtn, InfoBtn} from "../components/Form";
import {Container, Row, Col} from "../components/Grid";
import Share from "../components/share.png"
import API from "../utils/API";
import ListItem from "components/ListItem";
import PieChart from "react-minimal-pie-chart"
import ReactMinimalPieChart from "react-minimal-pie-chart"
import moment from "moment";
import { SmallButton } from "components/Form";

// const displayTime = (moment.utc(moment.duration(task.stashedTime, "ms").asMilliseconds()).format("H:mm:ss"))
const FULL_WIDTH = 50
const NORMAL_WIDTH = 40

class Report extends Component {
  state = {
    taskSpotlight: {},
    taskList: [],
    id: this.props.match.params.id,
    uuid: this.props.match.params.uuid,
    chartData: [],
    clickData: 0,
  };

  componentDidMount = () => {
    this.loadTask();
    console.log(this.state)
  }
  
  loadTask = () => {
    if (this.state.id) {
      API.getTaskInfo(this.state.id)
      .then(res => {
        const taskSpotlight = res.data
        this.setState({taskSpotlight})
      })
    } 
    API.getTasks(this.state.uuid)
    .then(res => {
      console.log(res.data)
      const taskList = res.data
      let chartData = []
      for (let i=0; i < res.data.length; i++) {
        if(res.data[i].favorite || res.data[i].active || res.data[i].topTask){
          chartData.push({title: res.data[i].title, value: moment.duration(res.data[i].stashedTime, "ms").asMilliseconds(), color: '#'+Math.random().toString(16).substr(-6), key: res.data[i].id, style: {strokeWidth: NORMAL_WIDTH}})
        }
      }
      this.setState({taskList, chartData})
    })
  }

  getTaskInfo = id => {
    API.getTaskInfo(id)
      .then(res => {
        this.setState({taskSpotlight : res.data})
      })
  }

  render() {
    return (
      <Container fluid>
        <Nav uuid={this.state.uuid}/>
        <Row>
          <Col size="4">
            {this.state.chartData.length > 0 ? 
              <ReactMinimalPieChart
              data={this.state.chartData}
              // style={{width: "60%"}}
              label={({ data, dataIndex }) => Math.round(data[dataIndex].percentage) + '%' }
              // label={({ data, dataIndex }) => Math.round(data[dataIndex].percentage) + '% \n' + data[dataIndex].title.replace(/ .*/, '')}
              labelPosition={70}
              labelStyle={{
                fontSize: '5px',
                fontFamily: 'sans-serif',
                fill: '#121212'
              }}
              animate={true}
              animationDuration={2000}
              
              onClick={(event, chartData, index) => {
                this.getTaskInfo(chartData[index].key)
                const data = chartData.map((entry, i) => {
                  return {
                    ...entry,
                    ...{
                      style: {
                        ...entry.style,
                        strokeWidth: i === index ? FULL_WIDTH : NORMAL_WIDTH,
                      },
                    },
                  };
                });

                this.setState({
                  chartData: data,
                });
              }}
              />
            : null}
          </Col>
          <Col size="4">
            {this.state.taskSpotlight.id ? (
              <div>
                <h2>
                  {this.state.taskSpotlight.title}
                  <InfoBtn onClick={() => {
                    console.log("info button clicked")
                  }}/> 
                </h2>
                <p><strong>Task Created</strong> {moment(this.state.taskSpotlight.createdAt).format('MMMM Do YYYY, h:mm:ss a')} </p>
                <p><strong>Task Last Updated</strong> {moment(this.state.taskSpotlight.updatedAt).format('MMMM Do YYYY, h:mm:ss a')} </p>
                <p><strong>Time Spent</strong> {(moment.utc(moment.duration(this.state.taskSpotlight.stashedTime, "ms").asMilliseconds()).format("H:mm:ss"))}</p>
                <p>{this.state.taskSpotlight.notes}</p>
              </div>
            ) : null}
          </Col>
          <Col size="4">
            <ul className={"list-group"}>
              {this.state.chartData.map((task, index) => (
                <li 
                  className={(task.key === this.state.taskSpotlight.id) ? "list-group-item active" : "list-group-item"}
                  role="alert"
                  key={task.key}
                  id={task.key}
                  onClick={() => {
                    this.getTaskInfo(task.key)
                    const data = this.state.chartData.map((entry, key) => {
                      return {
                        ...entry,
                        ...{
                          style: {
                            ...entry.style,
                            strokeWidth: entry.key === task.key ? FULL_WIDTH : NORMAL_WIDTH,
                          },
                        },
                      };
                    });
                    this.setState({
                      chartData: data,
                    });
                  }}
                >
                <p>{task.title}</p>
              </li>
              ))}
            </ul>
          </Col>
        </Row>
      </Container>
    )
  }
}
export default Report;
