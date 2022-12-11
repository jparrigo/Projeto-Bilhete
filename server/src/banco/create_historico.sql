CREATE TABLE historico_recarga (
    cod_bilhete VARCHAR2(30) NOT NULL,
    data_hora_recarga INTEGER DEFAULT(0),
    valor_bilhete NUMBER DEFAULT(0),
    tipo_bilhete VARCHAR2(30) DEFAULT('')
)

CREATE TABLE historico_utilizacao (
    cod_bilhete VARCHAR2(30) NOT NULL,
    data_hora_utilizacao INTEGER DEFAULT(0),
    valor_bilhete NUMBER DEFAULT(0),
    tipo_bilhete VARCHAR2(30) DEFAULT('')
)

SELECT * FROM historico_recarga;

drop table historico;