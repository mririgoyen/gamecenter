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
( 'created_avatar', 'You Look Good!', 'Created your first avatar.', NULL, 1, 0, 0 ),
( 'dkong_top3', 'Not Monkeying Around', 'Placed 1st, 2nd, or 3rd in Donkey Kong.', 'Jumpman T-Shirt Graphic', 1, 0, 0 ),
( 'dkong_tournament_winner', 'King Kong', 'Finished 1st place in a Donkey Kong tournament.', 'High Score T-Shirt Graphic', 1, 0, 0 ),
( 'extralife_2020', '#ForTheKids - 2020', 'Played a game during Extra Life Game Day 2020.', 'Extra Life T-Shirt Graphic', 1, 0, 0 ),
( 'extralife_2020_team', 'Extra Life Champions - 2020', 'Helped your team win the 2020 Extra Life Game Day.', 'Golden Controller T-Shirt Graphic', 1, 0, 1 ),
( 'galaga_top3', 'Galactic Hero', 'Placed 1st, 2nd, or 3rd in Galaga.', 'Gyaraga T-Shirt Graphic', 1, 0, 0 ),
( 'galaga_tournament_winner', 'Galactic Champion', 'Finished 1st place in a Galaga tournament.', 'High Score T-Shirt Graphic', 1, 0, 0 ),
( 'pacman_top3', 'Top Chomper', 'Placed 1st, 2nd, or 3rd in PAC-MAN.', 'PAC-MAN T-Shirt Graphic', 1, 0, 0 ),
( 'pacman_tournament_winner', 'Chomp Master', 'Finished 1st place in a PAC-MAN tournament.', 'High Score T-Shirt Graphic', 1, 0, 0 ),
( 'viewed_about', 'Easter Egg Hunter', 'Found the hidden About dialog.', NULL, 1, 1, 0 );
