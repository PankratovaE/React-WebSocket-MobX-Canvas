import React, { useEffect, useRef } from 'react';
import {observer} from 'mobx-react-lite';
import '../styles/canvas.scss';
import canvasState from '../store/canvasState';
import toolState from '../store/toolState';
import Brush from '../tools/Brush';
import Rect from '../tools/Rect';
import { Modal, Button } from 'react-bootstrap';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Eraser from '../tools/Eraser.js';
import Circle from '../tools/Circle.js';
import Line from '../tools/Line.js';


const Canvas = observer(() => {
    const canvasRef = useRef() //ссылка на сам canvas
    const usernameRef = useRef(null)
    const [modal, setModal] = useState(true)
    const params = useParams()
    

    useEffect(() => {
      canvasState.setCanvas(canvasRef.current)
      let ctx = canvasRef.current.getContext('2d')
      axios.get(`http://localhost:5000/image?id=${params.id}`)
          .then(response => {
            const img = new Image()
            img.src = response.data
            img.onload = () => {
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
                ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height)
            }
          })
  }, [])

    useEffect(() => {

      if (canvasState.username) {
        const socket = new WebSocket(`ws://localhost:5000/`)
        canvasState.setSocket(socket) //сохранияем в переменную состояния socket и sessionId
        canvasState.setSessionId(params.id)
        toolState.setTool(new Brush(canvasRef.current, socket, params.id))

      //устанавливаем соединение
      socket.onopen = () => {
        console.log('Подключение установлено');
        socket.send(JSON.stringify({
          id: params.id,
          username: canvasState.username,
          method: 'connection'
        }))
      }
        socket.onmessage = (event) => {
          let msg = JSON.parse(event.data)

          switch (msg.method) {
            case 'connection':
              console.log(`прльзователь ${msg.username} присоединился`)
              break
            case 'draw':
              drawHandler(msg)
              break
            default:
          }

        }
      }
    }, [canvasState.username])

    
    //когда пользователь зажал кнопку мыши, значит начал рисовать, 
    //toDataURL в этот момент делает как бы снимок канваса в момент начала рисования, кладем его в undoList
  
  const mouseDownHandler = () => {
    canvasState.pushToUndo(canvasRef.current.toDataURL())
    
  }

  //после каждого этапа рисования передаем снимок канваса на сервер, где будет происходить перезапись файла
    // с данным params.id, т.о. там всегда будет актуальная запись файла
    

  const mouseUpHandler = () => {
    axios.post(`http://localhost:5000/image?id=${params.id}`, {img: canvasRef.current.toDataURL()})
        .then(response => console.log(response.data))
  }


    const drawHandler = (msg) => {
      const figure = msg.figure
      const ctx = canvasRef.current.getContext('2d')
      switch (figure.type) {
        case "brush":
          Brush.draw(ctx, figure.x, figure.y, figure.strokeColor, figure.strokeWidth)
          break
        case "line":
          Line.draw(ctx, figure.x, figure.y, figure.strokeColor, figure.strokeWidth)
          break
        case "eraser":
          Eraser.draw(ctx, figure.x, figure.y, figure.strokeWidth)
          break
        case "rect":
          Rect.staticdraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.color, figure.stroke, figure.strokeWidth)
          break
        case "circle":
          Circle.staticdraw(ctx, figure.x, figure.y, figure.radius, figure.color, figure.stroke, figure.strokeWidth)
          break
        case "finish":
          ctx.beginPath()
          break
        default:
      }
    }

    const connectHandler = () => {
      canvasState.setUsername(usernameRef.current.value)
      setModal(false)
    }

  return (
    <div className="canvas">

      <Modal show={modal} onHide={() => {}}>
        <Modal.Header>
          <Modal.Title>Введите ваше имя</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="text" ref={usernameRef} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => connectHandler()}>
            Войти
          </Button>
        </Modal.Footer>
      </Modal>

      <canvas 
        onMouseDown={() => mouseDownHandler()}
        onMouseUp={() => mouseUpHandler()}
        ref={canvasRef} width={1200} height={800}>
      </canvas>

    </div>
  );
});

export default Canvas;