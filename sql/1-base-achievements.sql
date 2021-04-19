USE game-center;

INSERT INTO `achievements` (
  `achievementId`,
  `name`,
  `description`,
  `rewards`,
  `obtainable`,
  `secret`,
  `hidden`
)
VALUES
( 'created_avatar', 'Looking Good!', 'Created your first avatar', 'SOMETHING', 1, 0, 0 ),
( 'dkong_top3', 'DKONG TOP 3', 'DKONG TOP 3 DESC', 'SOMETHING', 1, 0, 0 ),
( 'dkong_tournament_winner', 'DKONG TOURNY', 'DKONG TOURNY DESC', 'SOMETHING', 1, 0, 0 ),
( 'extralife_2020', 'EL2020', 'EL2020 DESC', 'SOMETHING', 1, 0, 0 ),
( 'extralife_2020_team', 'EL2020 TEAM', 'EL2020 TEAM DESC', 'SOMETHING', 1, 0, 0 ),
( 'galaga_top3', 'GALAGA TOP 3', 'GALAGA TOP 3 DESC', 'SOMETHING', 1, 0, 0 ),
( 'galaga_tournament_winner', 'GALAGA TOURNY', 'GALAGE TOURNY DESC', 'SOMETHING', 1, 0, 0 ),
( 'pacman_top3', 'PACMAN TOP 3', 'PACMAN TOP 3 DESC', 'SOMETHING', 1, 0, 0 ),
( 'pacman_tournament_winner', 'PACMAN TOURNY', 'PACMAN TOURNY DESC', 'SOMETHING', 1, 0, 0 ),
( 'viewed_about', 'VIEWED ABOUT', 'VIEWED ABOUT DESC', 'NOTHING', 1, 1, 1 );
