CREATE DATABASE `game-center` /*!40100 DEFAULT CHARACTER SET latin1 */;

CREATE TABLE `achievements` (
  `achievementId` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` mediumtext NOT NULL,
  `rewards` mediumtext,
  `obtainable` tinyint(1) NOT NULL DEFAULT '1',
  `secret` tinyint(1) NOT NULL DEFAULT '0',
  `hidden` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`achievementId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `scores` (
  `scoreId` varchar(36) NOT NULL,
  `userId` varchar(36) NOT NULL,
  `gameId` varchar(36) NOT NULL,
  `score` int(11) NOT NULL,
  `lastModified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` varchar(7) NOT NULL DEFAULT 'playing',
  PRIMARY KEY (`scoreId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `user` (
  `userId` varchar(36) NOT NULL,
  `emailAddress` varchar(255) NOT NULL,
  `displayName` varchar(255) NOT NULL,
  `creationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modificationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `avatarConfig` mediumtext,
  `achievements` longtext,
  `admin` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`userId`),
  UNIQUE KEY `emailAddress_UNIQUE` (`emailAddress`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
