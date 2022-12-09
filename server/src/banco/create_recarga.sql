CREATE TABLE Recarga (
    cod_recarga INTEGER PRIMARY KEY,
    cod_bilhete VARCHAR2(30) NOT NULL,
    tipo_recarga VARCHAR2(30) NOT NULL,
    data_hora_recarga INTEGER NOT NULL,
    valor_recarga NUMBER NOT NULL,
    status_recarga INTEGER NOT NULL
)


CREATE SEQUENCE recarga_id_seq;

CREATE TRIGGER recarga_id
BEFORE INSERT ON Recarga
FOR EACH ROW
BEGIN
  SELECT recarga_id_seq.nextval
  INTO :new.cod_recarga
  FROM dual;
END;

TRUNCATE TABLE RECARGA;

DROP TABLE RECARGA;
DROP SEQUENCE RECARGA_ID_SEQ;

SELECT * FROM RECARGA;
