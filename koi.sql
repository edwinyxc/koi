/**
static
 */
CREATE TABLE `t_property` (
  id      VARCHAR(64) PRIMARY KEY,
  name    VARCHAR(50) NOT NULL,
  value   VARCHAR(255) COMMENT 'default value',
  process VARCHAR(64),
  UNIQUE (`process`, `name`)
);


CREATE TABLE `t_element` (
  id           VARCHAR(64) PRIMARY KEY,
  x            INT(11),
  y            INT(11),
  name         VARCHAR(50),
  `process`    VARCHAR(64),

/**
Activity
 */
  act_url      VARCHAR(2048),
  act_method   VARCHAR(6),
  act_params   VARCHAR(4096),

/**
* Synchronizer
* TODO If it`s possible to make this more flexible, supporting complex conditions???
**/
  syn_strategy VARCHAR(3) DEFAULT 'any'
  COMMENT 'any or all',

  `type`       CHAR(1) COMMENT 'a for activity and s for synchronizer'
);
CREATE TABLE `t_transition` (
  id        VARCHAR(64) PRIMARY KEY,
  `from`      VARCHAR(64) NOT NULL
  COMMENT 'from element',
  `to`        VARCHAR(64) NOT NULL
  COMMENT 'to element',
  `condition` VARCHAR(1000),
  name      VARCHAR(50) DEFAULT '',
  `process` VARCHAR(64),
  UNIQUE (`process`, `from`, `to`)
);

CREATE TABLE `t_process` (
  id   VARCHAR(64) PRIMARY KEY,
  name VARCHAR(50)
);

CREATE TABLE `t_process_instance` (
  id         VARCHAR(64) PRIMARY KEY,
  state      INT(2) DEFAULT 0
  COMMENT '0 -not started, 1 -working, 8-aborted, 9-finished ',
  name       VARCHAR(50),
  process    VARCHAR(64),
  addresser  VARCHAR(64) COMMENT 'who starts the process.',
  start_time BIGINT(20),
  end_time   BIGINT(20)
);

CREATE TABLE `t_log` (
  id               VARCHAR(64) PRIMARY KEY,
  process_instance VARCHAR(64),
  author           VARCHAR(64),
  time             BIGINT(20),
  log              VARCHAR(2048)
);

/**
@Runtime elements
 */
CREATE TABLE `r_process_instance_element` (
  process_instance VARCHAR(64),
  element          VARCHAR(64),
  `state`          INT(2) COMMENT '0 -unhandled 1 -waiting for complete 9 -closed',
  UNIQUE (process_instance, element)
);

/**
@Runtime transitions
 */
CREATE TABLE `r_process_instance_transition` (
  process_instance VARCHAR(64),
  result           VARCHAR(255) COMMENT 'result of condition',
  transition       VARCHAR(64),
  UNIQUE (process_instance, transition)
);

;
/**
@Runtime properties
 */
CREATE TABLE `r_process_instance_property` (
  process_instance VARCHAR(64),
  property         VARCHAR(64),
  value            VARCHAR(255) DEFAULT NULL,
  UNIQUE (process_instance, property)
);

