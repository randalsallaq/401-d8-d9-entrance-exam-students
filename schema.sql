DROP TABLE IF EXISTS charactar;
CREATE TABLE charactar(
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR (255),
    patronus VARCHAR (255),
    alive VARCHAR (255),
    image VARCHAR (255)

)