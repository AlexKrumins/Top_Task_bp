import React, { Component, Suspense } from "react";
import Nav from "../components/Nav";
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
    console.log("id", id)
    API.getTaskInfo(id)
      .then(res => {
        console.log(res.data)
        this.setState({taskSpotlight : res.data})
      })
  }

  
  render() {
    return (
      <Container fluid>
        <Nav uuid={this.state.uuid}/>
        <Row>
          <Col size="4"></Col>
          {/* <SmallButton 
            onClick={() => {window.location.replace("/dashboard/" + this.state.uuid)}}
            >
            Return to Dashboard
          </SmallButton>
          <SmallButton 
            onClick={() => {this.setState({taskSpotlight : {}})}}
            >
            Return to Task List
          </SmallButton> */}
        </Row>
        <Row>
          <Col size="3"></Col>
          <Col size="6">
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
        </Row>
        {this.state.taskSpotlight.id ? (
          <div>
            <h2>{this.state.taskSpotlight.title}</h2>
            <p><strong>Task Created</strong> {moment(this.state.taskSpotlight.createdAt).format('MMMM Do YYYY, h:mm:ss a')} </p>
            <p><strong>Task Last Updated</strong> {moment(this.state.taskSpotlight.updatedAt).format('MMMM Do YYYY, h:mm:ss a')} </p>
            <p><strong>Time Spent</strong> {(moment.utc(moment.duration(this.state.taskSpotlight.stashedTime, "ms").asMilliseconds()).format("H:mm:ss"))}</p>
            <p>{this.state.taskSpotlight.notes}</p>
          </div>
        ) : null}

        {this.state.taskList.map((task, index) => (
          <div 
            className={(task.id === this.state.taskSpotlight.id) ? "alert alert-primary" : "alert alert-secondary"}
            role="alert"
            key={task.id}
            id={task.id}
            onClick={() => {
              this.getTaskInfo(task.id)
            }}
          >
            <h4>{task.title}</h4>
            <p>Task Created: {moment(task.createdAt).format('MMMM Do YYYY, h:mm:ss a')} </p>
            <p>Time Spent: {(moment.utc(moment.duration(task.stashedTime, "ms").asMilliseconds()).format("H:mm:ss"))}</p>
          </div>
          ))
        }
      </Container>
    )
  }
}
export default Report;
