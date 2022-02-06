const express = require('express')
const app = express()
const WSserver = require('express-ws')(app)
const aWss = WSserver.getWss(app)
const cors = require('cors')
const fs = require('fs')
const path = require('path')

const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.ws('/', (ws, req) => {
    console.log("CONNECTION");
    //отправка сообщений с сервера
    ws.send(JSON.stringify("Success"))
    //обработка полученных сообщений
    ws.on('message', (msg) => {
        msg = JSON.parse(msg)
        switch(msg.method) {
            case 'connection':
                //здесь любая функция
                connectionHandler(ws, msg)
                break;
            case 'draw':
                broadcastConnection(ws, msg)
                break;
        }
    })
})
// сохранаяем изображение на сервер
app.post('/image', (req, res) => {
    try {
        //из Canvas.jsx мы получим снимок канваса (после каждого штриха), нужно убрать из этой строки 'data:image/png:base64", тогда
        // эти данные можно будет записать в файл в папке files, под именем ${req.query.id}.jpg, само изображение - data
        const data = req.body.img.replace(`data:image/png;base64,`, '')
        // console.log(typeof data);
        fs.writeFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`), data,  'base64')
        // возвращаем статус успешного запроса
        return res.status(200).json({message: 'Загружено'})
    } catch (e) {
        console.log(e);
        return res.status(500).json('error')
    }
})
app.get('/image', (req, res) => {
    try {
        console.log('in get')
        // получаем содержимое файла по указанному пути
        const file = fs.readFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`))
        //возвращаем то, что убирали из base64,  приводим содержимое файла также к этому формату
        const data = 'data:image/png;base64,' + file.toString('base64')
        // возвращаем data на клиент
        res.json(data)
    } catch (e) {
        console.log(e);
        return res.status(500).json('error')
    }
})

app.listen(PORT, () => console.log(`server started on port ${PORT}`))

const connectionHandler = (ws, msg) => {
    //присваиваем сессии id
    ws.id = msg.id
    //фнукция для широковещательной рассылки
    broadcastConnection(ws, msg)

}

const broadcastConnection = (ws, msg) => {
    //в поле clients хранятся все открытые вебсокеты на данный момент
    aWss.clients.forEach((client) => {
        if(client.id === msg.id) {
            client.send(JSON.stringify(msg))
        }
    })
}

/*
const btn = document.getElementById('btn')
const socket = new WebSocket('ws://localhost:5000/')

socket.onopen = () => {
        socket.send(JSOM.stringify({
        message: 'Hello!',
        method: 'connection',
        id: 123, 
        username: 'Kate'

    }))
}

socket.onmessage = (event) => {
    console.log('с сервера пришло сообщение', event.data)
}

btn.onClick =() => {
    socket.send('Привет, сервер!')
}

//отправить объект
btn.onClick = () => {
    socket.send(JSOM.stringify({
        message: 'Hello!',
        method: 'message',
        id: 123, 
        username: 'Kate'

    }))
}
*/