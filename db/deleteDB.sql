START TRANSACTION;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE `user`;
DROP TABLE `vo_settings`;
SET FOREIGN_KEY_CHECKS = 1;

COMMIT;
