CREATE TABLE Recarga (
    cod_bilhete VARCHAR2(30) NOT NULL,
    tipo_recarga VARCHAR2(30) NOT NULL,
    data_hora_recarga NUMBER NOT NULL,
    valor_recarga NUMBER NOT NULL,
    status_recarga INTEGER NOT NULL
)

TRUNCATE TABLE RECARGA;

DROP TABLE RECARGA;

SELECT * FROM RECARGA;
