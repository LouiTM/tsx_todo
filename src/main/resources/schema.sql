create table if not exists final_todo (
    id INTEGER NOT NULL AUTO_INCREMENT,
    title varchar(20) not null,
    status varchar(10) not null,
    primary key(id)
);