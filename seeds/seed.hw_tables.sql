BEGIN; 

TRUNCATE 
    hw_timestamps,
    hw_barks,
    hw_users
    RESTART IDENTITY CASCADE;


insert into hw_users (user_id, name, user_name, password) values (1, 'Maryanne Errey', 'merrey0', '$2a$12$rbmLFCNIs3w/jntWJp7T5OaCcD6M4APSCMshfQOczq8Fi3o4A4W46');


insert into hw_barks (bark_id, barks) values (1, true);
insert into hw_barks (bark_id, barks) values (2, false);
insert into hw_barks (bark_id, barks) values (3, true);


insert into hw_timestamps (ts_id, timestamp, comment, volume, media_id, userId) values (1, '01:25:00', 'Crazy Loud', 'High', 'tt9397902', 1);
insert into hw_timestamps (ts_id, timestamp, comment, volume, media_id, userId) values (2, '03:25:00', 'Not too loud', 'Low', 'tt9397902', 1);
insert into hw_timestamps (ts_id, timestamp, comment, volume, media_id, userId) values (3, '03:25:32', 'Kinda Loud', 'Medium', 'tt9397902', 1);


COMMIT;
