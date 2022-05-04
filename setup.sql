CREATE TABLE IF NOT EXISTS `users` (

    `id` serial PRIMARY KEY,
    `name` varchar(100) NOT NULL,
    `password` varchar(100) NOT NULL,
    `balance` int DEFAULT 0
) 
  -- `id` int(11) NOT NULL AUTO_INCREMENT,
  -- `book_name` varchar(50) NOT NULL,
  -- -- `book_review` varchar(50) NOT NULL,
  -- PRIMARY KEY (`id`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;