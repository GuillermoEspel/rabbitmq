# RabbitMQ

## Tecnologías

- amqplib

## Colas de mensajes

Una cola de mensajes es una forma de comunicación asíncrona entre servicios. Los mensajes se almacenan en la cola hasta que son procesados y se eliminan.
Cada mensaje debe procesarse una sola vez, por un solo consumidor.
![Alt text](docs/workflow-rabbitmq-768x106.png)

Existen tres actores principales:

- Una cola donde se almacenan los mensajes.
- Un productor o publicador, que envía mensajes a la cola.
- Un consumidor o suscriptor, que recupera los mensajes de la cola y hace alguna acción con dicho mensaje.

## ¿Qué es RabbitMQ?

RabbitMQ es un broker de mensajería o gestor de colas. Se pueden definir colas y aplicaciones que se conectaran a ellas para transferir o leer mensajes de ellas.

## RabbitMQ en docker

En la carpeta docker se encuentra definida una imagen de docker de RabbitMQ con un panel de administración para monitorizar las colas, los mensajes y las conexiones.
Cómo trabajar con el docker-compose:

1. Levantar la configuración de docker-compose:

```
npm run up-docker
```

3. Ir a http://localhost:15672 y loguearse con el usuario y contraseña, RABBITMQ_DEFAULT_USER y RABBITMQ_DEFAULT_PASSWORD respectivamente.

4. Cuando termine, baje docker-compose:

```
npm run down-docker
```

## Exchange Fanout

Tiene un comportamiento similar a un broadcast.
El productor envía el mensaje al exchange de tipo fanout.
Todos los consumidores que escuchen colas que esten bindeadas al exchange reciben el mensaje.
![Alt text](docs/fanout-exchange.png)

1. En la terminal 1, levantar un consumidor en una cola:

```
QUEUE=fanout-queue-1 node src/exchange-fanout/consumer.js
```

2. En la terminal 2, levantar un otro consumidor en otra cola:

```
QUEUE=fanout-queue-2 node src/exchange-fanout/consumer.js
```

3. En la terminal 3, ejecutar el productor:

```
node src/exchange-fanout/producer.js
```

4. El mensaje enviado por el productor es enviado al exchange, el mensaje se manda a cada cola que esté bindeada al exchange. Como cada consumidor está escuchando colas diferentes, cada uno recibe el mensaje una sola vez.

## Exchange direct

El publicador envía el mensaje al exchange que tenga un determinado nombre.
Todos los suscriptores que esten bindeados al exchange y coincidan exactamente con el nombre que reciben del mensaje.
![Alt text](docs/direct-exchange.png)

1. En la terminal 1, levantar un consumidor:

```
PATTERN=abc QUEUE=direct-queue-1  node src/exchange-direct/consumer.js
```

2. En la terminal 2, levantar otro consumidor:

```
PATTERN=def QUEUE=direct-queue-2  node src/exchange-direct/consumer.js
```

3. En la terminal 3, ejecutar el productor:

```
node src/exchange-direct/producer.js
```

4. El mensaje enviado por el productor es enviado al exchange con el patrón "abc", el mensaje se manda a cada cola que esté bindeada al exchange y tenga configurado el patrón "abc". Como solo hay un consumidor esperando el patrón "abc" este recibe el mensaje una sola vez, mientras que el otro consumidor no recibe ningún mensaje.

## Exchange topic

Similar al direct pero con patrones, no por valor exacto.
El publicador envía el mensaje al exchange con un determinado tópico.
Todos los suscriptores que esten esperando de colas bindeadas al exchange y coincidan con el tópico que reciben del mensaje.
![Alt text](docs/topic-exchange.png)

1. En la terminal 1, levantar un consumidor:

```
PATTERN=log.* QUEUE=topic-queue-1 node src/exchange-topic/consumer.js
```

2. En la terminal 2, levantar otro consumidor:

```
PATTERN=bug.* QUEUE=topic-queue-2 node src/exchange-topic/consumer.js
```

3. En la terminal 3, ejecutar el productor:

```
node src/exchange-topic/producer.js
```

4. El mensaje enviado por el productor es enviado al exchange con el routing key "log.warning", el mensaje se manda a cada cola que esté bindeada al exchange y tenga configurado un patrón que coincida con la routing key. Como solo hay un consumidor esperando un patrón coincidente "log.\*" este recibe el mensaje una sola vez, mientras que el otro consumidor no recibe ningún mensaje.
