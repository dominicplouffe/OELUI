import React, { useState, useEffect } from "react";
import Body from "../components/Body";
import { Card, Row, Col, Badge, Button } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import api from "../../utils/api";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

const Schedule = (props) => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [showSave, setShowSave] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [onCallUser, setOnCallUser] = useState(null);

  const { currentUser } = props;

  const fetchUsers = async () => {
    const { data = null, error = null } = await api(
      "/api/org_user/?ordering=created_on",
      "GET",
      {}
    );

    if (data) {
      const users = data.results.filter((u) => {
        return u.is_oncall && u.schedule;
      });

      users.sort((a, b) =>
        a.schedule.order > b.schedule.order
          ? 1
          : b.schedule.order > a.schedule.order
          ? -1
          : 0
      );

      setOnCallUser(users[currentUser.role.org.week - 1]);

      setUsers(users);
      generateCalendarEvents(users);
      setLoading(false);
    }

    if (error) {
      alert("Something went wrong!");
    }
  };

  const generateCalendarEvents = (users) => {
    const newEvents = [];

    let week = currentUser.role.org.week;

    let start = new Date();
    while (start.getDate() > 1) {
      start = new Date(start.setDate(start.getDate() - 1));
      if (start.getDay() === 1) {
        week = week - 1;
        if (week === 0) {
          console.log(users);
          week = users.length;
        }
      }
    }

    let calDate = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate()
    );
    let curUser = users[week - 1];
    // Generate Future Events
    for (let i = 0; i < 365; i++) {
      let day = `${calDate.getDate()}`;
      let month = `${calDate.getMonth() + 1}`;

      if (day.length === 1) {
        day = `0${day}`;
      }
      if (month.length === 1) {
        month = `0${month}`;
      }
      newEvents.push({
        title: `${curUser.first_name} ${curUser.last_name}`,
        date: `${calDate.getFullYear()}-${month}-${day}`,
        color: curUser.color,
      });
      calDate = new Date(calDate.setDate(calDate.getDate() + 1));

      if (calDate.getDay() === 0) {
        week++;
        if (week > users.length) {
          week = 1;
        }

        curUser = users[week - 1];
      }
    }

    setEvents(newEvents);
  };

  useEffect(() => {
    fetchUsers();

    // eslint-disable-next-line
  }, [refresh]);

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    for (let i = 0; i < result.length; i++) {
      const r = result[i];
      r.order = i + 1;
    }

    setUsers(result);
    setShowSave(true);
  };

  const handleSaveSchedule = async () => {
    const newOnCallUser = users[currentUser.role.org.week - 1];

    let doUpdate = true;
    if (newOnCallUser.id !== onCallUser.id) {
      doUpdate = window.confirm(
        `Your new schedule will result in having a different on-call user this week.\n\nPrevious User: ${onCallUser.first_name} ${onCallUser.last_name}\n\nNew User:  ${newOnCallUser.first_name} ${newOnCallUser.last_name}\n\nDo you wish to continue?`
      );
    }

    if (doUpdate) {
      for (let i = 0; i < users.length; i++) {
        const usr = users[i];
        await api("/api/org_user/update_user_order", "POST", {
          user_id: usr.id,
          new_index: usr.order,
        });
      }

      setRefresh(refresh + 1);
      setShowSave(false);
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    reorder(users, result.source.index, result.destination.index);
  };

  const getItemStyle = (isDragging, draggableStyle, item) => ({
    userSelect: "none",
    padding: "5px",
    margin: "0 0 5px 0",
    borderRadius: "5px",
    backgroundColor: isDragging ? "#ccc" : item.color,
    color: "#FFF",

    // styles we need to apply on draggables
    ...draggableStyle,
  });

  return (
    <Body title="Schedule" selectedMenu="schedule" loading={loading} {...props}>
      <Card>
        <Card.Body>
          <Row>
            <Col xs={12} lg={3}>
              <Card.Title>
                <Row>
                  <Col>On Call Schedule</Col>
                  <Col className="text-right">
                    <Badge pill variant="light">
                      <>
                        <span>Current Week </span>
                        <span className="form-label">
                          {currentUser.role.org.week}
                        </span>
                      </>
                    </Badge>
                  </Col>
                </Row>
              </Card.Title>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="mt-4"
                    >
                      {users.map((item, index) => (
                        <Draggable
                          key={index}
                          draggableId={`user-${index}`}
                          index={index}
                          isDragDisabled={currentUser.role.role !== "admin"}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style,
                                item
                              )}
                            >
                              {item.first_name} {item.last_name}
                              {item.schedule.order === item.org.week ? (
                                <span
                                  className="pl-2"
                                  role="img"
                                  aria-label="is-on-call"
                                >
                                  📱
                                </span>
                              ) : null}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
              {showSave && (
                <Row className="mt-3 mb-3">
                  <Col>
                    <Button
                      type="custom"
                      className="btn btn-block btn-primary"
                      onClick={() => handleSaveSchedule()}
                    >
                      Save Schedule
                    </Button>
                  </Col>
                </Row>
              )}

              <Card.Subtitle className="mt-4">
                This view displays your on-call schedule. You may drag and drop
                your team members up and down to change the order of the
                schedule.
              </Card.Subtitle>
            </Col>
            <Col>
              <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={events}
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Body>
  );
};

export default Schedule;
